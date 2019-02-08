@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg">

    <!-- Container fluid Starts -->
    <div class="container-fluid">
        <div class="top-bar clearfix">
            <div class="row gutter">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="page-title">
                        <h3>LISTA DE DATOS BANCARIOS</h3>
                    </div>
                </div>
            </div>
        </div>
        <!-- Row starts -->
        <div class="row gutter">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="panel">
                    <div class="panel-body">
                    <table id="TablaBankdata" class="table table-striped table-condensed table-bordered no-margin">
										<thead>
										  <tr>
									      <th>IBAN</th>
									      <th>Adjunto</th>
									      <th>Fecha de creación</th>
										  </tr>
										</thead>
										  
										<tbody>
                                        @foreach ($data as $bankdata)
                                        <tr>
												<td>{{$bankdata->IBAN }}</td>
												<td>
                                                    <a href="{{asset('uploads')}}/{{$bankdata->url}}" download="{{$bankdata->url}}" class="btn btn-md btn-success"><span class="icon-download3"></span></a>
                                                </td>
                                                <td>{{$bankdata->created_at}}</td>  
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
	$('#TablaBankdata').DataTable({
		'iDisplayLength': 5,
	});
});
</script>
@stop