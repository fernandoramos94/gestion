/**
 * DevExtreme (ui/widget/ui.template_base.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    triggerShownEvent = require("../../core/utils/dom").triggerShownEvent,
    Class = require("../../core/class"),
    abstract = Class.abstract;
var renderedCallbacks = $.Callbacks();
var TemplateBase = Class.inherit({
    render: function(options) {
        options = options || {};
        var $result = this._renderCore(options);
        this._ensureResultInContainer($result, options.container);
        renderedCallbacks.fire($result, options.container);
        return $result
    },
    _ensureResultInContainer: function($result, $container) {
        if (!$container) {
            return
        }
        var resultInContainer = $.contains($container.get(0), $result.get(0));
        $container.append($result);
        if (resultInContainer) {
            return
        }
        var resultInBody = $.contains(document.body, $container.get(0));
        if (!resultInBody) {
            return
        }
        triggerShownEvent($result)
    },
    _renderCore: abstract
});
module.exports = TemplateBase;
module.exports.renderedCallbacks = renderedCallbacks;
