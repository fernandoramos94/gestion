app.controller("feedbackController", function($scope, $location, $timeout){
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });

    $scope.mensaje = function(text, type){
        if(type == "error")
            toastr.error(text, '', {timeOut: 5000})
        else if(type == "success")
            toastr.success(text, '', {timeOut: 5000})
        else if(type == "warning")
            toastr.warning(text, '', {timeOut: 5000})
        
    }

    $scope.loading = function(status, mens){
        if(status){
            $("body").loading({
                theme: "dark",
                message: mens
            })
        }else {
            $(":loading").loading("stop");
        }
    }

    $scope.getFeedback = function(){
        $scope.loading(true, "Cargando...");
        $.ajax({
            url: url+"/api/getFeedback",
            method: "GET",
            success: function(resp){
                pintarGrilla(resp);
            }, error: function(error){
                console.log(error);
            }
        })
    }
    var pintarGrilla = function(data){
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
            columns:[
                { caption: "Opciónes", width: "200", cellTemplate: function(container, opcion){
                        $('<span class="icon-pencil2 btn btn-md btn-info"></span>').appendTo(container);
                        $('<span>&nbsp;</span>').appendTo(container);
                        $('<span class="icon-bin btn btn-md btn-danger"></span>').appendTo(container);
                    }
                },
                {
                    dataField: "name",
                    caption: "Empleado",
                }, {
                    dataField: "email",
                    caption: "Correo"
                }, {
                    dataField: "subject",
                    caption: "Asunto"
                }, {
                    dataField: "description",
                    caption: "Mensaje"
                }
            ],
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
            wordWrapEnabled: true,
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
})