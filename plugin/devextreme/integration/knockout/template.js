/**
 * DevExtreme (integration/knockout/template.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    ko = require("knockout"),
    TemplateBase = require("../../ui/widget/ui.template_base"),
    domUtils = require("../../core/utils/dom");
var KoTemplate = TemplateBase.inherit({
    ctor: function(element) {
        this._element = element;
        this._template = $("<div>").append(domUtils.normalizeTemplateElement(element));
        this._registerKoTemplate()
    },
    _registerKoTemplate: function() {
        var template = this._template.get(0);
        new ko.templateSources.anonymousTemplate(template).nodes(template)
    },
    _prepareDataForContainer: function(data, container) {
        var containerElement, containerContext, result = data;
        if (container.length) {
            containerElement = container.get(0);
            data = void 0 !== data ? data : ko.dataFor(containerElement) || {};
            containerContext = ko.contextFor(containerElement);
            if (containerContext) {
                result = data === containerContext.$data ? containerContext : containerContext.createChildContext(data)
            } else {
                result = data
            }
        }
        return result
    },
    _renderCore: function(options) {
        var model = options.model;
        if (options.container) {
            model = this._prepareDataForContainer(model, options.container)
        }
        var $placeholder = $("<div>").appendTo(options.container);
        var $result;
        ko.renderTemplate(this._template.get(0), model, {
            afterRender: function(nodes) {
                $result = $(nodes)
            }
        }, $placeholder.get(0), "replaceNode");
        return $result
    },
    source: function() {
        return $(this._element).clone()
    },
    dispose: function() {
        this._template.remove()
    }
});
module.exports = KoTemplate;
