/**
 * DevExtreme (client_exporter/file_saver.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../core/renderer"),
    errors = require("../ui/widget/ui.errors"),
    browser = require("../core/utils/browser"),
    commonUtils = require("../core/utils/common"),
    FILE_EXTESIONS = {
        EXCEL: "xlsx",
        CSS: "css",
        PNG: "png",
        JPEG: "jpeg",
        GIF: "gif",
        SVG: "svg",
        PDF: "pdf"
    };
var MIME_TYPES = exports.MIME_TYPES = {
    CSS: "text/css",
    EXCEL: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    PNG: "image/png",
    JPEG: "image/jpeg",
    GIF: "image/gif",
    SVG: "image/svg+xml",
    PDF: "application/pdf"
};
exports.fileSaver = {
    _getDataUri: function(format, data) {
        return "data:" + MIME_TYPES[format] + ";base64," + data
    },
    _linkDownloader: function(fileName, href, callback) {
        var exportLinkElement = document.createElement("a"),
            attributes = {
                download: fileName,
                href: href
            };
        document.body.appendChild(exportLinkElement);
        $(exportLinkElement).css({
            display: "none"
        }).text("load").attr(attributes)[0].click();
        return exportLinkElement
    },
    _formDownloader: function(proxyUrl, fileName, contentType, data, callback) {
        var formAttributes = {
                method: "post",
                action: proxyUrl,
                enctype: "multipart/form-data"
            },
            exportForm = $("<form>").css({
                display: "none"
            }).attr(formAttributes);
        exportForm.append('<input type="hidden" name="fileName" value="' + fileName + '" />');
        exportForm.append('<input type="hidden" name="contentType" value="' + contentType + '" />');
        exportForm.append('<input type="hidden" name="data" value="' + data + '" />');
        exportForm.appendTo("body");
        exportForm.submit();
        if (exportForm.submit()) {
            exportForm.remove()
        }
    },
    _saveByProxy: function(proxyUrl, fileName, format, data, callback) {
        return this._formDownloader(proxyUrl, fileName, MIME_TYPES[format], data, callback)
    },
    _winJSBlobSave: function(blob, fileName, format) {
        var savePicker = new Windows.Storage.Pickers.FileSavePicker;
        savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
        savePicker.fileTypeChoices.insert(MIME_TYPES[format], ["." + FILE_EXTESIONS[format]]);
        savePicker.suggestedFileName = fileName;
        savePicker.pickSaveFileAsync().then(function(file) {
            if (file) {
                file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function(outputStream) {
                    var inputStream = blob.msDetachStream();
                    Windows.Storage.Streams.RandomAccessStream.copyAsync(inputStream, outputStream).then(function() {
                        outputStream.flushAsync().done(function() {
                            inputStream.close();
                            outputStream.close()
                        })
                    })
                })
            }
        })
    },
    _saveBlobAs: function(fileName, format, data, linkClick) {
        this._blobSaved = false;
        if (commonUtils.isDefined(navigator.msSaveOrOpenBlob)) {
            navigator.msSaveOrOpenBlob(data, fileName);
            this._blobSaved = true
        } else {
            if (commonUtils.isDefined(window.WinJS)) {
                this._winJSBlobSave(data, fileName, format);
                this._blobSaved = true
            } else {
                var URL = window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL;
                linkClick = commonUtils.isDefined(linkClick) ? linkClick : function() {
                    var link = $("#dxExportLink");
                    URL.revokeObjectURL(link.attr("href"));
                    link.remove()
                };
                if (commonUtils.isDefined(URL)) {
                    return this._linkDownloader(fileName, URL.createObjectURL(data), linkClick)
                }
            }
        }
    },
    saveAs: function(fileName, format, data, proxyURL, linkClick) {
        fileName += "." + FILE_EXTESIONS[format];
        if (commonUtils.isFunction(window.Blob)) {
            this._saveBlobAs(fileName, format, data)
        } else {
            if (commonUtils.isDefined(proxyURL) && !commonUtils.isDefined(navigator.userAgent.match(/iPad/i))) {
                this._saveByProxy(proxyURL, fileName, format, data)
            } else {
                if (!commonUtils.isDefined(navigator.userAgent.match(/iPad/i))) {
                    errors.log("E1034")
                }
                if (browser.msie && parseInt(browser.version) < 10) {
                    return
                }
                this._linkDownloader(fileName, this._getDataUri(format, data), linkClick)
            }
        }
    }
};
