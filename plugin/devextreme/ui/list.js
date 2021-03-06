/**
 * DevExtreme (ui/list.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var ListEdit = require("./list/ui.list.edit"),
    registerComponent = require("../core/component_registrator");
registerComponent("dxList", ListEdit);
module.exports = ListEdit;
module.exports.default = module.exports;
