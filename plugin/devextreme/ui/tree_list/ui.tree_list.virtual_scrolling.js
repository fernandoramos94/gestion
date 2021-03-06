/**
 * DevExtreme (ui/tree_list/ui.tree_list.virtual_scrolling.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var gridCore = require("./ui.tree_list.core"),
    dataSourceAdapter = require("./ui.tree_list.data_source_adapter"),
    virtualScrollingModule = require("../grid_core/ui.grid_core.virtual_scrolling"),
    extend = require("../../core/utils/extend").extend;
var oldDefaultOptions = virtualScrollingModule.defaultOptions;
gridCore.registerModule("virtualScrolling", extend({}, virtualScrollingModule, {
    defaultOptions: function() {
        return extend(true, oldDefaultOptions(), {
            scrolling: {
                mode: "virtual"
            }
        })
    }
}));
dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);
