<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
	<head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="Gestion y Administracion" />
		<meta name="keywords" content="Gestion y Admistracion" />
		<meta name="author" content="Fernando Ramos Timote" />
		<link rel="shortcut icon" href="{{ asset('img/fav.png') }}">
		<title>Gestión administrativa</title>
		
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

	</head>

	<body>

		<!-- Header starts -->
		<header>

			<!-- Logo starts -->
			<a href="index.html" class="logo">
				<img src="img/logo.png" alt="logo" />
			</a>
			<!-- Logo ends -->

			<!-- Header actions starts -->
			<ul id="header-actions" class="clearfix">
				<li class="list-box user-admin hidden-xs dropdown">
					<div class="admin-details">
						<div class="name">{{ Auth::user()->name }}</div>
						<div class="designation">{{ Auth::user()->rol }}</div>
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
					<img src="img/thumbs/user1.png" alt="User Info">
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
				<li>
					<a href="#">
						<i class="icon-lab3"></i>
						<span class="menu-item">Empleados</span>
						<span class="down-arrow"></span>
					</a>
					<ul>
						<li>
							<a href='#'>Listar</a>
						</li>
						<li>
							<a href="{{url('/employee/create')}}">Agregar</a>
						</li>
					</ul>
				</li>
				<li>
					<a href='#'>
						<i class="icon-calendar7"></i>
						<span class="menu-item">Empresas</span>
						<span class="down-arrow"></span>
					</a>
					<ul>
						<li>
							<a href='#'>Listar</a>
						</li>
						<li>
							<a href='#'>Agregar</a>
						</li>
					</ul>
				</li>
				<li>
					<a href='#'>
						<i class="icon-colours"></i>
						<span class="menu-item">Documentos</span>
						<span class="down-arrow"></span>
					</a>
					<ul>
						<li>
							<a href='#'>Listar</a>
						</li>
						<li>
							<a href='#'>Agregar</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="#">
						<i class="icon-head"></i>
						<span class="menu-item">Contacto</span>
						<span class="down-arrow"></span>
					</a>
					<ul>
						<li>
							<a href='#'>Listar</a>
						</li>
						<li>
							<a href='#'>Agregar</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="#">
						<i class="icon-line-graph"></i>
						<span class="menu-item">Avisos</span>
						<span class="down-arrow"></span>
					</a>
					<ul>
						<li>
							<a href='#'>Listar</a>
						</li>
						<li>
							<a href='#'>Agregar</a>
						</li>
					</ul>
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

		<!-- Custom JS -->
		<script src="{{ asset('js/custom.js') }}"></script>
	</body>
</html>