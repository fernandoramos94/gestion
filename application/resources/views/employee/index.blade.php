@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg">

    <!-- Container fluid Starts -->
    <div class="container-fluid">
        <div class="top-bar clearfix">
            <div class="row gutter">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="page-title">
                        <h3>LISTA DE EMPLEADOS</h3>
                    </div>
                </div>
            </div>
        </div>
        <!-- Row starts -->
        <div class="row gutter">
        <!-- @foreach ($data as $employee)
            <div class="col-md-4 col-sm-6 col-xs-12">
                <div class="users-wrapper red">
                    <div class="users-info clearfix">
                        <div class="users-avatar">
                            <img src="img/thumbs/user3.png" class="img-responsive" alt="Arise Admin">
                        </div>
                        <div class="users-detail">
                            <h5>{{ $employee->last_name }} {{$employee->first_name }}</h5>
                            <p>UX Designer</p>
                        </div>
                    </div>
                    <ul class="users-footer clearfix">
                        <li>
                            <p class="light">Correo</p>
                            <p>Canada</p>
                        </li>
                        <li>
                            <p class="light">Telefono movil</p>
                            <p>{{$employee->email}}</p>
                        </li>
                        <li>
                            <a href="#" class="add-btn added">
                                <i class="icon-check"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        @endforeach -->
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="panel">
                    <div class="panel-body">
                        <table id="TablaEmpleado" class="table table-striped table-condensed table-bordered no-margin">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>DNI/NIE</th>
                                    <th>Email</th>
                                    <th>Telefono movil</th>
                                    <th>Categoría</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($data as $employee)
                                    <tr>
                                        <td>{{ $employee->last_name }}</td>
                                        <td>{{$employee->first_name }}</td>
                                        <td>{{$employee->DNI_NIE}}</td>
                                        <td>{{$employee->email}}</td>
                                        <td>{{$employee->mobile_phone}}</td>
                                        <td>{{$employee->categorie}}</td>    
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> 
        </div>
        <!-- Row ends -->
    </div>
    <!-- Container fluid ends -->
    
</div>

@stop
@section('js')
<script type="text/javascript">
// Basic DataTable
$(function(){
	$('#TablaEmpleado').DataTable({
		'iDisplayLength': 5,
	});
});
</script>
@stop