/**
 * DevExtreme (ui/toolbar/ui.toolbar.strategy.drop_down_menu.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var extend = require("../../core/utils/extend").extend,
    ToolbarStrategy = require("./ui.toolbar.strategy"),
    ToolbarMenu = require("./ui.toolbar.menu"),
    DropDownMenu = require("../drop_down_menu");
var DropDownMenuStrategy = ToolbarStrategy.inherit({
    NAME: "dropDownMenu",
    render: function() {
        if (!this._hasVisibleMenuItems()) {
            return
        }
        this._renderMenuButtonContainer();
        this._renderWidget()
    },
    renderMenuItems: function() {
        if (!this._menu) {
            this.render()
        }
        this.callBase();
        if (this._menu && !this._menu.option("items").length) {
            this._menu.close()
        }
    },
    _menuWidgetClass: function() {
        return DropDownMenu
    },
    _widgetOptions: function() {
        return extend(this.callBase(), {
            deferRendering: true,
            menuWidget: ToolbarMenu,
            popupPosition: {
                at: "bottom right",
                my: "top right"
            }
        })
    },
    _getMenuItems: function() {
        var menuItems = this.callBase(),
            isMenuVisible = menuItems.length && this._hasVisibleMenuItems(menuItems);
        this._toggleMenuVisibility(isMenuVisible);
        return menuItems
    },
    _toggleMenuVisibility: function(value) {
        if (!this._menuContainer()) {
            return
        }
        this._menuContainer().toggleClass("dx-state-invisible", !value)
    },
    _menuContainer: function() {
        return this._$menuButtonContainer
    }
});
module.exports = DropDownMenuStrategy;