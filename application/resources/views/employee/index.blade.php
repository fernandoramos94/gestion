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
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Generación de contrato</h4>
                    </div>
                <div class="modal-body">
                    <div class="col-lg-12"> 
                    </div>
                    <div class="col-lg-12">
                        <div id="grillaContrato"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-success">Guardar</button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    
</div>

@stop
@section("js")
    <script src="{{asset('js/controllers/employeeController.js')}}"></script>
@stop