@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg" ng-controller="employeeController" ng-init="getEmployee()">

    <!-- Container fluid Starts -->
    <div class="container-fluid">
        <div class="top-bar clearfix">
            <div class="row gutter">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="page-title">
                        <h3>LISTA DE EMPLEADOS</h3>
                    </div>
                </div>
            </div>
        </div>
        <!-- Row starts -->
        <div class="row gutter">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="panel">
                    <div class="panel-body">
                        <div id="grilla"></div>
                    </div>
                </div>
            </div> 
        </div>
        <!-- Row ends -->
    </div>
    <!-- Container fluid ends -->
    <div class="modal fade" tabindex="-1" id="aplicaciones" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="col-lg-12">
                        <div class="col-lg-12">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">FORMULARIO REGISTRO DE EMPLEADO</h4>
                        </div>
                    </div>
                        
                    </div>
                <div class="modal-body">
                <div class="row gutter">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="panel">
                            <div class="panel-body">
                                    <div class="col-md-12 page-title">
                                        <h4 class="project-name title-border-bottom">Datos del Cliente</h4>
                                    </div>
                                    <hr>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="userName">Cliente</label>
                                            <select name="mySelect" id="mySelect" class="form-control"
                                                ng-options="client.name for client in clients track by client.id"
                                                ng-model="client" ng-change="getCategoriesClient()">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="userName">Categoría</label>
                                            <select name="mySelect" id="mySelect" class="form-control"
                                                ng-options="categorie.name for categorie in categorieClient track by categorie.id"
                                                ng-model="categorie">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-12 page-title">
                                        <h4 class="project-name title-border-bottom">Datos personales</h4>
                                    </div>
                                    <hr>
                                    <div class="col-md-4 col-sm-12">
                                        <div class="form-group">
                                            <label for="userName">Nombre</label>
                                            <input type="text" ng-model="data.last_name" class="form-control" required>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-12">
                                        <div class="form-group">
                                            <label for="userName">Apellidos</label>
                                            <input type="text" ng-model="data.first_name" class="form-control" required>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-12">
                                        <div class="form-group">
                                            <label for="userName">DNI/NIE</label>
                                            <input type="text" ng-model="data.DNI_NIE" onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" class="form-control" required>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-12">
                                        <div class="form-group">
                                            <label for="userName">Correo electrónico</label>
                                            <input type="email" ng-model="data.email" class="form-control" required>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-12">
                                        <div class="form-group">
                                            <label for="userName">Teléfono móvil</label>
                                            <input type="text" ng-model="data.mobile_phone" class="form-control" required>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-12">
                                        <div class="form-group">
                                            <label class="control-label">Fecha Nacimiento</label>
                                            <input type="text" id="fecha" ng-model="data.fechaNacimiento" class="form-control" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-12 selectContainer">
                                        <div class="form-group">
                                            <label class="control-label">Nivel Formativo</label>
                                            <input type="text" class="form-control" ng-model="data.niveEstudio" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-12 selectContainer">
                                        <div class="form-group">
                                            <label class="control-label">Nacionalidad</label>
                                            <input type="text" class="form-control pais" ng-model="data.nacionalidad"  autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-12">
                                        <div class="form-group">
                                            <label class="control-label">Municipio Del Domicilio</label>
                                            <input type="text" class="form-control" ng-model="data.municipio_domicilio" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-12 selectContainer">
                                        <div class="form-group">
                                            <label class="control-label">Pais Domicilio</label>
                                            <input type="text" class="form-control pais" ng-model="data.pais_domicilio" autocomplete="off">
                                        </div>
                                    </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-success" ng-click="enviarData()"">Guardar</button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    
</div>

@stop
@section("js")
    <script src="{{asset('js/controllers/employeeController.js')}}"></script>
@stop