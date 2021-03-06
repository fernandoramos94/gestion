/**
 * DevExtreme (ui/context_menu/ui.menu_base.edit.strategy.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    PlainEditStrategy = require("../collection/ui.collection_widget.edit.strategy.plain");
var MenuBaseEditStrategy = PlainEditStrategy.inherit({
    _getPlainItems: function() {
        return $.map(this._collectionWidget.option("items"), function getMenuItems(item) {
            return item.items ? [item].concat($.map(item.items, getMenuItems)) : item
        })
    },
    _stringifyItem: function(item) {
        var that = this;
        return JSON.stringify(item, function(key, value) {
            if ("template" === key) {
                return that._getTemplateString(value)
            }
            return value
        })
    },
    _getTemplateString: function(template) {
        var result;
        if ("object" === typeof template) {
            result = $(template).text()
        } else {
            result = template.toString()
        }
        return result
    }
});
module.exports = MenuBaseEditStrategy;
