/**
 * DevExtreme (integration/knockout/event_registrator.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    ko = require("knockout"),
    isPlainObject = require("../../core/utils/type").isPlainObject,
    eventRegistrator = require("../../events/core/event_registrator"),
    eventUtils = require("../../events/utils");
eventRegistrator.callbacks.add(function(name) {
    var koBindingEventName = eventUtils.addNamespace(name, name + "Binding");
    ko.bindingHandlers[name] = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var $element = $(element),
                unwrappedValue = ko.utils.unwrapObservable(valueAccessor()),
                eventSource = unwrappedValue.execute ? unwrappedValue.execute : unwrappedValue;
            $element.off(koBindingEventName).on(koBindingEventName, isPlainObject(unwrappedValue) ? unwrappedValue : {}, function(e) {
                eventSource.call(viewModel, viewModel, e)
            })
        }
    }
});
