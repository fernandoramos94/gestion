@extends('layouts.dashboard')

@section('content')
<div class="dashboard-wrapper dashboard-wrapper-lg" ng-controller="feedbackController" ng-init="getFeedback()">

    <!-- Container fluid Starts -->
    <div class="container-fluid">
        <div class="top-bar clearfix">
            <div class="row gutter">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="page-title">
                        <h3>FEEDBACKS Y SUGERENCIAS</h3>
                    </div>
                </div>
            </div>
        </div>
        <!-- Row starts -->
        <div class="row gutter">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="panel">
                    <div class="panel-body">
                        <div id="grilla"></div>
                    </div>
                </div>
            </div> 
        </div>
        <!-- Row ends -->
    </div>
    <!-- Container fluid ends -->
    
</div>

@stop
@section("js")
    <script src="{{asset('js/controllers/feedbackController.js')}}"></script>
@stop