@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg">

    <!-- Container fluid Starts -->
    <div class="container-fluid">
        <div class="top-bar clearfix">
            <div class="row gutter">
                <div class="col-lg-12 col-md-6 col-sm-6 col-xs-12">
                    <div class="page-title">
                        <h3>FORMULARIO DE SUGERENCIAS Y RECLAMOS</h3>
                    </div>
                </div>
            </div>
        </div>
        <!-- Row starts -->
        <div class="row gutter">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="panel">
                    <div class="panel-body">
                        <form action="{{url('/feedback/add')}}" method="post">
                            {{csrf_field()}}
                            <div class="col-md-12 page-title">
                                <h4 class="project-name title-border-bottom">Ingrese su petición</h4>
                            </div>
                            <hr>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Asunto</label>
                                    <input type="text" name="subject" class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="userName">Descripción</label>
                                   <textarea name="description" class="form-control" cols="30" rows="10"></textarea>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <a class="btn btn-warning"><i class="icon-level-up"></i>Volver</a>
                                <button type="submit" class="btn btn-success"><i class="icon-save"></i>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- Row ends -->
    </div>
    <!-- Container fluid ends -->
    
</div>
@stop