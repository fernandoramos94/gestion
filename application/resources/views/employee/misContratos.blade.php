@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg" ng-controller="employeeController" ng-init="getContratos()">

    <!-- Container fluid Starts -->
    <div class="container-fluid">
        <!-- Row starts -->
        <div class="row gutter">
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <h3>Contratos Firmado</h3>
                <div class="panel">
                    <div class="panel-body">
                        <div id="grillaFirmados"></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <h3>Contratos Por Firmar</h3>
                <div class="panel">
                    <div class="panel-body">
                        <div id="grillaNoFirmados"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Row ends -->
    </div>
    <!-- Container fluid ends -->
    <div class="modal fade" tabindex="-1" id="firmar" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close resetFirma" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Firmar Contrato</h4>
                    </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-8">
                            <div class="form-group">
                                <label for="">Espacio para la firma</label>
                                <div id="signature"></div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <button type="button" class="btn btn-default btn-block resetFirma" id="resetFirma">Actualizar Firma</button>
                            <button type="button" class="btn btn-default btn-block" ng-click="firmarContrato();">Firmar</button>
                            <button type="button" class="btn btn-default btn-block resetFirma" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    
</div>

@stop
@section("js")
    <script src="{{asset('js/controllers/employeeController.js')}}"></script>
    <script>
	    $(document).ready(function() {
            var $sigdiv = $("#signature");
            $("#resetFirma").on("click", function(){
                $sigdiv.jSignature("reset");
            });
	    })
	</script>
@stop