@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg" ng-controller="employeeController" ng-init="profile()">
    
    <div class="container-fluid">
        <div class="top-bar clearfix">
            <div class="row gutter">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="page-title">
                        <h3>FORMULARIO ACTUALIZACIÓN DE EMPLEADO</h3>
                    </div>
                </div>
            </div>
        </div>
        <!-- Row starts -->
        <div class="row gutter">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="panel">
                    <div class="panel-body">
                            <!--<div class="col-md-12 page-title">
                                <h4 class="project-name title-border-bottom">Datos del Cliente</h4>
                            </div>
                            <hr>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Cliente</label>
                                    <select name="mySelect" id="mySelect" class="form-control"
                                        ng-options="client.name for client in clients track by client.id"
                                        ng-model="client" ng-change="getCategoriesClient()">
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Categoría</label>
                                    <select name="mySelect" id="mySelect" class="form-control"
                                        ng-options="categorie.name for categorie in categorieClient track by categorie.id"
                                        ng-model="categorie">
                                    </select>
                                </div>
                            </div>-->
                            <div class="col-md-12 page-title">
                                <h4 class="project-name title-border-bottom">Datos personales</h4>
                            </div>
                            <hr>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Nombre</label>
                                    <input type="text" ng-model="datosPerfil.last_name" class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Apellidos</label>
                                    <input type="text" ng-model="datosPerfil.first_name" class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">DNI/NIE</label>
                                    <input type="text" ng-model="datosPerfil.DNI_NIE" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Correo electrónico</label>
                                    <input type="email" ng-model="datosPerfil.email" class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Teléfono móvil</label>
                                    <input type="text" ng-model="datosPerfil.mobile_phone" class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label">Fecha Nacimiento</label>
                                    <input type="text" id="fecha" ng-model="datosPerfil.fechaNacimiento" class="form-control" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-md-4 selectContainer">
                                <div class="form-group">
                                    <label class="control-label">Nivel Formativo</label>
                                    <input type="text" class="form-control" ng-model="datosPerfil.niveEstudio" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-md-4 selectContainer">
                                <div class="form-group">
                                    <label class="control-label">Nacionalidad</label>
                                    <input type="text" class="form-control pais" ng-model="datosPerfil.nacionalidad"  autocomplete="off">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label">Municipio Del Domicilio</label>
                                    <input type="text" class="form-control" ng-model="datosPerfil.municipio_domicilio" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-md-4 selectContainer">
                                <div class="form-group">
                                    <label class="control-label">Pais Domicilio</label>
                                    <input type="text" class="form-control pais" ng-model="datosPerfil.pais_domicilio" autocomplete="off">
                                </div>
                            </div>
                            <p><br />&nbsp;
                            <br /></p>
                            <div class="col-md-12">
                                <a class="btn btn-warning"><i class="icon-level-up"></i>Volver</a>
                                <button type="submit" class="btn btn-success" ng-click="updateProfile()"><i class="icon-save"></i>Actualizar</button>
                            </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <!-- Row ends -->
    </div>
</div>
@stop
@section("js")
    <script src="{{asset('js/controllers/employeeController.js')}}"></script>
    <script>
	    $(document).ready(function() {
	        var $sigdiv = $("#signature")
            $sigdiv.jSignature();
            $("#resetFirma").on("click", function(){
                $sigdiv.jSignature("reset");
            });

            $("#fecha").datepicker( {"dateFormat": "dd/mm/yy", "maxDate":"-17y", changeMonth: true, changeYear: true });
            
	    })
	</script>
@stop