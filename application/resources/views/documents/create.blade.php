@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg" ng-controller="documentsController" ng-init="init()">
    <!-- Container fluid Starts -->
    <div class="container-fluid">
        <div class="panel-body">
            <div class="custom-tabs">
                <!-- Nav tabs -->
                <ul class="nav nav-tabs nav-justified" role="tablist">
                    <li role="presentation" class="active fb">
                        <a href="#fb" aria-controls="fb" role="tab" data-toggle="tab">
                            Documento Categorias
                        </a>
                    </li>
                    <li role="presentation" class="fb">
                        <a href="#tw" aria-controls="tw" role="tab" data-toggle="tab">
                            Documento Cliente
                        </a>
                    </li>
                </ul>
                <!-- Tab panes -->
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="fb">
                        <div class="row">
                            <div class="col-md-6 col-sm-12 col-xs-12">
                                <div class="panel">
                                    <div class="panel-heading">
                                        <h4>Categorias</h4>
                                    </div>
                                    <div class="panel-body">
                                        <div class="skin skin-square clearfix">
                                            <div class="skin-section">
                                                <ul class="list">
                                                    <li ng-repeat="categorie in categories" class="col-md-6 col-xs-12 col-sm-12 text-left" style="margin-bottom: 1%;">
                                                        <!-- <input tabindex="@{{categorie.id}}" type="checkbox" name="categories" id="square-checkbox-@{{categorie.id}}" value="@{{categorie.id}}">
                                                        <label for="square-checkbox-@{{categorie.id}}">@{{ categorie.name }}</label> -->

                                                        <label class="switch">
                                                            <input type="checkbox" name="categories" value="@{{categorie.id}}">
                                                            <span class="slider round"></span>
                                                        </label>
                                                        <span>
                                                            @{{ categorie.name }}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12 col-xs-12">
                                <div class="panel">
                                    <div class="panel-heading">
                                        <h4>Seleccione un documento</h4>
                                    </div>
                                    <div class="panel-body">
                                        <input type="file" class="form-control" id="fileDocument">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row center-text">
                            <div class="col-md-12">
                                <a href="#" ng-click="saveCategorieDocument()" class="btn btn-fb">Guardar</a>
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" class="tab-pane center-text" id="tw">
                    <div class="row">
                            <div class="col-md-6 col-sm-12 col-xs-12">
                                <div class="panel">
                                    <div class="panel-heading">
                                        <h4>Clientes</h4>
                                    </div>
                                    <div class="panel-body">
                                        <div class="skin skin-square clearfix">
                                            <div class="skin-section">
                                                <ul class="list">
                                                    <li ng-repeat="client in clients" class="col-md-6 col-xs-12 col-sm-12 text-left" style="margin-bottom: 1%;">
                                                        <label class="switch">
                                                            <input type="checkbox" name="clients" value="@{{client.id}}">
                                                            <span class="slider round"></span>
                                                        </label>
                                                        <span>
                                                            @{{ client.name }}
                                                        </span>
                                                        
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12 col-xs-12">
                                <div class="panel">
                                    <div class="panel-heading">
                                        <h4>Seleccione un documento</h4>
                                    </div>
                                    <div class="panel-body">
                                        <input type="file" class="form-control" id="fileDocumentClient">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row center-text">
                            <div class="col-md-12">
                                <a href="#" ng-click="saveClientDocument()" class="btn btn-fb">Guardar</a>
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
    <script src="{{asset('js/controllers/documentsController.js')}}"></script>

@stop                          