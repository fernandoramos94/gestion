@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg">

    <!-- Container fluid Starts -->
    <div class="container-fluid">
        <div class="top-bar clearfix">
            <div class="row gutter">
                <div class="col-lg-12 col-md-6 col-sm-6 col-xs-12">
                    <div class="page-title">
                        <h3>CERTIFICACIÓN BANCARIA</h3>
                    </div>
                </div>
            </div>
        </div>
        <!-- Row starts -->
        <div class="row gutter">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="panel">
                    <div class="panel-body">
                        <form action="{{url('/bankdata/add')}}" method="post" accept-charset="UTF-8" enctype="multipart/form-data">
                           {{ csrf_field() }}
                            <div class="col-md-12 page-title">
                                <h4 class="project-name title-border-bottom">Ingrese certificación bancaria</h4>
                            </div>
                            <hr>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">IBAN</label>
                                    <input type="text" name='IBAN' class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="userName">Subir archivo</label>
                                  <input type="file" name="url" id=""class="form-control">
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