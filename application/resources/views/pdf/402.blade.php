<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <title>Generacion de pdf</title>
</head>

<body>
   <style>
      .datosP {
         position: absolute;
         z-index: 9999;
         left: 0;
      }
   </style>
   <img style="width: 100%; position:absolute" src="{{asset('img/plantillas/402/0001.jpg')}}" alt="">
   <p class="datosP" style="top: 23.7%; left: 25%; font-size: 13px;">B76288836</p>
   <p class="datosP" style="font-size: 12px; top: 27%; left: 4%;">JUAN ANTONIO LOPEZ CARNE</p>
   <p class="datosP" style="font-size: 12px; top: 27%; left: 50.5%;">00813527V</p>
   <p class="datosP" style="font-size: 12px; top: 27%; left: 73.5%;">ADMINISTRADOR</p>
   <p class="datosP" style="font-size: 12px; top: 30%; left: 4%;">OHLIMPIA GLOBAL TALENT ETT, SL</p>
   <p class="datosP" style="font-size: 12px; top: 30%; left: 50.5%;">CL BRAVO
      MURILLO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1</p>
   <p class="datosP" style="font-size: 12px; top: 32.8%; left: 4%;">ESPAÑA</p>
   <p class="datosP" style="font-size: 12px; top: 32.9%; left: 31.2%;">724</p>
   <p class="datosP" style="font-size: 12px; top: 32.8%; left: 41%;">LAS PALMAS DE GRAN C</p>
   <p class="datosP" style="font-size: 12px; top: 32.8%; left: 73.5%;">35002</p>
   <!-- datos -->
   <p class="datosP" style="top: 37.3%; left: 4%; font-size: 13px;">0111</p>
   <p class="datosP" style="font-size: 12px; top: 37.3%; left: 15.5%;">35</p>
   <p class="datosP" style="font-size: 12px; top: 37.3%; left: 21.7%;">1193916</p>
   <p class="datosP" style="font-size: 12px; top: 37.3%; left: 30%;">81</p>
   <p class="datosP" style="font-size: 12px; top: 37.3%; left: 41%;">Actividades industriales de limpieza</p>
   <p class="datosP" style="font-size: 12px; top: 41.7%; left: 4%;">ESPAÑA</p>
   <p class="datosP" style="font-size: 12px; top: 41.9%; left: 41%;">724</p>
   <p class="datosP" style="font-size: 12px; top: 41.8%; left: 50.5%;">MOGÁN</p>
   <p class="datosP" style="font-size: 12px; top: 41.9%; left: 78%;">35012</p>

   <!-- datos del empleado -->

   <p class="datosP" style="top: 45.7%; left: 4%; font-size: 13px; text-transform: capitalize;">{{$data->name}}</p>
   <p class="datosP" style="font-size: 12px; top: 45.8%; left: 46.5%;">{{$data->DNI_NIE}}</p>
   <p class="datosP" style="font-size: 12px; top: 45.8%; left: 69.4%;">{{$data->fechaNacimiento}}</p>
   <p class="datosP" style="font-size: 12px; top: 49%; left: 4%;">{{$data->nAfiliacion}}</p>
   <p class="datosP" style="font-size: 12px; top: 49%; left: 18.2%;">{{$data->niveEstudio}}</p>
   <p class="datosP" style="font-size: 12px; top: 49.2%; left: 63%;"></p>
   <p class="datosP" style="font-size: 12px; top: 49%; left: 67%;">{{$data->nacionalidad}}</p>
   <p class="datosP" style="font-size: 12px; top: 49%; left: 90%;">{{$data->codigo_pais}}</p>
   <p class="datosP" style="font-size: 12px; top: 52.5%; left: 4%;">{{$data->municipio_domicilio}}</p>
   <p class="datosP" style="font-size: 12px; top: 52.5%; left: 41%;">{{$data->codigo_municipio}}</p>
   <p class="datosP" style="font-size: 12px; top: 52.5%; left: 50.5%;">{{$data->pais_domicilio}}</p>
   <p class="datosP" style="font-size: 12px; top: 52.9%; left: 83%;">{{$data->codigo_pais_domicilio}}</p>

   <img style="width: 100%" src="{{asset('img/plantillas/402/0002.jpg')}}" alt="">



   <img style="width: 100%" src="{{asset('img/plantillas/402/0003.jpg')}}" alt="">
   <img style="width: 100%" src="{{asset('img/plantillas/402/0004.jpg')}}" alt="">
   <img style="width: 100%" src="{{asset('img/plantillas/402/0005.jpg')}}" alt="">

</body>

</html>
