/**
 * DevExtreme (ui/widget/function_template.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var TemplateBase = require("./ui.template_base"),
    domUtils = require("../../core/utils/dom");
var FunctionTemplate = TemplateBase.inherit({
    ctor: function(render) {
        this._render = render
    },
    _renderCore: function(options) {
        return domUtils.normalizeTemplateElement(this._render(options))
    }
});
module.exports = FunctionTemplate;
