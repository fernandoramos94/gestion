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
                    <table id="TablaFeedback" class="table table-striped table-condensed table-bordered no-margin">
										<thead>
										  <tr>
									      <th>Nombre y Apellido</th>
									      <th>Asunto</th>
									      <th>Descripción</th>
									      <th>Fecha de envio</th>
										  </tr>
										</thead>
										  
										<tbody>
                                        @foreach ($data as $feedback)
                                        <tr>
												<td>{{$feedback->name }}</td>
												<td>{{$feedback->subject}}</td>
												<td>{{$feedback->description}}</td>
                                                <td>{{$feedback->created_at}}</td>  
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
	$('#TablaFeedback').DataTable({
		'iDisplayLength': 5,
	});
});
</script>
@stop