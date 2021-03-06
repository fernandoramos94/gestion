/**
 * DevExtreme (ui/data_grid/ui.data_grid.editing.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
require("./ui.data_grid.editor_factory");
var gridCore = require("./ui.data_grid.core"),
    editingModule = require("../grid_core/ui.grid_core.editing");
gridCore.registerModule("editing", editingModule);
