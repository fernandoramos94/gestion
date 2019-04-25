app.controller("nominaController", function ($scope, $location, $timeout) {
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $scope.idSelected = 0;
    $scope.init = function () {
        $scope.solicitud = {};
        $scope.revision = {};
        $scope.getRevision();
        $scope.getSolicitud();

        
    }
    $scope.getSolicitud = function(){
        $.ajax({
            url: url + "/api/getSolicitudNomina",
            method: "GET",
            success: function (resp) {
                var columns = []
                if($("#rolUser").val() == 1){
                    columns = [
                        {
                            dataField: "last_name", caption: "Nombre"
                        }, {
                            dataField: "first_name", caption: "Apellidos"
                        }, {
                            dataField: "periodo"
                        }, {
                            dataField: "motivo"
                        },{
                            dataField: "adjunto",
                            cellTemplate: function(container, options){
                                if(!options.value){
                                    $("<i>Pendiente</i>").appendTo(container)
                                }else{
                                    $("<a class='text-center' href='"+url+"/uploads/"+options.value+"' target='_blank'>Descargar</a>").appendTo(container);
                                }
                            }
                        }, {
                            caption: "Adjuntar Nómina",
                            cellTemplate: function(container, options){
                                
                                
                                if(!options.data.adjunto){
                                    $('<a class=" btn btn-md btn-info">Cargar archivo</a>').on("click", function(){
                                        console.log(options);
                                        $scope.idSelected = options.data.id;
                                        $("#modal").modal({
                                            backdrop: "static",
                                            keyboard: false,
                                            show: true
                                        });
                                    }).appendTo(container);
                                }else{
                                    $('<a class=" btn btn-md btn-info">Actualizar archivo</a>').on("click", function(){
                                        $scope.idSelected = options.data.id;
                                        $("#modal").modal({
                                            backdrop: "static",
                                            keyboard: false,
                                            show: true
                                        });
                                    }).appendTo(container);
                                }
                            }
                        }
                    ]
                }else{
                    columns = [
                        {
                            dataField: "last_name", caption: "Nombre"
                        }, {
                            dataField: "first_name", caption: "Apellidos"
                        }, {
                            dataField: "periodo"
                        }, {
                            dataField: "motivo"
                        },{
                            dataField: "adjunto",
                            cellTemplate: function(container, options){
                                if(!options.value){
                                    $("<i>Pendiente</i>").appendTo(container)
                                }else{
                                    $("<a class='text-center' href='"+url+"/uploads/"+options.value+"' target='_blank'>Descargar</a>").appendTo(container);
                                }
                            }
                        }
                    ]

                }
                pintaGrillaSolicitudes(resp, columns)
            }, error: function (error) {
                console.log(error);
            }
        });
    }
    $scope.getRevision = function(){
        $.ajax({
            url: url + "/api/getRevisionNomina",
            method: "GET",
            success: function (resp) {
                var columns = []
                if($("#rolUser").val() == 1){
                    columns = [
                        {
                            dataField: "last_name", caption: "Nombre"
                        }, {
                            dataField: "first_name", caption: "Apellidos"
                        }, {
                            dataField: "periodo"
                        }, {
                            dataField: "motivo"
                        },{
                            dataField: "adjunto",
                            cellTemplate: function(container, options){
                                if(!options.value){
                                    $("<i>Pendiente</i>").appendTo(container)
                                }else{
                                    $("<a class='text-center' href='"+url+"/uploads/"+options.value+"' target='_blank' >Descargar</a>").appendTo(container);
                                }
                            }
                        }
                    ]
                }else{
                    columns = [
                        {
                            dataField: "last_name", caption: "Nombre"
                        }, {
                            dataField: "first_name", caption: "Apellidos"
                        }, {
                            dataField: "periodo"
                        }, {
                            dataField: "motivo"
                        },{
                            dataField: "adjunto",
                            cellTemplate: function(container, options){
                                if(!options.value){
                                    $("<i>Pendiente</i>").appendTo(container)
                                }else{
                                    $("<a class='text-center' href='"+url+"/uploads/"+options.value+"' target='_blank'>Descargar</a>").appendTo(container);
                                }
                            }
                        }
                    ]

                }
                pintaGrillaRevisiones(resp, columns)
            }, error: function (error) {
                console.log(error);
            }
        })
    }
    var pintaGrillaSolicitudes = function(data, columns){
        var grilla = $("#grillaSolicitudes").dxDataGrid({
            dataSource: data,
            columnAutoWidth: true,
            rowAlternationEnabled: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            searchPanel: {
                visible: true,
                placeholder: "Buscar..."
            },
            columns: columns,
            showBorders: true,
            showRowLines: true,
            onToolbarPreparing: function(e) {
                var dataGrid = e.component;
                e.toolbarOptions.items.unshift({
                    location: "after",
                    widget: "dxButton",
                    options: {
                        icon: "refresh",
                        onClick: function() {
                            dataGrid.refresh();
                        }
                    }
                });
            },
            onInitialized:function(e){
                $scope.loading(false, "");
            },
            pager: {
                infoText: "Pagina {0} de {1} ({2} Registros)",
                showInfo: true,
                showNavigationButtons: true,
                showPageSizeSelector: true,
                visible: true
            },
        }).dxDataGrid("instance");
    }

    var pintaGrillaRevisiones = function(data, columns){
        var grilla = $("#grillaRevisiones").dxDataGrid({
            dataSource: data,
            columnAutoWidth: true,
            rowAlternationEnabled: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            searchPanel: {
                visible: true,
                placeholder: "Buscar..."
            },
            columns: columns,
            showBorders: true,
            showRowLines: true,
            onToolbarPreparing: function(e) {
                var dataGrid = e.component;
                e.toolbarOptions.items.unshift({
                    location: "after",
                    widget: "dxButton",
                    options: {
                        icon: "refresh",
                        onClick: function() {
                            dataGrid.refresh();
                        }
                    }
                });
            },
            onInitialized:function(e){
                $scope.loading(false, "");
            },
            pager: {
                infoText: "Pagina {0} de {1} ({2} Registros)",
                showInfo: true,
                showNavigationButtons: true,
                showPageSizeSelector: true,
                visible: true
            },
        }).dxDataGrid("instance");
    }
    $scope.adjuntoNomina = function(){
        if(!$("#adjunto").val()){
            mensaje("Seleccione un documento", "warning");
            return false;
        }
        $scope.loading(true, "Cargando archivo");
        var formData = new FormData();
        formData.append('file', $('#adjunto')[0].files[0]);
        formData.append('id', $scope.idSelected);
        $("#modal").modal("hide");
        $.ajax({
            url: url + '/updateSolicitud',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                $scope.getSolicitud();
                mensaje("Documento cargado de forma exitosa.", "success");
                $("#adjunto").val("");
                $scope.loading(false, "");
                window.location.refresh();
            }, error: function (error) {
                $scope.mensaje("Se ha presentado un error.", "error")
                $scope.loading(false, "");
            }
        });
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

    function mensaje(text, type){
        if(type == "error")
            toastr.error(text, '', {timeOut: 5000})
        else if(type == "success")
            toastr.success(text, '', {timeOut: 5000})
        else if(type == "warning")
            toastr.warning(text, '', {timeOut: 5000})
        
    }

    $scope.saveSolicitud = function(){
        
        if(!$scope.solicitud.mes){
            mensaje("Ingrese el periodo(mes) que desea solicitar", "warning");
            return false;
        }if(!$scope.solicitud.motivo){
            mensaje("Ingrese el motivo de la solicitud", "warning");
            return false;
        }
        $scope.loading(true, "Enviando solicitud");
        var dataSend = {
            mes: $scope.solicitud.mes,
            motivo: $scope.solicitud.motivo,
            tipoSolicitud: 1
        }

        $.ajax({
            url: url + '/enviarSolicitud',
            type: 'POST',
            data: dataSend,
            success: function (data) {
                mensaje("Su solicitud ha sido enviada de forma satisfactoria", "success");
                $scope.loading(false, "");
                window.location.href = url + "/nomina";
            }, error: function (error) {
                $scope.mensaje("Se ha presentado un error.", "error")
                $scope.loading(false, "");
            }
        });
    }

    $scope.saveRevision = function(){
        if(!$scope.revision.mes){
            mensaje("Ingrese el periodo(mes) que desea solicitar la revision", "warning");
            return false;
        }if(!$scope.revision.motivo){
            mensaje("Ingrese el motivo de la revision", "warning");
            return false;
        }if(!$("#fileDocument").val()){
            mensaje("Debe adjunta el archivo que desea que se revise", "warning");
            return false;
        }
        $scope.loading(true, "Enviando solicitud");
        var formData = new FormData();
        formData.append('file', $('#fileDocument')[0].files[0]);
        formData.append('periodo', $scope.revision.mes);
        formData.append('motivo', $scope.revision.motivo);
        formData.append('tipoSolicitud', 2);

        $.ajax({
            url: url + '/enviarSolicitud',
            type: 'POST',
            data: formData,
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            success: function (data) {
                mensaje("Su solicitud de revisión ha sido enviada de forma satisfactoria", "success");
                $scope.loading(false, "");
                window.location.href = url +"/nomina";
            }, error: function (error) {
                $scope.mensaje("Se ha presentado un error.", "error")
                $scope.loading(false, "");
            }
        });
    }
    
})