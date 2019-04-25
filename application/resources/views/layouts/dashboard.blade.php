<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
	<head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="Gestion y Administracion" />
		<meta name="keywords" content="Gestion y Admistracion" />
		<meta name="csrf-token" content="{{ csrf_token() }}" />
		<meta name="author" content="Fernando Ramos Timote" />
		<link rel="shortcut icon" href="{{ asset('img/fav.png') }}">
		<title>Gestión administrativa</title>
		<link rel="stylesheet" type="text/css" href="{{ asset('plugin/devextreme/dist/css/dx.common.css') }}" />
		<link rel="stylesheet" type="text/css" href="{{ asset('plugin/devextreme/dist/css/dx.light.css') }}" />
		<!-- Bootstrap CSS -->
		<link href="{{ asset('css/bootstrap.min.css') }}" rel="stylesheet" media="screen" />

		<!-- Main CSS -->
		<link href="{{ asset('css/main.css') }}" rel="stylesheet" media="screen" />

		<!-- Ion Icons -->
		<link href="{{ asset('fonts/icomoon/icomoon.css') }}" rel="stylesheet" />
		
		<!-- C3 CSS -->
		<link href="{{ asset('css/c3/c3.css') }}" rel="stylesheet" />

		<!-- NVD3 CSS -->
		<link href="{{ asset('css/nvd3/nv.d3.css') }}" rel="stylesheet" />

		<!-- Horizontal bar CSS -->
		<link href="{{ asset('css/horizontal-bar/chart.css') }}" rel="stylesheet" />

		<!-- Calendar Heatmap CSS -->
		<link href="{{ asset('css/heatmap/cal-heatmap.css') }}" rel="stylesheet" />

		<!-- Circliful CSS -->
		<link rel="stylesheet" href="{{ asset('css/circliful/circliful.css') }}" />

		<!-- OdoMeter CSS -->
		<link rel="stylesheet" href="{{ asset('css/odometer.css') }}" />

		<link rel="stylesheet" href="{{ asset('css/users.css') }}">
		<link rel="stylesheet" href="{{ asset('plugin/loading/jquery.loading.min.css') }}">
		<link rel="stylesheet" href="{{ asset('css/toastr/toastr.min.css') }}">
		<link href="{{ asset('fonts/font-awesome.css')}}" rel="stylesheet" />
		<link href="{{ asset('css/wysiwyg-editor/editor.css') }}" rel="stylesheet" />
		<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
		<style>
			.modal{
				background: rgba(0,0,0,0.5);
			}
			.modal-content{
				background-color: #fff;
				box-shadow: none;
				border-radius: 0;
    			border: none;
			}
		</style>
	</head>

	<body ng-app="app">
		<input type="hidden" id="url" value="{{url('')}}">
		<input type="hidden" id="rolUser" value="{{Auth::user()->rol}}">

		<!-- Header starts -->
		<header>

			<!-- Logo starts -->
			<a href="index.html" class="logo">
				<img src="{{ asset('img/logo.png') }}" alt="logo" />
			</a>
			<!-- Logo ends -->

			<!-- Header actions starts -->
			<ul id="header-actions" class="clearfix">
				<li class="list-box user-admin hidden-xs dropdown">
					<div class="admin-details">
						<div class="name">{{ Auth::user()->name }}</div>
					</div>
					<a id="drop4" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown">
						<i class="icon-user"></i>
					</a>
					<ul class="dropdown-menu sm">
						<li class="dropdown-content">
							<a href="#">Edit Profile</a>
							<a href="#">Change Password</a>
							<a href="#">Settings</a>
                            <a href="{{ route('logout') }}" onclick="event.preventDefault();
                                document.getElementById('logout-form').submit();">
                                Cerrar Sesión
                            </a>
                            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                {{ csrf_field() }}
                            </form>
						</li>
					</ul>
				</li>
				<li>
					<button type="button" id="toggleMenu" class="toggle-menu">
						<i class="collapse-menu-icon"></i>
					</button>
				</li>
			</ul>
			<!-- Header actions ends -->
		</header>
		<!-- Header ends -->

		<!-- Left sidebar start -->
		<div class="vertical-nav">

			<!-- Collapse menu starts -->
			<button class="collapse-menu">
				<i class="icon-menu2"></i>
			</button>
			<!-- Collapse menu ends -->

			<!-- Current user starts -->
			<div class="user-details clearfix">
				<a href="profile.html" class="user-img">
					<img src="{{ asset('img/thumbs/user1.png') }}" alt="User Info">
					<!-- <span class="likes-info">9</span> -->
				</a>
				<h5 class="user-name">{{ Auth::user()->name }}</h5>
			</div>
			<!-- Current user ends -->

			<!-- Sidebar menu start -->
			<ul class="menu clearfix">
				<li class="active selected">
					<a href="#">
						<i class="icon-air-play"></i>
						<span class="menu-item">Inicio</span>
					</a>
				</li>
				  @if(Auth::user()->rol==1)
				<li>
					<a href="#">
						<i class="icon-briefcase3"></i>
						<span class="menu-item">Empleados</span>
						<span class="down-arrow"></span>
					</a>
					<ul>
						<li>
							<a href="{{url('/employee/')}}">Mostrar</a>
						</li>
						<li>
							<a href="{{url('/employee/create')}}">Agregar</a>
						</li>
					</ul>
				</li>
				@endif
				@if(Auth::user()->rol==1)
				<li>
					<a href='#'>
						<i class="icon-calendar7"></i>
						<span class="menu-item">Empresas</span>
						<span class="down-arrow"></span>
					</a>
					<ul>
						<li>
							<a href='#'>Mostrar</a>
						</li>
						<li>
							<a href='#'>Agregar</a>
						</li>
					</ul>
				</li>
				@endif
				@if(Auth::user()->rol == 3)
				<li>
					<a href='#'>
						<i class="icon-user"></i>
						<span class="menu-item">Datos personales</span>
						<span class="down-arrow"></span>
					</a>
					<ul>
						<li>
							<a href="{{ url('/profile/')}}">Mostrar</a>
						</li>
					</ul>
				</li>
				@endif()
				<li>
					<a href='#'>
						<i class="icon-folder3"></i>
						<span class="menu-item">Documentos</span>
						<span class="down-arrow"></span>
					</a>
					<ul>
						<li>
							<a href="{{ url('/documents/')}}">Mostrar Manuales</a>
						</li>
						@if(Auth::user()->rol==1)
						<li>
							<a href="{{ url('/documents/create')}}">Agregar Manuales</a>
						</li>
						<li>
							<a href="{{ url('/documents/documentSignature')}}">Mostrar Documentos con firmas</a>
						</li>
						<li>
							<a href="{{ url('/documents/addDocument')}}">Agregar Documentos con firmas</a>
						</li>
						@endif
					</ul>
				</li>
				<li>
					<a href="#">
						<i class="icon-mail"></i>
						<span class="menu-item">Feedback y sugerencias</span>
						<span class="down-arrow"></span>
					</a>
					<ul>
						<li>
							<a href="{{url('/feedback/')}}">Mostrar</a>
						</li>
						<li>
						<a href="{{url('/feedback/create')}}">Agregar</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="#">
						<i class="icon-paper"></i>
						<span class="menu-item">Datos bancarios</span>
						<span class="down-arrow"></span>
					</a >
					<ul>
						<li>
							<a href="{{url('/bankdata')}}">Mostrar</a>
						</li>
						<li>
						<a href="{{url('/bankdata/create')}}">Agregar</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="#">
						<i class="icon-paper"></i>
						<span class="menu-item">Nómina</span>
						<span class="down-arrow"></span>
					</a >
					<ul>
						<li>
							<a href="{{url('/nomina')}}">Mostrar</a>
						</li>
						<li>
						<a href="{{url('/nomina/create')}}">Solicitud / Revisión</a>
						</li>
					</ul>
				</li>
			</ul>
			<!-- Sidebar menu snd -->
		</div>
		<!-- Left sidebar end -->

		<!-- section -->
		@yield("content")
		<!-- section -->

		<!-- Footer Start -->
		<footer>
			Todos los derechos reservado <span><a href="www.ohlimpiacanarias.com" target="_blank">ohlimpiacanarias.com</a> </span> - 2019
		</footer>
		<!-- Footer end -->

		<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
		<script src="{{ asset('js/jquery.js') }}"></script>
		<script src="{{ asset('js/angular.min.js') }}"></script>
		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.7.8/angular-sanitize.min.js"></script>



		<!-- Include all compiled plugins (below), or include individual files as needed -->
		<script src="{{ asset('js/bootstrap.min.js') }}"></script>

		<!-- Sparkline Graphs -->
		<script src="{{ asset('js/sparkline/retina.js') }}"></script>
		<script src="{{ asset('js/sparkline/custom-sparkline.js') }}"></script>
		
		<!-- jquery ScrollUp JS -->
		<script src="{{ asset('js/scrollup/jquery.scrollUp.js') }}"></script>

		<!-- D3 JS -->
		<script src="{{ asset('js/d3/d3.v3.min.js') }}"></script>

		<!-- D3 Power Gauge -->
		<script src="{{ asset('js/d3/d3.powergauge.js') }}"></script>

		<!-- D3 Meter Gauge Chart -->
		<script src="{{ asset('js/d3/gauge.js') }}"></script>
		<script src="{{ asset('js/d3/gauge-custom.js') }}"></script>
		
		<!-- C3 Graphs -->
		<script src="{{ asset('js/c3/c3.min.js') }}"></script>
		<script src="{{ asset('js/c3/c3.custom.js') }}"></script>

		<!-- NVD3 JS -->
		<script src="{{ asset('js/nvd3/nv.d3.js') }}"></script>
		<script src="{{ asset('js/nvd3/nv.d3.custom.boxPlotChart.js') }}"></script>
		<script src="{{ asset('js/nvd3/nv.d3.custom.stackedAreaChart.js') }}"></script>

		<!-- Horizontal Bar JS -->
		<script src="{{ asset('js/horizontal-bar/horizBarChart.min.js') }}"></script>
		<script src="{{ asset('js/horizontal-bar/horizBarCustom.js') }}"></script>

		<!-- Gauge Meter JS -->
		<script src="{{ asset('js/gaugemeter/gaugeMeter-2.0.0.min.js') }}"></script>
		<script src="{{ asset('js/gaugemeter/gaugemeter.custom.js') }}"></script>

		<!-- Calendar Heatmap JS -->
		<script src="{{ asset('js/heatmap/cal-heatmap.min.js') }}"></script>
		<script src="{{ asset('js/heatmap/cal-heatmap.custom.js') }}"></script>

		<!-- Odometer JS -->
		<script src="{{ asset('js/odometer/odometer.min.js') }}"></script>
		<script src="{{ asset('js/odometer/custom-odometer.js') }}"></script>

		<!-- Peity JS -->
		<script src="{{ asset('js/peity/peity.min.js') }}"></script>
		<script src="{{ asset('js/peity/custom-peity.js') }}"></script>

		<!-- Circliful js -->
		<script src="{{ asset('js/circliful/circliful.min.js') }}"></script>
		<script src="{{ asset('js/circliful/circliful.custom.js') }}"></script>

		<script src="{{ asset('js/datatables/dataTables.min.js') }}"></script>
		<script src="{{ asset('js/datatables/dataTables.bootstrap.min.js') }}"></script>
		<script src="{{ asset('js/datatables/dataTables.tableTools.js') }}"></script>
		<script src="{{ asset('js/datatables/autoFill.min.js')}}"></script>
		<script src="{{ asset('js/datatables/autoFill.bootstrap.min.js')}}"></script>
		<script src="{{ asset('js/datatables/fixedHeader.min.js')}}"></script>

		<script src="{{ asset('plugin/loading/jquery.loading.min.js') }}"></script>
		<script src="{{ asset('js/toastr/toastr.min.js') }}"></script>
		<script src="{{ asset('js/wysiwyg-editor/editor.js') }}"></script>
		
		<script type="text/javascript" src="{{ asset('plugin/devextreme/dist/js/dx.all.js') }}"></script>

		<script type="text/javascript" src="{{ asset('plugin/signature/flashcanvas.js') }}"></script>
		<script type="text/javascript" src="{{ asset('plugin/signature/jSignature.min.js') }}"></script>

		<!-- Custom JS -->
		<script src="{{ asset('js/custom.js') }}"></script>
		<script src="{{ asset('js/controllers/app.js') }}"></script>
		
		@yield('js')
	</body>
</html>