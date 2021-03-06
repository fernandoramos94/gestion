/**
 * DevExtreme (core/component_registrator.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../core/renderer"),
    jQuery = require("jquery"),
    errors = require("./errors"),
    MemorizedCallbacks = require("./memorized_callbacks"),
    publicComponentUtils = require("./utils/public_component");
var callbacks = new MemorizedCallbacks;
var registerComponent = function(name, namespace, componentClass) {
    if (!componentClass) {
        componentClass = namespace
    } else {
        namespace[name] = componentClass
    }
    publicComponentUtils.name(componentClass, name);
    callbacks.fire(name, componentClass)
};
registerComponent.callbacks = callbacks;
var registerJQueryComponent = function(name, componentClass) {
    $.fn[name] = jQuery.fn[name] = function(options) {
        var result, isMemberInvoke = "string" === typeof options;
        if (isMemberInvoke) {
            var memberName = options,
                memberArgs = $.makeArray(arguments).slice(1);
            this.each(function() {
                var instance = componentClass.getInstance(this);
                if (!instance) {
                    throw errors.Error("E0009", name)
                }
                var member = instance[memberName],
                    memberValue = member.apply(instance, memberArgs);
                if (void 0 === result) {
                    result = memberValue
                }
            })
        } else {
            this.each(function() {
                var instance = componentClass.getInstance(this);
                if (instance) {
                    instance.option(options)
                } else {
                    new componentClass(this, options)
                }
            });
            result = this
        }
        return result
    }
};
callbacks.add(registerJQueryComponent);
module.exports = registerComponent;
