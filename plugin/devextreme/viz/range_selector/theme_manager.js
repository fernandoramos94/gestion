/**
 * DevExtreme (viz/range_selector/theme_manager.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var BaseThemeManager = require("../core/base_theme_manager").BaseThemeManager;
exports.ThemeManager = BaseThemeManager.inherit({
    _themeSection: "rangeSelector",
    _fontFields: ["scale.label.font", "sliderMarker.font", "loadingIndicator.font", "export.font", "title.font", "title.subtitle.font"]
});
