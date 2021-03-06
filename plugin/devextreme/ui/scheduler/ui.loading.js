/**
 * DevExtreme (ui/scheduler/ui.loading.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    viewPortUtils = require("../../core/utils/view_port"),
    LoadPanel = require("../load_panel");
var loading = null;
var createLoadPanel = function(options) {
    return new LoadPanel($("<div>").appendTo(options && options.container || viewPortUtils.value()), options)
};
var removeLoadPanel = function() {
    if (!loading) {
        return
    }
    loading.element().remove();
    loading = null
};
exports.show = function(options) {
    removeLoadPanel();
    loading = createLoadPanel(options);
    return loading.show()
};
exports.hide = function() {
    if (!loading) {
        return $.Deferred().resolve()
    }
    return loading.hide().done(removeLoadPanel).promise()
};
