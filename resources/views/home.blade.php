@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg">

<!-- Container fluid Starts -->
<div class="container-fluid">

    <!-- Top Bar Starts -->
    <div class="top-bar clearfix">
        <div class="row gutter">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="page-title">
                    <h3>Inicio</h3>
                    <p>Bienvenidos al panel de administración</p>
                </div>
            </div>
        </div>
    </div>
    <!-- Top Bar Ends -->

    <!-- Row starts -->
    <div class="row gutter">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="row gutter">
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <div class="panel height1">
                        <div class="panel-heading">
                            <h4>Empleados</h4>
                        </div>
                        <div class="panel-body center-text">
                            0
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <div class="panel height1">
                        <div class="panel-heading">
                            <h4>Empresas</h4>
                        </div>
                        <div class="panel-body center-text">
                            0
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <div class="panel height1">
                        <div class="panel-heading">
                            <h4>Mensaje contacto</h4>
                        </div>
                        <div class="panel-body center-text">
                            0
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <div class="panel height1">
                        <div class="panel-heading">
                            <h4>Avisos</h4>
                        </div>
                        <div class="panel-body center-text">
                            0
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Row ends -->

</div>
<!-- Container fluid ends -->

</div>
@endsection
