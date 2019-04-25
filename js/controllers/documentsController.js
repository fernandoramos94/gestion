app.controller("documentsController", function ($scope, $location, $timeout) {
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $scope.init = function () {
        $scope.data = '';
        $scope.baseFile = '';
        $scope.categories = [];
        $scope.clients = [];
        $scope.signatures = [];
        $scope.loading(true, "Cargando...");
        $.ajax({
            url: url + "/api/getCategories",
            method: "GET",
            success: function (resp) {
                $timeout(function () {
                    $scope.categories = resp;
                    $scope.$apply();
                    $scope.loading(false, "");
                })
            }, error: function (error) {
                console.log(error);
            }
        });

        $.ajax({
            url: url + "/api/getClients",
            method: "GET",
            success: function (resp) {
                $timeout(function () {
                    $scope.clients = resp;
                    $scope.$apply();
                })
            }, error: function (error) {
                console.log(error);
            }
        })
    }
    $scope.mensaje = function (text, type) {
        if (type == "error")
            toastr.error(text, '', { timeOut: 5000 })
        else if (type == "success")
            toastr.success(text, '', { timeOut: 5000 })
        else if (type == "warning")
            toastr.warning(text, '', { timeOut: 5000 })

    }

    $scope.loading = function (status, mens) {
        if (status) {
            $("body").loading({
                theme: "dark",
                message: mens
            })
        } else {
            $(":loading").loading("stop");
        }
    }

    $scope.colums = [];

    $scope.saveCategorieDocument = function () {
        var searchIDs = $('input[name=categories]:checked').map(function (resp) {
            return $(this).val();
        });

        if (searchIDs.get().length <= 0) {
            $scope.mensaje("Debe seleccionar al menos una categoria.", "warning");
            return false;
        }
        if (!$('#fileDocument').val()) {
            $scope.mensaje("Debe seleccionar un documento.", "warning");
            return false;
        }
        $scope.loading(true, "Almacenando información.");

        $timeout(function () {
            var formData = new FormData();
            formData.append('file', $('#fileDocument')[0].files[0]);
            formData.append('categorie', searchIDs.get());

            $.ajax({
                url: url + '/documents/add',
                type: 'POST',
                data: formData,
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                success: function (data) {
                    $scope.mensaje(data, "success");
                    $scope.loading(false, "");
                    window.location.href = url +"/documents";
                }, error: function (error) {
                    $scope.mensaje("Se ha presentado un error.", "error")
                    $scope.loading(false, "");
                }
            });
        }, 1000);
    }

    $scope.saveClientDocument = function () {
        var searchIDs = $('input[name=clients]:checked').map(function (resp) {
            return $(this).val();
        });

        if (searchIDs.get().length <= 0) {
            $scope.mensaje("Debe seleccionar al menos un cliente.", "warning");
            return false;
        }
        if (!$('#fileDocumentClient').val()) {
            $scope.mensaje("Debe seleccionar un documento.", "warning");
            return false;
        }
        $scope.loading(true, "Almacenando información.");

        $timeout(function () {
            var formData = new FormData();
            formData.append('file', $('#fileDocumentClient')[0].files[0]);
            formData.append('client', searchIDs.get());

            $.ajax({
                url: url + '/documents/addDocumentClient',
                type: 'POST',
                data: formData,
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                success: function (data) {
                    $scope.mensaje(data, "success");
                    $scope.loading(false, "");
                    window.location.href = url + "/documents";
                }, error: function (error) {
                    $scope.mensaje("Se ha presentado un error.", "error")
                    $scope.loading(false, "");
                }
            });
        }, 1000);
    }
    $scope.addDocumentSignature = function(){
        if(!$("#title").val()){
            $scope.mensaje("Ingrese un titulo para el documento", "warning");
            return false;
        }
        if(!$("#txtEditor").Editor("getText")){
            $scope.mensaje("Ingrese los detalles del documento", "warning");
            return false;
        }
        $scope.loading(true,"Almacenando información");
            var formData = new FormData();
            formData.append('data', $("#txtEditor").Editor("getText"));
            formData.append('title', $("#title").val());

            $.ajax({
            url: url + "/documents/addDocumentSignature",
            type: "post",
            data: formData,
            processData: false,
            contentType: false,
            success: function(resp){
                $scope.mensaje(resp, "success");
                $scope.loading(false,"");
                window.location.href = url + "/documentSignature";
            }, error: function(error){
                console.log(error);
                $scope.mensaje("se ha presentado un error", "error");
                $scope.loading(false,"");
            }
        })
    }

    $scope.getDocumentSignature = function(){
        $scope.loading(true, "Cargando...");
        $.ajax({
            url: url + "/document/getDocumentSignature",
            method: "GET",
            success: function (resp) {
                $timeout(function(){
                    $scope.signatures = resp;
                    $scope.$apply();
                })
                $scope.colums = [
                    { caption: "Opciónes", width: "200", cellTemplate: function(container, opcion){
                            $('<span class="icon-pencil2 btn btn-md btn-info"></span>').on("click",function(){
                                window.open(url + "/generatePdf/"+opcion.data.id,'_blank');
                            }).appendTo(container);
                            $('<span>&nbsp;</span>').appendTo(container);
                            $('<span class="icon-bin btn btn-md btn-danger"></span>').appendTo(container);
                        }
                    },
                    { dataField: "title", caption: "Documento"},
                ]
                pintarGrillaSignature(resp);
                $scope.loading(false, "");
            }, error: function (error) {
                console.log(error);
            }
        })
    }

    $scope.getDocumentClient = function(){
        $scope.loading(true, "Cargando...");
        $.ajax({
            url: url + "/api/getDocumentClient",
            method: "GET",
            success: function (resp) {
                if($("#rolUser").val() == 1){
                    $scope.colums = [
                        { caption: "Opciónes", width: "200", cellTemplate: function(container, opcion){
                                $('<span class="icon-pencil2 btn btn-md btn-info"></span>').appendTo(container);
                                $('<span>&nbsp;</span>').appendTo(container);
                                $('<span class="icon-bin btn btn-md btn-danger"></span>').appendTo(container);
                            }
                        },
                        { dataField: "url", caption: "Documento", groupIndex: 0},
                        { dataField: "name", caption: "Cliente"},
                        { dataField: "url", caption: "Link Documento", 
                            allowFiltering: false,
                            cellTemplate: function(content, option){
                                $("<a>").text("Ver/Descargar").attr({"href": url+"/uploads/"+option.value, target: "_blank"}).appendTo(content);
                            }
                        }
                    ]
                    pintarGrilla(resp);
                }else{
                    $scope.colums = [
                        { dataField: "url", caption: "Documento"},
                        { dataField: "name", caption: "Cliente"},
                        { dataField: "url", caption: "Link Documento", 
                            allowFiltering: false,
                            cellTemplate: function(content, option){
                                $("<a>").text("Ver/Descargar").attr({"href": url+"/uploads/"+option.value, target: "_blank"}).appendTo(content);
                            }
                        }
                    ]
                    pintarGrilla(resp);
                }  
                
                $scope.loading(false, "");
            }, error: function (error) {
                console.log(error);
            }
        })
    }

    $scope.getDocumentCategorie = function () {
        $scope.loading(true, "Cargando...");
        $.ajax({
            url: url + "/api/getDocumentCategorie",
            method: "GET",
            success: function (resp) {
                if($("#rolUser").val() == 1){
                    $scope.colums = [
                        { caption: "Opciónes", width: "200", cellTemplate: function(container, opcion){
                                $('<span class="icon-pencil2 btn btn-md btn-info"></span>').appendTo(container);
                                $('<span>&nbsp;</span>').appendTo(container);
                                $('<span class="icon-bin btn btn-md btn-danger"></span>').appendTo(container);
                            }
                        },
                        { dataField: "url", caption: "Documento", groupIndex: 0},
                        { dataField: "name", caption: "Categoria"},
                        { dataField: "url", caption: "Link Documento", 
                            allowFiltering: false,
                            cellTemplate: function(content, option){
                                $("<a>").text("Ver/Descargar").attr({"href": url+"/uploads/"+option.value, target: "_blank"}).appendTo(content);
                            }
                        }
                    ]
                    pintarGrilla(resp);
                }else{
                    $scope.colums = [
                        { dataField: "url", caption: "Documento"},
                        { dataField: "name", caption: "Categoria"},
                        { dataField: "url", caption: "Link Documento", 
                            allowFiltering: false,
                            cellTemplate: function(content, option){
                                $("<a>").text("Ver/Descargar").attr({"href": url+"/uploads/"+option.value, target: "_blank"}).appendTo(content);
                            }
                        }
                    ]
                    pintarGrillaForUser(resp);
                }
                
                $scope.loading(false, "");
            }, error: function (error) {
                console.log(error);
            }
        })
    }
    $scope.valueChaged = "1";

    var pintarGrillaSignature = function (data) {
        var grilla = $("#grilla").dxDataGrid({
            dataSource: data,
            columnAutoWidth: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            searchPanel: {
                visible: true,
                placeholder: "Buscar..."
            },
            columns: $scope.colums,
            showBorders: true,
            showRowLines: true,
            onToolbarPreparing: function (e) {
                var dataGrid = e.component;
                e.toolbarOptions.items.unshift({
                    location: "after",
                    widget: "dxButton",
                    options: {
                        icon: "refresh",
                        onClick: function () {
                            dataGrid.refresh();
                        }
                    }
                });
            },
            wordWrapEnabled: true,
            pager: {
                infoText: "Pagina {0} de {1} ({2} Registros)",
                showInfo: true,
                showNavigationButtons: true,
                showPageSizeSelector: true,
                visible: true
            },
        }).dxDataGrid("instance");
    }

    var pintarGrilla = function (data) {
        var grilla = $("#grilla").dxDataGrid({
            dataSource: data,
            columnAutoWidth: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            searchPanel: {
                visible: true,
                placeholder: "Buscar..."
            },
            columns: $scope.colums,
            showBorders: true,
            showRowLines: true,
            onToolbarPreparing: function (e) {
                var dataGrid = e.component;
                e.toolbarOptions.items.unshift({
                    location: "before",
                    widget: "dxSelectBox",
                    options: {
                        width: 200,
                        items: [{
                            value: "1",
                            text: "Categorias"
                        }, {
                            value: "2",
                            text: "Clientes"
                        }],
                        displayExpr: "text",
                        valueExpr: "value",
                        value: $scope.valueChaged,
                        onValueChanged: function(e) {
                            $scope.valueChaged = e.value;
                            if(e.value == 1){
                                $scope.getDocumentCategorie();
                            }else{
                                $scope.getDocumentClient()
                            }
                        }
                    }
                },{
                    location: "after",
                    widget: "dxButton",
                    options: {
                        icon: "refresh",
                        onClick: function () {
                            dataGrid.refresh();
                        }
                    }
                });
            },
            grouping: {
                allowCollapsing: true,
                autoExpandAll: false,
                contextMenuEnabled: false,
                expandMode: "buttonClick",
            },
            wordWrapEnabled: true,
            pager: {
                infoText: "Pagina {0} de {1} ({2} Registros)",
                showInfo: true,
                showNavigationButtons: true,
                showPageSizeSelector: true,
                visible: true
            },
        }).dxDataGrid("instance");
    }
    var pintarGrillaForUser = function (data) {
        var grilla = $("#grilla").dxDataGrid({
            dataSource: data,
            columnAutoWidth: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            searchPanel: {
                visible: true,
                placeholder: "Buscar..."
            },
            columns: $scope.colums,
            showBorders: true,
            showRowLines: true,
            onToolbarPreparing: function (e) {
                var dataGrid = e.component;
                e.toolbarOptions.items.unshift({
                    location: "before",
                    widget: "dxSelectBox",
                    options: {
                        width: 200,
                        items: [{
                            value: "1",
                            text: "Categorias"
                        }, {
                            value: "2",
                            text: "Clientes"
                        }],
                        displayExpr: "text",
                        valueExpr: "value",
                        value: $scope.valueChaged,
                        onValueChanged: function(e) {
                            $scope.valueChaged = e.value;
                            if(e.value == 1){
                                $scope.getDocumentCategorie();
                            }else{
                                $scope.getDocumentClient()
                            }
                        }
                    }
                },{
                    location: "after",
                    widget: "dxButton",
                    options: {
                        icon: "refresh",
                        onClick: function () {
                            dataGrid.refresh();
                        }
                    }
                });
            },
            wordWrapEnabled: true,
            pager: {
                infoText: "Pagina {0} de {1} ({2} Registros)",
                showInfo: true,
                showNavigationButtons: true,
                showPageSizeSelector: true,
                visible: true
            },
        }).dxDataGrid("instance");
    }
})