@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg" ng-controller="nominaController" ng-init="init()">
    <!-- Container fluid Starts -->
    <div class="container-fluid">
        <div class="panel-body">
            <div class="custom-tabs">
                <!-- Nav tabs -->
                <ul class="nav nav-tabs nav-justified" role="tablist">
                    <li role="presentation" class="active fb">
                        <a href="#fb" aria-controls="fb" role="tab" data-toggle="tab">
                            SOLICITUD DE NÓMINA
                        </a>
                    </li>
                    <li role="presentation" class="fb">
                        <a href="#tw" aria-controls="tw" role="tab" data-toggle="tab">
                            REVISIÓN DE NÓMINA
                        </a>
                    </li>
                </ul>
                <!-- Tab panes -->
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="fb">
                        <div class="row">
                            <div class="col-md-12 col-sm-12 col-xs-12">
                                <div class="panel">
                                    <div class="panel-heading">
                                        <h4></h4>
                                    </div>
                                    <div class="panel-body">
                                        <div class="skin skin-square clearfix">
                                            <div class="skin-section">
                                                <div class="col-lg-4 col-sm-12 col-xs-12">
                                                    <label for="">
                                                        ¿Qué periodo (mes) de nómina desea solicitar?
                                                    </label>
                                                    <input type="text" class="form-control" ng-model="solicitud.mes">
                                                </div>
                                                <div class="col-lg-4 col-sm-12 col-xs-12">
                                                    <label for="">
                                                        ¿Cuál es el motivo de esta solicitud?
                                                    </label>
                                                    <input type="text" class="form-control" ng-model="solicitud.motivo">
                                                </div>
                                                <div class="col-lg-12">
                                                    <p class="text-info"><b >Nota: </b> No podrá solicitar su nómina hasta el día 10 del mes siguiente al periodo solicitado (ej.: Las nóminas del mes de enero no podrán ser solicitadas hasta a partir del día 10 de febrero)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row center-text">
                            <div class="col-md-12">
                                <a href="#" ng-click="saveSolicitud()" class="btn btn-fb">Enviar</a>
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="tw">
                    <div class="row">
                            <div class="col-md-12 col-sm-12 col-xs-12">
                                <div class="panel">
                                    <div class="panel-heading">
                                        <h4></h4>
                                    </div>
                                    <div class="panel-body">
                                        <div class="skin skin-square clearfix">
                                            <div class="skin-section">
                                                <div class="col-lg-4 col-sm-12 col-xs-12">
                                                    <label for="">¿Qué periodo (mes) de nómina desea revisar?</label>
                                                    <input type="text" class="form-control" ng-model="revision.mes">
                                                </div>
                                                <div class="col-lg-4 col-sm-12 col-xs-12">
                                                    <label for="">¿Cuál es el motivo de esta solicitud?</label>
                                                    <input type="text" class="form-control" ng-model="revision.motivo">
                                                </div>
                                                <div class="col-lg-8 col-sm-12 col-xs-12">
                                                    <label for="">Adjunte su planning completado por usted del periodo (mes) que desea que le sea revisado.</label>
                                                    <input type="file" ng-model="revision.adjunto" id="fileDocument" class="form-control">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row center-text">
                            <div class="col-md-12">
                                <a href="#" ng-click="saveRevision()" class="btn btn-fb">Enviar</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@stop()  
@section("js")
    <script src="{{asset('js/controllers/nominaController.js')}}"></script>

@stop                          