/**
 * DevExtreme (ui/file_uploader.js)
 * Version: 17.1.5
 * Build date: Tue Aug 01 2017
 *
 * Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../core/renderer"),
    registerComponent = require("../core/component_registrator"),
    commonUtils = require("../core/utils/common"),
    extend = require("../core/utils/extend").extend,
    inArray = require("../core/utils/array").inArray,
    Editor = require("./editor/editor"),
    Button = require("./button"),
    ProgressBar = require("./progress_bar"),
    browser = require("../core/utils/browser"),
    devices = require("../core/devices"),
    eventUtils = require("../events/utils"),
    clickEvent = require("../events/click"),
    messageLocalization = require("../localization/message");
var FILEUPLOADER_CLASS = "dx-fileuploader",
    FILEUPLOADER_EMPTY_CLASS = "dx-fileuploader-empty",
    FILEUPLOADER_SHOW_FILE_LIST_CLASS = "dx-fileuploader-show-file-list",
    FILEUPLOADER_DRAGOVER_CLASS = "dx-fileuploader-dragover",
    FILEUPLOADER_FILEINPUT_TAG = "<input type='file'>",
    FILEUPLOADER_WRAPPER_CLASS = "dx-fileuploader-wrapper",
    FILEUPLOADER_CONTAINER_CLASS = "dx-fileuploader-container",
    FILEUPLOADER_CONTENT_CLASS = "dx-fileuploader-content",
    FILEUPLOADER_INPUT_WRAPPER_CLASS = "dx-fileuploader-input-wrapper",
    FILEUPLOADER_INPUT_CONTAINER_CLASS = "dx-fileuploader-input-container",
    FILEUPLOADER_INPUT_LABEL_CLASS = "dx-fileuploader-input-label",
    FILEUPLOADER_INPUT_CLASS = "dx-fileuploader-input",
    FILEUPLOADER_FILES_CONTAINER_CLASS = "dx-fileuploader-files-container",
    FILEUPLOADER_FILE_CONTAINER_CLASS = "dx-fileuploader-file-container",
    FILEUPLOADER_FILE_INFO_CLASS = "dx-fileuploader-file-info",
    FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS = "dx-fileuploader-file-status-message",
    FILEUPLOADER_FILE_CLASS = "dx-fileuploader-file",
    FILEUPLOADER_FILE_NAME_CLASS = "dx-fileuploader-file-name",
    FILEUPLOADER_FILE_SIZE_CLASS = "dx-fileuploader-file-size",
    FILEUPLOADER_BUTTON_CLASS = "dx-fileuploader-button",
    FILEUPLOADER_BUTTON_CONTAINER_CLASS = "dx-fileuploader-button-container",
    FILEUPLOADER_CANCEL_BUTTON_CLASS = "dx-fileuploader-cancel-button",
    FILEUPLOADER_UPLOAD_BUTTON_CLASS = "dx-fileuploader-upload-button",
    FILEUPLOADER_AFTER_LOAD_DELAY = 400;
var isFormDataSupported = function() {
    return !!window.FormData
};
var FileUploader = Editor.inherit({
    _supportedKeys: function() {
        var click = function(e) {
            e.preventDefault();
            var $selectButton = this._selectButton.element();
            $selectButton.trigger(clickEvent.name)
        };
        return extend(this.callBase(), {
            space: click,
            enter: click
        })
    },
    _setOptionsByReference: function() {
        this.callBase();
        extend(this._optionsByReference, {
            value: true
        })
    },
    _setDeprecatedOptions: function() {
        this.callBase();
        extend(this._deprecatedOptions, {
            buttonText: {
                since: "15.1",
                alias: "selectButtonText"
            },
            values: {
                since: "16.1",
                alias: "value"
            }
        })
    },
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            value: [],
            selectButtonText: messageLocalization.format("dxFileUploader-selectFile"),
            uploadButtonText: messageLocalization.format("dxFileUploader-upload"),
            labelText: messageLocalization.format("dxFileUploader-dropFile"),
            name: "files[]",
            multiple: false,
            accept: "",
            uploadUrl: "/",
            allowCanceling: true,
            showFileList: true,
            progress: 0,
            readyToUploadMessage: messageLocalization.format("dxFileUploader-readyToUpload"),
            uploadedMessage: messageLocalization.format("dxFileUploader-uploaded"),
            uploadFailedMessage: messageLocalization.format("dxFileUploader-uploadFailedMessage"),
            uploadMode: "instantly",
            uploadMethod: "POST",
            uploadHeaders: {},
            onUploadStarted: null,
            onUploaded: null,
            onProgress: null,
            onUploadError: null,
            onUploadAborted: null,
            extendSelection: true,
            validationMessageMode: "always",
            validationMessageOffset: {
                h: 0,
                v: 0
            },
            useNativeInputClick: false,
            useDragOver: true,
            nativeDropSupported: true
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                return "desktop" === devices.real().deviceType && !devices.isSimulator()
            },
            options: {
                focusStateEnabled: true
            }
        }, {
            device: [{
                platform: "android"
            }, {
                platform: "win"
            }],
            options: {
                validationMessageOffset: {
                    v: 0
                }
            }
        }, {
            device: function() {
                return browser.msie && browser.version <= 10
            },
            options: {
                uploadMode: "useForm",
                useNativeInputClick: true
            }
        }, {
            device: function() {
                return "generic" !== devices.real().platform
            },
            options: {
                useDragOver: false
            }
        }, {
            device: function() {
                return !isFormDataSupported()
            },
            options: {
                uploadMode: "useForm"
            }
        }, {
            device: function() {
                return browser.msie || "generic" !== devices.real().platform
            },
            options: {
                nativeDropSupported: false
            }
        }])
    },
    _init: function() {
        this.callBase.apply(this, arguments);
        this._initFileInput();
        this._initLabel();
        this._createFiles();
        this._createUploadStartedAction();
        this._createUploadedAction();
        this._createProgressAction();
        this._createUploadErrorAction();
        this._createUploadAbortedAction()
    },
    _initFileInput: function() {
        this._isCustomClickEvent = false;
        if (!this._$fileInput) {
            this._$fileInput = $(FILEUPLOADER_FILEINPUT_TAG);
            this._$fileInput.on("change", this._inputChangeHandler.bind(this)).on("click", function(e) {
                e.stopPropagation();
                return this.option("useNativeInputClick") || this._isCustomClickEvent
            }.bind(this))
        }
        this._$fileInput.prop({
            multiple: this.option("multiple"),
            accept: this.option("accept"),
            tabindex: -1
        })
    },
    _inputChangeHandler: function() {
        if (this._doPreventInputChange) {
            return
        }
        var fileName = this._$fileInput.val().replace(/^.*\\/, ""),
            files = this._$fileInput.prop("files");
        if (files && !files.length) {
            return
        }
        var value = files ? this._getFiles(files) : [{
            name: fileName
        }];
        this._changeValue(value);
        if ("instantly" === this.option("uploadMode")) {
            this._uploadFiles()
        }
    },
    _shouldFileListBeExtended: function() {
        return "useForm" !== this.option("uploadMode") && this.option("extendSelection") && this.option("multiple")
    },
    _removeDuplicates: function(files, value) {
        var result = [];
        for (var i = 0; i < value.length; i++) {
            if (!this._isFileInArray(files, value[i])) {
                result.push(value[i])
            }
        }
        return result
    },
    _isFileInArray: function(files, file) {
        for (var i = 0; i < files.length; i++) {
            var item = files[i];
            if (item.size === file.size && item.name === file.name) {
                return true
            }
        }
        return false
    },
    _changeValue: function(value) {
        var files = this._shouldFileListBeExtended() ? this.option("value").slice() : [];
        if ("instantly" !== this.option("uploadMode")) {
            value = this._removeDuplicates(files, value)
        }
        this.option("value", files.concat(value))
    },
    _getFiles: function(fileList) {
        var values = [];
        $.each(fileList, function(_, value) {
            values.push(value)
        });
        return values
    },
    _initLabel: function() {
        if (!this._$inputLabel) {
            this._$inputLabel = $("<div>")
        }
        this._$inputLabel.text(this.option("labelText"))
    },
    _focusTarget: function() {
        return this.element().find("." + FILEUPLOADER_BUTTON_CLASS)
    },
    _getSubmitElement: function() {
        return this._$fileInput
    },
    _render: function() {
        this.element().addClass(FILEUPLOADER_CLASS);
        this._renderWrapper();
        this._renderInputWrapper();
        this._renderDragEvents();
        this._renderSelectButton();
        this._renderInputContainer();
        this._renderFiles();
        this._renderUploadButton();
        this.callBase.apply(this, arguments)
    },
    _createFiles: function() {
        var value = this.option("value");
        if (!this._files || 0 === value.length || !this._shouldFileListBeExtended()) {
            this._files = []
        }
        $.each(value.slice(this._files.length), function(_, value) {
            this._files.push(this._createFile(value))
        }.bind(this))
    },
    _createUploadStartedAction: function() {
        this._uploadStartedAction = this._createActionByOption("onUploadStarted")
    },
    _createUploadedAction: function() {
        this._uploadedAction = this._createActionByOption("onUploaded")
    },
    _createProgressAction: function() {
        this._progressAction = this._createActionByOption("onProgress")
    },
    _createUploadAbortedAction: function() {
        this._uploadAbortedAction = this._createActionByOption("onUploadAborted")
    },
    _createUploadErrorAction: function() {
        this._uploadErrorAction = this._createActionByOption("onUploadError")
    },
    _createFile: function(value) {
        return {
            value: value,
            loadedSize: 0,
            onProgress: $.Callbacks(),
            onAbort: $.Callbacks(),
            onLoad: $.Callbacks(),
            onError: $.Callbacks(),
            onLoadStart: $.Callbacks()
        }
    },
    _renderFiles: function() {
        var value = this.option("value");
        if (!this._$filesContainer) {
            this._$filesContainer = $("<div>").addClass(FILEUPLOADER_FILES_CONTAINER_CLASS).appendTo(this._$content)
        } else {
            if (!this._shouldFileListBeExtended() || 0 === value.length) {
                this._$filesContainer.empty()
            }
        }
        var showFileList = this.option("showFileList");
        if (showFileList) {
            var that = this;
            $.each(this._files, function(_, file) {
                if (!file.$file) {
                    that._renderFile(file)
                }
            })
        }
        this.element().toggleClass(FILEUPLOADER_SHOW_FILE_LIST_CLASS, showFileList);
        this.element().toggleClass(FILEUPLOADER_EMPTY_CLASS, !this._files.length);
        this._updateFileNameMaxWidth();
        this._$validationMessage && this._$validationMessage.dxOverlay("instance").repaint()
    },
    _renderFile: function(file) {
        var value = file.value;
        var $fileContainer = $("<div>").addClass(FILEUPLOADER_FILE_CONTAINER_CLASS).appendTo(this._$filesContainer);
        this._renderFileButtons(file, $fileContainer);
        file.$file = $("<div>").addClass(FILEUPLOADER_FILE_CLASS).appendTo($fileContainer);
        var $fileInfo = $("<div>").addClass(FILEUPLOADER_FILE_INFO_CLASS).appendTo(file.$file);
        file.$statusMessage = $("<div>").addClass(FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).text(this.option("readyToUploadMessage")).appendTo(file.$file);
        $("<div>").addClass(FILEUPLOADER_FILE_NAME_CLASS).text(value.name).appendTo($fileInfo);
        if (commonUtils.isDefined(value.size)) {
            $("<div>").addClass(FILEUPLOADER_FILE_SIZE_CLASS).text(this._getFileSize(value.size)).appendTo($fileInfo)
        }
    },
    _updateFileNameMaxWidth: function() {
        var cancelButtonsCount = this.option("allowCanceling") && "useForm" !== this.option("uploadMode") ? 1 : 0,
            uploadButtonsCount = "useButtons" === this.option("uploadMode") ? 1 : 0,
            filesContainerWidth = this._$filesContainer.width(),
            $buttonContainer = this._$filesContainer.find("." + FILEUPLOADER_BUTTON_CONTAINER_CLASS).eq(0),
            buttonsWidth = $buttonContainer.width() * (cancelButtonsCount + uploadButtonsCount),
            $fileSize = this._$filesContainer.find("." + FILEUPLOADER_FILE_SIZE_CLASS).eq(0);
        var prevFileSize = $fileSize.text();
        $fileSize.text("1000 Mb");
        var fileSizeWidth = $fileSize.width();
        $fileSize.text(prevFileSize);
        this._$filesContainer.find("." + FILEUPLOADER_FILE_NAME_CLASS).css("max-width", filesContainerWidth - buttonsWidth - fileSizeWidth)
    },
    _renderFileButtons: function(file, $container) {
        var $cancelButton = this._getCancelButton(file);
        $cancelButton && $container.append($cancelButton);
        var $uploadButton = this._getUploadButton(file);
        $uploadButton && $container.append($uploadButton)
    },
    _getCancelButton: function(file) {
        if ("useForm" === this.option("uploadMode")) {
            return null
        }
        file.cancelButton = this._createComponent($("<div>").addClass(FILEUPLOADER_BUTTON_CLASS + " " + FILEUPLOADER_CANCEL_BUTTON_CLASS), Button, {
            onClick: function() {
                this._removeFile(file)
            }.bind(this),
            icon: "close",
            visible: this.option("allowCanceling"),
            integrationOptions: {}
        });
        return $("<div>").addClass(FILEUPLOADER_BUTTON_CONTAINER_CLASS).append(file.cancelButton.element())
    },
    _getUploadButton: function(file) {
        if ("useButtons" !== this.option("uploadMode")) {
            return null
        }
        file.uploadButton = this._createComponent($("<div>").addClass(FILEUPLOADER_BUTTON_CLASS + " " + FILEUPLOADER_UPLOAD_BUTTON_CLASS), Button, {
            onClick: function() {
                this._uploadFile(file)
            }.bind(this),
            icon: "upload"
        });
        file.onLoadStart.add(function() {
            file.uploadButton.element().remove()
        }.bind(this));
        return $("<div>").addClass(FILEUPLOADER_BUTTON_CONTAINER_CLASS).append(file.uploadButton.element())
    },
    _removeFile: function(file) {
        file.$file.parent().remove();
        this._files.splice(inArray(file, this._files), 1);
        var value = this.option("value").slice();
        value.splice(inArray(file.value, value), 1);
        this._doPreventRecreatingFiles = true;
        this.option("value", value);
        this._doPreventRecreatingFiles = false;
        this.element().toggleClass(FILEUPLOADER_EMPTY_CLASS, !this._files.length);
        this._doPreventInputChange = true;
        this._$fileInput.val("");
        this._doPreventInputChange = false
    },
    _getFileSize: function(size) {
        var i = 0,
            labels = [messageLocalization.format("dxFileUploader-bytes"), messageLocalization.format("dxFileUploader-kb"), messageLocalization.format("dxFileUploader-Mb"), messageLocalization.format("dxFileUploader-Gb")],
            count = labels.length - 1;
        while (i < count && size >= 1024) {
            size /= 1024;
            i++
        }
        return Math.round(size) + " " + labels[i]
    },
    _renderSelectButton: function() {
        var $button = $("<div>").addClass(FILEUPLOADER_BUTTON_CLASS).appendTo(this._$inputWrapper);
        this._selectButton = this._createComponent($button, Button, {
            text: this.option("selectButtonText"),
            focusStateEnabled: false,
            integrationOptions: {}
        });
        if ("desktop" === devices.real().deviceType) {
            this._selectButton.option("onClick", this._selectButtonClickHandler.bind(this))
        } else {
            $button.off("click").on("click", this._selectButtonClickHandler.bind(this))
        }
    },
    _selectButtonClickHandler: function() {
        var that = this;
        if (that.option("useNativeInputClick")) {
            return
        }
        if (that.option("disabled")) {
            return false
        }
        that._isCustomClickEvent = true;
        that._$fileInput.trigger("click");
        that._isCustomClickEvent = false
    },
    _renderUploadButton: function() {
        if ("useButtons" !== this.option("uploadMode")) {
            return
        }
        var $uploadButton = $("<div>").addClass(FILEUPLOADER_BUTTON_CLASS).addClass(FILEUPLOADER_UPLOAD_BUTTON_CLASS).appendTo(this._$content);
        this._uploadButton = this._createComponent($uploadButton, Button, {
            text: this.option("uploadButtonText"),
            onClick: this._uploadButtonClickHandler.bind(this),
            integrationOptions: {}
        })
    },
    _uploadButtonClickHandler: function() {
        this._uploadFiles()
    },
    _shouldDragOverBeRendered: function() {
        return "useForm" !== this.option("uploadMode") || this.option("nativeDropSupported")
    },
    _renderInputContainer: function() {
        this._$inputContainer = $("<div>").addClass(FILEUPLOADER_INPUT_CONTAINER_CLASS).appendTo(this._$inputWrapper);
        if (!this._shouldDragOverBeRendered()) {
            this._$inputContainer.css("display", "none")
        }
        this._$fileInput.addClass(FILEUPLOADER_INPUT_CLASS);
        this._renderInput();
        this._$inputLabel.addClass(FILEUPLOADER_INPUT_LABEL_CLASS).appendTo(this._$inputContainer)
    },
    _renderInput: function() {
        if (this.option("useNativeInputClick")) {
            this._selectButton.option("template", this._selectButtonInputTemplate.bind(this))
        } else {
            this._$fileInput.appendTo(this._$inputContainer);
            this._selectButton.option("template", "content")
        }
    },
    _selectButtonInputTemplate: function(data, $content) {
        var $text = $("<span>").addClass("dx-button-text").text(data.text);
        $content.append($text).append(this._$fileInput);
        return $content
    },
    _renderInputWrapper: function() {
        this._$inputWrapper = $("<div>").addClass(FILEUPLOADER_INPUT_WRAPPER_CLASS).appendTo(this._$content)
    },
    _renderDragEvents: function() {
        this._$inputWrapper.off("." + this.NAME);
        if (!this._shouldDragOverBeRendered()) {
            return
        }
        this._dragEventsCount = 0;
        this._$inputWrapper.on(eventUtils.addNamespace("dragenter", this.NAME), this._dragEnterHandler.bind(this)).on(eventUtils.addNamespace("dragover", this.NAME), this._dragOverHandler.bind(this)).on(eventUtils.addNamespace("dragleave", this.NAME), this._dragLeaveHandler.bind(this)).on(eventUtils.addNamespace("drop", this.NAME), this._dropHandler.bind(this))
    },
    _useInputForDrop: function() {
        return this.option("nativeDropSupported") && "useForm" === this.option("uploadMode")
    },
    _dragEnterHandler: function(e) {
        if (this.option("disabled")) {
            return false
        }
        if (!this._useInputForDrop()) {
            e.preventDefault()
        }
        this._dragEventsCount++;
        this.element().addClass(FILEUPLOADER_DRAGOVER_CLASS)
    },
    _dragOverHandler: function(e) {
        if (!this._useInputForDrop()) {
            e.preventDefault()
        }
    },
    _dragLeaveHandler: function(e) {
        if (!this._useInputForDrop()) {
            e.preventDefault()
        }
        this._dragEventsCount--;
        if (this._dragEventsCount <= 0) {
            this.element().removeClass(FILEUPLOADER_DRAGOVER_CLASS)
        }
    },
    _dropHandler: function(e) {
        this._dragEventsCount = 0;
        this.element().removeClass(FILEUPLOADER_DRAGOVER_CLASS);
        if (this._useInputForDrop()) {
            return
        }
        e.preventDefault();
        var fileList = e.originalEvent.dataTransfer.files,
            files = this._getFiles(fileList);
        if (!this.option("multiple") && files.length > 1) {
            return
        }
        this._changeValue(this._filterFiles(files));
        if ("instantly" === this.option("uploadMode")) {
            this._uploadFiles()
        }
    },
    _filterFiles: function(files) {
        if (!files.length) {
            return files
        }
        var accept = this.option("accept");
        if (!accept.length) {
            return files
        }
        var result = [],
            allowedTypes = this._getAllowedFileTypes(accept);
        for (var i = 0, n = files.length; i < n; i++) {
            if (this._isFileTypeAllowed(files[i], allowedTypes)) {
                result.push(files[i])
            }
        }
        return result
    },
    _getAllowedFileTypes: function(acceptSting) {
        if (!acceptSting.length) {
            return []
        }
        return acceptSting.split(",").map(function(item) {
            return item.trim()
        })
    },
    _isFileTypeAllowed: function(file, allowedTypes) {
        for (var i = 0, n = allowedTypes.length; i < n; i++) {
            var allowedType = allowedTypes[i];
            if ("." === allowedType[0]) {
                allowedType = allowedType.replace(".", "\\.");
                if (file.name.match(allowedType)) {
                    return true
                }
            } else {
                allowedType = allowedType.replace("*", "");
                if (file.type.match(allowedType)) {
                    return true
                }
            }
        }
        return false
    },
    _renderWrapper: function() {
        var $wrapper = $("<div>").addClass(FILEUPLOADER_WRAPPER_CLASS).appendTo(this.element());
        var $container = $("<div>").addClass(FILEUPLOADER_CONTAINER_CLASS).appendTo($wrapper);
        this._$content = $("<div>").addClass(FILEUPLOADER_CONTENT_CLASS).appendTo($container)
    },
    _clean: function() {
        this._$fileInput.detach();
        delete this._$filesContainer;
        this.callBase.apply(this, arguments)
    },
    _uploadFiles: function() {
        if (!isFormDataSupported()) {
            return
        }
        $.each(this._files, function(_, file) {
            this._uploadFile(file)
        }.bind(this))
    },
    _uploadFile: function(file) {
        if (file.uploadStarted) {
            return
        }
        var $file = file.$file,
            value = file.value;
        this._initUploadRequest(file);
        if ($file) {
            file.progressBar = this._createProgressBar(value.size);
            file.progressBar.element().appendTo($file);
            this._initStatusMessage(file);
            this._initCancelButton(file)
        }
        file.onLoadStart.add(this._onUploadStarted.bind(this, file));
        file.onLoad.add(this._onLoadedHandler.bind(this, file));
        file.onError.add(this._onErrorHandler.bind(this, file));
        file.onAbort.add(this._onAbortHandler.bind(this, file));
        file.onProgress.add(this._onProgressHandler.bind(this, file));
        file.request.send(this._createFormData(this.option("name"), value))
    },
    _onUploadStarted: function(file, e) {
        file.uploadStarted = true;
        this._uploadStartedAction({
            file: file.value,
            jQueryEvent: e,
            request: file.request
        })
    },
    _onErrorHandler: function(file, e) {
        var that = this;
        setTimeout(function() {
            if (that.option("showFileList")) {
                file.$statusMessage.text(that.option("uploadFailedMessage"));
                file.$statusMessage.css("display", "");
                file.progressBar.element().remove()
            }
        }, FILEUPLOADER_AFTER_LOAD_DELAY);
        this._uploadErrorAction({
            file: file.value,
            jQueryEvent: e,
            request: file.request
        })
    },
    _onAbortHandler: function(file, e) {
        this._uploadAbortedAction({
            file: file.value,
            jQueryEvent: e,
            request: file.request
        })
    },
    _onLoadedHandler: function(file, e) {
        var that = this;
        setTimeout(function() {
            if (that.option("showFileList")) {
                file.$statusMessage.text(that.option("uploadedMessage"));
                file.$statusMessage.css("display", "");
                file.progressBar.element().remove()
            }
        }, FILEUPLOADER_AFTER_LOAD_DELAY);
        this._uploadedAction({
            file: file.value,
            jQueryEvent: e,
            request: file.request
        })
    },
    _onProgressHandler: function(file, e) {
        var totalSize = this._getTotalSize(),
            currentLoadedSize = 0,
            loadedSize = this._getLoadedSize(),
            progress = 0;
        if (file) {
            currentLoadedSize = Math.min(e.loaded, file.value.size);
            var segmentSize = currentLoadedSize - file.loadedSize;
            loadedSize += segmentSize;
            file.progressBar && file.progressBar.option({
                value: currentLoadedSize,
                showStatus: true
            });
            this._progressAction({
                file: file.value,
                segmentSize: segmentSize,
                bytesLoaded: e.loaded,
                bytesTotal: e.total,
                jQueryEvent: e,
                request: file.request
            });
            file.loadedSize = currentLoadedSize
        }
        if (totalSize) {
            progress = Math.round(loadedSize / totalSize * 100)
        }
        this.option("progress", progress);
        this._setLoadedSize(loadedSize)
    },
    _initStatusMessage: function(file) {
        file.$statusMessage.css("display", "none")
    },
    _initCancelButton: function(file) {
        var cancelClickHandler = function() {
            file.request.abort();
            this._removeFile(file)
        }.bind(this);
        file.cancelButton.option("onClick", cancelClickHandler);
        var hideCancelButton = function() {
            setTimeout(function() {
                file.cancelButton.option({
                    visible: false
                })
            }, FILEUPLOADER_AFTER_LOAD_DELAY)
        };
        file.onLoad.add(hideCancelButton);
        file.onError.add(hideCancelButton)
    },
    _initUploadRequest: function(file) {
        var that = this;
        file.request = this._createRequest(this.option("uploadUrl"));
        file.loadedSize = 0;
        this._initUploadHeaders(file.request);
        file.request.onreadystatechange = function(e) {
            if (4 === e.currentTarget.readyState) {
                var status = e.currentTarget.status;
                if (that._isStatusSuccess(status)) {
                    this.onLoad.fire(e)
                } else {
                    if (that._isStatusError(status) || !this._isProgressStarted) {
                        this._isError = true;
                        this.onError.fire(e)
                    }
                }
            }
        }.bind(file);
        file.request.upload.onprogress = function(e) {
            if (this._isError) {
                return
            }
            this._isProgressStarted = true;
            this.onProgress.fire(e)
        }.bind(file);
        file.request.upload.onloadstart = function(e) {
            this.onLoadStart.fire(e)
        }.bind(file);
        file.request.upload.onabort = function(e) {
            this.onAbort.fire(e)
        }.bind(file)
    },
    _initUploadHeaders: function(request) {
        var headers = this.option("uploadHeaders");
        for (var name in headers) {
            if (headers.hasOwnProperty(name)) {
                request.setRequestHeader(name, headers[name])
            }
        }
    },
    _isStatusSuccess: function(status) {
        return 200 <= status && status < 300
    },
    _isStatusError: function(status) {
        return 400 <= status && status < 500 || 500 <= status && status < 600
    },
    _createRequest: function(url) {
        var request = new XMLHttpRequest;
        request.open(this.option("uploadMethod"), url, true);
        return request
    },
    _createFormData: function(fieldName, fieldValue) {
        var formData = new FormData;
        formData.append(fieldName, fieldValue);
        return formData
    },
    _createProgressBar: function(fileSize) {
        return this._createComponent($("<div>"), ProgressBar, {
            value: void 0,
            min: 0,
            max: fileSize,
            statusFormat: function(ratio) {
                return Math.round(100 * ratio) + "%"
            },
            showStatus: false,
            statusPosition: "right"
        })
    },
    _getTotalSize: function() {
        if (!this._totalSize) {
            var value = this.option("value"),
                totalSize = 0;
            $.each(value, function(_, file) {
                totalSize += file.size
            });
            this._totalSize = totalSize
        }
        return this._totalSize
    },
    _getLoadedSize: function() {
        if (!this._loadedSize) {
            var loadedSize = 0;
            $.each(this._files, function(_, file) {
                loadedSize += file.loadedSize
            });
            this._loadedSize = loadedSize
        }
        return this._loadedSize
    },
    _setLoadedSize: function(value) {
        this._loadedSize = value
    },
    _recalculateProgress: function() {
        delete this._totalSize;
        delete this._loadedSize;
        this._onProgressHandler()
    },
    _getValidationMessageTarget: function() {
        return this._$inputWrapper
    },
    _optionChanged: function(args) {
        var value = args.value;
        switch (args.name) {
            case "height":
            case "width":
                this._updateFileNameMaxWidth();
                this.callBase(args);
                break;
            case "value":
                !value.length && this._$fileInput.val("");
                if (!this._doPreventRecreatingFiles) {
                    this._createFiles();
                    this._renderFiles()
                }
                this._recalculateProgress();
                this.callBase(args);
                break;
            case "name":
                this._initFileInput();
                this.callBase(args);
                break;
            case "accept":
                this._initFileInput();
                break;
            case "multiple":
                this._initFileInput();
                if (!args.value) {
                    this.reset()
                }
                break;
            case "selectButtonText":
                this._selectButton.option("text", value);
                break;
            case "uploadButtonText":
                this._uploadButton && this._uploadButton.option("text", value);
                break;
            case "readyToUploadMessage":
            case "uploadedMessage":
            case "uploadFailedMessage":
                this._invalidate();
                break;
            case "labelText":
                this._$inputLabel.text(value);
                break;
            case "showFileList":
                this._renderFiles();
                break;
            case "uploadUrl":
            case "progress":
            case "uploadMethod":
            case "uploadHeaders":
            case "extendSelection":
                break;
            case "allowCanceling":
            case "uploadMode":
                this.reset();
                this._invalidate();
                break;
            case "onUploadStarted":
                this._createUploadStartedAction();
                break;
            case "onUploaded":
                this._createUploadedAction();
                break;
            case "onProgress":
                this._createProgressAction();
                break;
            case "onUploadError":
                this._createUploadErrorAction();
                break;
            case "onUploadAborted":
                this._createUploadAbortedAction();
                break;
            case "useNativeInputClick":
                this._renderInput();
                break;
            case "useDragOver":
                this._renderDragEvents();
                break;
            case "nativeDropSupported":
                this._invalidate();
                break;
            default:
                this.callBase(args)
        }
    },
    reset: function() {
        this.option("value", [])
    }
});
registerComponent("dxFileUploader", FileUploader);
module.exports = FileUploader;
module.exports.default = module.exports;