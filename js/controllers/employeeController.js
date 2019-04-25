app.controller("employeeController", function ($scope, $location, $timeout, $filter) {
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $scope.contratos =  [
        { ID: 1, name: "401"},
        { ID: 2, name: "402"},
        { ID: 3, name: "501"},
        { ID: 3, name: "502"}
    ];
    $scope.init = function () {
        
        $scope.paises();
        $("body").loading({
            theme: "dark",
            message: "Cargando"
        });
        $scope.datosPerfil = {};

        $scope.client = {};
        $scope.categorie = {};
        $scope.data = {};
        $scope.clients = [];
        $scope.paises = [];
        $scope.categorieClient = [];
        $.ajax({
            url: url + "/api/getClients",
            method: "GET",
            success: function (resp) {
                $(":loading").loading("stop");
                $timeout(function () {
                    $scope.clients = resp;
                    $scope.$apply();
                });
            }, error: function (error) {
                console.log(error);
            }
        });
    }
    $scope.getCategoriesClient = function () {
        var dataSend = {
            id_client: $scope.client.id,
        }
        $.ajax({
            url: url + "/api/getCategoriesClient",
            method: "POST",
            data: dataSend,
            success: function (resp) {
                $timeout(function () {
                    $scope.categorieClient = resp;
                    $scope.$apply();
                });
            }, error: function (error) {
                console.log(error);
            }
        })
    }
    function mensaje(text, type) {
        if (type == "error")
            toastr.error(text, '', { timeOut: 5000 })
        else if (type == "success")
            toastr.success(text, '', { timeOut: 5000 })
        else if (type == "warning")
            toastr.warning(text, '', { timeOut: 5000 })

    }
    $scope.enviarData = function () {
        if (!$scope.client.id) {
            mensaje("Seleccione un cliente", "warning");
            return false;
        } else if (!$scope.categorie.id) {
            mensaje("Seleccione una categoria", "warning");
            return false;
        } else if (!$scope.data.last_name) {
            mensaje("Ingrese el nombre del empleado", "warning")
            return false;
        } else if (!$scope.data.first_name) {
            mensaje("Ingrese los apellidos del empleado", "warning")
            return false;
        } else if (!$scope.data.DNI_NIE) {
            mensaje("Ingrese el DNI/NIE", "warning");
            return false;
        } else if (!$scope.data.email) {
            mensaje("Ingrese un correo electronico", "warning");
            return false;
        } else if (!$scope.data.mobile_phone) {
            mensaje("Ingrese un numero de telefono movil", "warning")
            return false;
        }
        $scope.loading(true, "Cargando");

        $scope.data.client = $scope.client.id;
        $scope.data.categorie = $scope.categorie.id;
        $scope.data.codigo_pais = $scope.data.nacionalidad ? filtro($scope.data.nacionalidad) : "";
        $scope.data.codigo_pais_domicilio = $scope.data.pais_domicilio ? filtro($scope.data.pais_domicilio) : "";

        $.ajax({
            url: url + "/employee/add",
            method: "POST",
            data: $scope.data,
            success: function (data) {
                $scope.loading(false, "")
                mensaje("El empleado a sido registrado de forma exitosa", "success");
                location.reload();
            }, error: function (error) {
                $scope.loading(false, "")
                mensaje("Se ha presentado un error", "error");
            }
        })
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

    $scope.getEmployee = function () {
        $scope.loading(true, "Cargando...");
        $.ajax({
            url: url + "/api/getEmployee",
            method: "GET",
            success: function (resp) {
                pintarGrilla(resp);
            }, error: function (error) {
                console.log(error);
            }
        })
    }
    $scope.profile = function () {

        $scope.loading(true, "Cargando...");
        $.ajax({
            url: url + "/dataProfile",
            method: "POST",
            data: { idUsuario: localStorage.getItem("idEmpleado") },
            success: function (resp) {
                $timeout(function () {
                    $scope.datosPerfil = resp;
                    $scope.loading(false, "Cargando...");
                    if (resp.firma) {
                        $("#signature").jSignature("setData", resp.firma);
                    }
                    $scope.$apply();
                })

            }, error: function (error) {
                console.log(error);
            }
        });
        $scope.paises();
    }

    $scope.paises = function () {
        $.ajax({
            url: url + "/json/paises.json",
            method: "GET",
            success: function (res) {
                $scope.paises = res;
                var code = res.map(function (resp) {
                    return {
                        code: resp.codigo,
                        label: resp.nombre
                    }
                });
                $(".pais").autocomplete({
                    source: code
                });
                // console.log(res);
            }, error: function (err) {
                console.log(err);
            }
        })


    }

    $scope.updateProfile = function () {
        $scope.datosPerfil.firma = $("#signature").jSignature("getData");
        $scope.datosPerfil.codigo_pais = $scope.datosPerfil.nacionalidad ? filtro($scope.datosPerfil.nacionalidad) : "";
        $scope.datosPerfil.codigo_pais_domicilio = $scope.datosPerfil.pais_domicilio ? filtro($scope.datosPerfil.pais_domicilio) : "";
        $scope.loading(true, "Actualizando su información");
        $scope.datosPerfil.id = localStorage.getItem("idEmpleado");
        $.ajax({
            url: url + "/updateProfile",
            method: "POST",
            data: $scope.datosPerfil,
            success: function (resp) {
                $scope.loading(false, "Actualizando su información");
                mensaje("Sus datos han sido actualizado de forma exitosa", "success");
                location.reload();
            }, error: function (error) {
                console.log(error);
            }
        })
    }
    var filtro = function (pais) {
        var da = $filter("filter")($scope.paises, function (res) {
            if (res.nombre == pais) return res;
        });
        return da[0].codigo;
    }
    var pintarGrilla = function (data) {
        var grilla = $("#grilla").dxDataGrid({
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
            columns: [
                
                {
                    dataField: "last_name",
                    caption: "Nombre"
                }, {
                    dataField: "first_name",
                    caption: "Apellidos",
                }, {
                    dataField: "DNI_NIE",
                    caption: "DNI/NIE"
                }, {
                    dataField: "mobile_phone",
                    caption: "Telefono Movil"
                }, {
                    dataField: "email",
                    caption: "Correo"
                }, {
                    caption: "Opciónes", width: "100", 
                    cellTemplate: function (container, opcion) {
                        $('<span>&nbsp;</span>').appendTo(container);
                        $('<span class="icon-inbox3 btn btn-md btn-info" data-toggle="tooltip" title="Generar PDF"></span>').on("click", function () {
                            window.open(url + "/getPdf/" + opcion.data.user_id, '_blank');
                        }).appendTo(container);
                        $('<span>&nbsp;</span>').appendTo(container);
                        $('<span class="icon-edit btn btn-md btn-danger" data-toggle="tooltip" title="Actualizar Información"></span>').on("click", function () {
                            localStorage.setItem("idEmpleado", opcion.data.user_id);
                            location.href = url + "/profile";
                        }).appendTo(container);
                    }
                }
            ],
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
            onInitialized: function (e) {
                $scope.loading(false, "");
            },
            pager: {
                infoText: "Pagina {0} de {1} ({2} Registros)",
                showInfo: true,
                showNavigationButtons: true,
                showPageSizeSelector: true,
                visible: true
            },
            masterDetail: {
                enabled: true,
                template: function (container, options) {
                    var currentEmployeeData = options.data;
                    $("<h4>")
                        .addClass("master-detail-caption")
                        .text("Contratos")
                        .appendTo(container);

                    $("<div>")
                    
                        .dxDataGrid({
                            columnAutoWidth: true,
                            showBorders: true,
                            columns: [{
                                dataField: "TipoContrato",
                                lookup: {
                                    dataSource: function(options) {
                                        return {
                                            store: $scope.contratos,
                                        };
                                    },
                                    valueExpr: "ID",
                                    displayExpr: "name"
                                }
                            },{
                                dataField: "FechaFin",
                                dataType: "date"
                            }, {
                                dataField: "MotivoContratacion",
                                
                            }],
                            editing: {
                                allowAdding: true,
                                allowUpdating: true,
                                mode: "row",
                                texts: {
                                    saveRowChanges: "Guardar",
                                    cancelRowChanges: "Cancelar"
                                }
                            },
                            dataSource: [],
                            noDataText: "No hay contratos"
                        }).appendTo(container);
                }
            }
        }).dxDataGrid("instance");
    }
})