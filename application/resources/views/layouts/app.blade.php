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
		
		<!-- Error CSS -->
		<link href="{{ asset('css/login.css') }}" rel="stylesheet" media="screen">

		<!-- Animate CSS -->
		<link href="{{ asset('css/animate.css') }}" rel="stylesheet" media="screen">

		<!-- Ion Icons -->
		<link href="{{ asset('fonts/icomoon/icomoon.css') }}" rel="stylesheet" />
	</head>
	<body>
        @yield('content')
	</body>
</html>