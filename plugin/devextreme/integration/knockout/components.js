/**
 * DevExtreme (integration/knockout/components.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    Action = require("../../core/action"),
    compileGetter = require("../../core/utils/data").compileGetter,
    extend = require("../../core/utils/extend").extend,
    ko = require("knockout"),
    iconUtils = require("../../core/utils/icon"),
    clickEvent = require("../../events/click");
ko.bindingHandlers.dxAction = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var $element = $(element);
        var unwrappedValue = ko.utils.unwrapObservable(valueAccessor()),
            actionSource = unwrappedValue,
            actionOptions = {
                context: element
            };
        if (unwrappedValue.execute) {
            actionSource = unwrappedValue.execute;
            extend(actionOptions, unwrappedValue)
        }
        var action = new Action(actionSource, actionOptions);
        $element.off(".dxActionBinding").on(clickEvent.name + ".dxActionBinding", function(e) {
            action.execute({
                element: $element,
                model: viewModel,
                evaluate: function(expression) {
                    var context = viewModel;
                    if (expression.length > 0 && "$" === expression[0]) {
                        context = ko.contextFor(element)
                    }
                    var getter = compileGetter(expression);
                    return getter(context)
                },
                jQueryEvent: e
            });
            if (!actionOptions.bubbling) {
                e.stopPropagation()
            }
        })
    }
};
ko.bindingHandlers.dxControlsDescendantBindings = {
    init: function(_, valueAccessor) {
        return {
            controlsDescendantBindings: ko.unwrap(valueAccessor())
        }
    }
};
ko.bindingHandlers.dxIcon = {
    init: function(element, valueAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {},
            iconElement = iconUtils.getImageContainer(options);
        ko.virtualElements.emptyNode(element);
        if (iconElement) {
            ko.virtualElements.prepend(element, iconElement.get(0))
        }
    },
    update: function(element, valueAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {},
            iconElement = iconUtils.getImageContainer(options);
        ko.virtualElements.emptyNode(element);
        if (iconElement) {
            ko.virtualElements.prepend(element, iconElement.get(0))
        }
    }
};
ko.virtualElements.allowedBindings.dxIcon = true;
