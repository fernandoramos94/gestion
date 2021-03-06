/**
 * DevExtreme (ui/data_grid/ui.data_grid.data_controller.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var gridCore = require("./ui.data_grid.core"),
    dataSourceAdapterProvider = require("./ui.data_grid.data_source_adapter"),
    dataControllerModule = require("../grid_core/ui.grid_core.data_controller");
exports.DataController = dataControllerModule.controllers.data.inherit(function() {
    return {
        _getDataSourceAdapter: function() {
            return dataSourceAdapterProvider
        }
    }
}());
gridCore.registerModule("data", {
    defaultOptions: dataControllerModule.defaultOptions,
    controllers: {
        data: exports.DataController
    }
});
