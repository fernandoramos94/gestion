/**
 * DevExtreme (ui/tree_list/ui.tree_list.master_detail.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var treeListCore = require("./ui.tree_list.core"),
    masterDetailModule = require("../grid_core/ui.grid_core.master_detail"),
    extend = require("../../core/utils/extend").extend;
treeListCore.registerModule("masterDetail", extend(true, {}, masterDetailModule, {
    extenders: {
        controllers: {
            data: {
                isRowExpanded: function() {
                    return this.callBase.apply(this, arguments)
                },
                _processItems: function() {
                    return this.callBase.apply(this, arguments)
                },
                _processDataItem: function() {
                    return this.callBase.apply(this, arguments)
                }
            }
        }
    }
}));
