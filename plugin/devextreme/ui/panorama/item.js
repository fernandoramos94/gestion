/**
 * DevExtreme (ui/panorama/item.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    CollectionWidgetItem = require("../collection/item");
var PANORAMA_ITEM_TITLE_CLASS = "dx-panorama-item-title";
var PanoramaItem = CollectionWidgetItem.inherit({
    _renderWatchers: function() {
        this.callBase();
        this._startWatcher("title", this._renderTitle.bind(this))
    },
    _renderTitle: function(title) {
        this._$element.children("." + PANORAMA_ITEM_TITLE_CLASS).remove();
        if (!title) {
            return
        }
        var $header = $("<div>").addClass(PANORAMA_ITEM_TITLE_CLASS).text(title);
        this._$element.prepend($header)
    }
});
module.exports = PanoramaItem;