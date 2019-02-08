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