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
                            <div class="row col-lg-12">
                                <div class="col-lg-2 col-xs-12 col-sm-12">
                                    <input class="form-control" type="text" name="input1" placeholder="IBAN" required />
                                </div>
                                <div class="col-lg-2 col-xs-12 col-sm-12">
                                    <input class="form-control" type="text" name="input2" pattern=".{4,}" maxlength="4" placeholder="ENTIDAD" min="0" max="9999" title="Este campo requiere 4 dígitos" onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;" required/>
                                </div>
                                <div class="col-lg-2 col-xs-12 col-sm-12">
                                    <input class="form-control" type="text" name="input3" pattern=".{4,}" maxlength="4" placeholder="SUCURSAL" min="0" max="9999" title="Este campo requiere 4 dígitos" onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;" required/>
                                </div>
                                <div class="col-lg-2 col-xs-12 col-sm-12">
                                <input class="form-control" type="text" name="input4" pattern=".{2,}" maxlength="2" placeholder="D.C." min="0" max="99" title="Este campo requiere 2 dígitos" onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;" required/>
                                </div>
                                <div class="col-lg-4 col-xs-12 col-sm-12">
                                <input class="form-control" type="text" name="input5" pattern=".{10,}" maxlength="10" placeholder="NÚMERO DE CUENTA" min="0" max="9999999999" title="Este campo requiere 10 dígitos" onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;" required/>
                                </div>
                            </div>
                            <div class="col-lg-12 col-xs-12 col-sm-12">
                                <p class="text-center"><strong>IBAN ES62 0075 8902 1806 0401 4055; BIC: POPUESMM</strong></p>
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