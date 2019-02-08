@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg">

    <!-- Container fluid Starts -->
    <div class="container-fluid">
        <div class="top-bar clearfix">
            <div class="row gutter">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="page-title">
                        <h3>FORMULARIO REGISTRO DE EMPLEADO</h3>
                    </div>
                </div>
            </div>
        </div>
        <!-- Row starts -->
        <div class="row gutter">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="panel">
                    <div class="panel-body">
                        <form action="{{url('/employee/add')}}" method="post">
                            {{csrf_field()}}
                            <div class="col-md-12 page-title">
                                <h4 class="project-name title-border-bottom">Datos personales</h4>
                            </div>
                            <hr>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Nombres</label>
                                    <input type="text" name="last_name" class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Apellidos</label>
                                    <input type="text" name="first_name" class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">DNI/NIE</label>
                                    <input type="text" name="DNI_NIE" class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Correo electronico</label>
                                    <input type="email" name="email" class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Telefono movil</label>
                                    <input type="text" name="mobile_phone" class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">categorias</label>
                                    <select name="categorie" id="" class="form-control" required>
                                        <option value="">-- Seleccione --</option>
                                        <option value="1">prueba 1</option>
                                        <option value="2">prueba 2</option>
                                    </select>
                                </div>
                            </div>
                            <p><br />&nbsp;
                            <br /></p>
                            <div class="col-md-12 page-title">
                                <h4 class="project-name title-border-bottom">Datos de accesos</h4>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Contraseña</label>
                                    <input type="password" name="password" class="form-control" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="userName">Confirmar contraseña</label>
                                    <input type="password" name="confirm_password" class="form-control" required>
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