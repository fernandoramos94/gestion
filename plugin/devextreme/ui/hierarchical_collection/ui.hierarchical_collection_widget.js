/**
 * DevExtreme (ui/hierarchical_collection/ui.hierarchical_collection_widget.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    dataCoreUtils = require("../../core/utils/data"),
    extend = require("../../core/utils/extend").extend,
    devices = require("../../core/devices"),
    iconUtils = require("../../core/utils/icon"),
    HierarchicalDataAdapter = require("./ui.data_adapter"),
    CollectionWidget = require("../collection/ui.collection_widget.edit"),
    BindableTemplate = require("../widget/bindable_template"),
    isFunction = commonUtils.isFunction,
    noop = commonUtils.noop;
var DISABLED_STATE_CLASS = "dx-state-disabled";
var HierarchicalCollectionWidget = CollectionWidget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            keyExpr: "id",
            displayExpr: "text",
            selectedExpr: "selected",
            disabledExpr: "disabled",
            itemsExpr: "items",
            hoverStateEnabled: true,
            parentIdExpr: "parentId",
            expandedExpr: "expanded"
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                return "desktop" === devices.real().deviceType && !devices.isSimulator()
            },
            options: {
                focusStateEnabled: true
            }
        }])
    },
    _init: function() {
        this.callBase();
        this._initAccessors();
        this._initDataAdapter();
        this._initDynamicTemplates()
    },
    _initDataSource: function() {
        this.callBase();
        this._dataSource && this._dataSource.paginate(false)
    },
    _initDataAdapter: function() {
        var accessors = this._createDataAdapterAccessors();
        this._dataAdapter = new HierarchicalDataAdapter(extend({
            dataAccessors: {
                getters: accessors.getters,
                setters: accessors.setters
            },
            items: this.option("items")
        }, this._getDataAdapterOptions()))
    },
    _getDataAdapterOptions: noop,
    _initDynamicTemplates: function() {
        this._defaultTemplates.item = new BindableTemplate(function($container, itemData) {
            $container.html(itemData.html).append(this._getIconContainer(itemData)).append(this._getTextContainer(itemData)).append(this._getPopoutContainer(itemData))
        }.bind(this), ["text", "html", "items", "icon", "iconSrc"], this.option("integrationOptions.watchMethod"), {
            text: this._displayGetter,
            items: this._itemsGetter
        })
    },
    _getIconContainer: function(itemData) {
        var icon = itemData.icon || itemData.iconSrc;
        return icon ? iconUtils.getImageContainer(icon) : void 0
    },
    _getTextContainer: function(itemData) {
        return $("<span>").text(itemData.text)
    },
    _getPopoutContainer: noop,
    _initAccessors: function() {
        var that = this;
        $.each(this._getAccessors(), function(_, accessor) {
            that._compileAccessor(accessor)
        })
    },
    _getAccessors: function() {
        return ["key", "display", "selected", "items", "disabled", "parentId", "expanded"]
    },
    _getChildNodes: function(node) {
        var that = this,
            arr = [];
        $.each(node.internalFields.childrenKeys, function(_, key) {
            var childNode = that._dataAdapter.getNodeByKey(key);
            arr.push(childNode)
        });
        return arr
    },
    _hasChildren: function(node) {
        return node && node.internalFields.childrenKeys.length
    },
    _compileAccessor: function(optionName) {
        var getter = "_" + optionName + "Getter",
            setter = "_" + optionName + "Setter",
            optionExpr = this.option(optionName + "Expr");
        if (!optionExpr) {
            this[getter] = noop;
            this[setter] = noop;
            return
        } else {
            if (isFunction(optionExpr)) {
                this[setter] = function(obj, value) {
                    obj[optionExpr()] = value
                };
                this[getter] = function(obj) {
                    return obj[optionExpr()]
                };
                return
            }
        }
        this[getter] = dataCoreUtils.compileGetter(optionExpr);
        this[setter] = dataCoreUtils.compileSetter(optionExpr)
    },
    _createDataAdapterAccessors: function() {
        var that = this,
            accessors = {
                getters: {},
                setters: {}
            };
        $.each(this._getAccessors(), function(_, accessor) {
            var getterName = "_" + accessor + "Getter",
                setterName = "_" + accessor + "Setter",
                newAccessor = "parentId" === accessor ? "parentKey" : accessor;
            accessors.getters[newAccessor] = that[getterName];
            accessors.setters[newAccessor] = that[setterName]
        });
        return accessors
    },
    _render: function() {
        this.callBase();
        this._focusTarget().addClass(this._widgetClass())
    },
    _widgetClass: noop,
    _renderItemFrame: function(index, itemData) {
        var $itemFrame = this.callBase.apply(this, arguments);
        $itemFrame.toggleClass(DISABLED_STATE_CLASS, !!this._disabledGetter(itemData));
        return $itemFrame
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "displayExpr":
            case "keyExpr":
                this._initAccessors();
                this._initDynamicTemplates();
                this.repaint();
                break;
            case "itemsExpr":
            case "selectedExpr":
            case "disabledExpr":
            case "expandedExpr":
            case "parentIdExpr":
                this._initAccessors();
                this._initDataAdapter();
                this.repaint();
                break;
            case "items":
                this._initDataAdapter();
                this.callBase(args);
                break;
            default:
                this.callBase(args)
        }
    }
});
module.exports = HierarchicalCollectionWidget;