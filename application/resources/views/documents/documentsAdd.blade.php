@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg" ng-controller="documentsController" ng-init="init()">

<!-- Container fluid Starts -->
<div class="container-fluid">

    <!-- Top Bar Starts -->
    <div class="top-bar clearfix">
        <div class="row gutter">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div class="page-title">
                    <h3>Documentos para firmas</h3>
                </div>
            </div>
        </div>
    </div>
    <!-- Top Bar Ends -->

    <!-- Row starts -->
    <div class="row gutter">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="panel">
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-6 col-xs-12 col-sm-12">
                            <label for="">Titulo documento</label>
                            <input type="text" name="" id="title" class="form-control">
                        </div>
                    </div>
                    
                    <textarea id="txtEditor"></textarea>
                    <button class="btn btn-success" type="button" ng-click="addDocumentSignature()">Guardar</button>
                    <button class="btn btn-default" type="button">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Row ends -->

</div>
<!-- Container fluid ends -->

</div>
@stop()
@section('js')
<script src="{{asset('js/controllers/documentsController.js')}}"></script>
<script type="text/javascript">
    $(document).ready(function() {
        $("#txtEditor").Editor();
    });
</script>

@stop()
