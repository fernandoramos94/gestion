@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg" ng-controller="nominaController" ng-init="init()">

    <!-- Container fluid Starts -->
    <div class="container-fluid">
        <div class="top-bar clearfix">
            <div class="row gutter">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="page-title">
                        <!-- <h3>SOLICITUD DE NÓMINA</h3> -->
                    </div>
                </div>
            </div>
        </div>
        <!-- Row starts -->
        <div class="row gutter">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="panel">
                    <div class='panel-heading text-left'>
                        <h4 class="">SOLICITUD DE NÓMINA</h4>
                    </div>
                    <div class="panel-body">
                        <div id="grillaSolicitudes"></div>
                    </div>
                </div>
            </div> 
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="panel">
                    <div class='panel-heading text-left'>
                        <h4 class="">REVISIONES DE NÓMINA</h4>
                    </div>
                    <div class="panel-body">
                        <div id="grillaRevisiones"></div>
                    </div>
                </div>
            </div> 
        </div>
        <!-- Row ends -->
    </div>

    <!-- Container fluid ends -->

    <!-- modal -->
    <div class="modal fade" id="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Adjuntar Nómina</h4>
                </div>
                <div class="modal-body">
                    <input type="file" class="form-control" name="" id="adjunto" />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" ng-click="adjuntoNomina()">Guardar</button>
                </div>
            </div>
        </div>
    </div>
    
</div>

@stop
@section("js")
    <script src="{{asset('js/controllers/nominaController.js')}}"></script>
@stop