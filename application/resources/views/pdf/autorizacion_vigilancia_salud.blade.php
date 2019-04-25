<link href="http://gestion.ohlimpiacanarias.com/css/bootstrap.min.css" rel="stylesheet" media="screen" />
<style>
.table-bordered>tbody>tr>td{
    border:solid #000 1px;
    padding: 8px;
    padding-left: 8px;
    line-height: 1;
    vertical-align: middle;
    color: #000;
}
p{
    color: #000;
}
hr{
    border: solid #000 1px;
}
div{
    font-family: Times New Roman !important;
}
</style>
<div class="col-lg-12">
    <div class="col-lg-12">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAABWCAMAAADR7HuaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQzNkQ3QzNFOEI0NzExRTRCMzk1ODZDQkJDREVCNzU4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQzNkQ3QzNGOEI0NzExRTRCMzk1ODZDQkJDREVCNzU4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDM2RDdDM0M4QjQ3MTFFNEIzOTU4NkNCQkNERUI3NTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDM2RDdDM0Q4QjQ3MTFFNEIzOTU4NkNCQkNERUI3NTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7OqGmUAAADAFBMVEUkHBDkFDSGgnvv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">
    </div>
    <div class="col-lg-12" style="margin-bottom: 2%; margin-top: 2%;">
        <h4 class="text-center"><b>AUTORIZACION VIGILANCIA DE LA SALUD</b></h4>
    </div>
    <div class="col-lg-12">
        <table class="table table-bordered">
            <tbody>
                <tr>
                    <td><b>DATOS DEL TRABAJADOR</b></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="col-lg-12">
        <p><b>Nombre: </b></p>
        <p><b>Apellidos: </b></p>
        <p><b>DNI/NIE: </b></p>
        <p><b>Puesto de Trabajo: </b></p>
    </div>
    <div class="col-lg-12" style="margin-top: 5px;">
        <table class="table table-bordered" >
            <tbody>
                <tr>
                    <td><b>DATOS DE LA EMPRESA</b></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="col-lg-12">
        <p><b>Nombre: </b></p>
        <p><b>Centro: </b></p>
    </div>
    <div class="col-lg-12">
        <hr>
    </div>
    <div class="col-lg-12">
        <p class="text-justify">Universal Prevención y Salud, Sociedad de Prevención, S.L., en adelante, Unipresalud,
        le informa que en cumplimiento de la Ley de Prevención de Riesgos Laborales, y en función de la concertación por
        parte de su empresa de nuestros Servicios de Prevención, se procederá a la realización de un examen de salud,
        que forma parte de la Vigilancia de la Salud, para lalorar si puede realizar la actividad sin riesgo para su
        salud o para la salud de terceras personas.</p>
    </div>
    <div class="col-lg-12">
        <p class="text-justify">Así mismo y entendiendo el carácter voluntario del citado examen de salud, según el
        artículo 22.1, le&nbsp;solicito autorización para su realización, y con el objeto de cumplir lo establecido por
        la legislación sobre protección de datos, el consentimiento expreso para incluir los datos que se desprendan de
        dicho examen de salud, en un fichero automatizado del Servicio de Vigilancia de la Salud de Unipresalud, el cual
        los mantendrá con total reserva y confidencialidad.</p>
    </div>
    <div class="col-lg-12">
        <p>En caso contrario, le agradeceré manifieste por escrito su negativa a pasar el examen de salud, mediante el
        apartado correspondiente.</p>
    </div>
    <div class="col-lg-12">
        <table class="table table-bordered">
            <tbody>
                <tr>
                    <td class="text-center">Le hago saber que (  ) quiero pasar el examen de salud.
                        (Conteste SI o NO)</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="col-lg-12">
        <table class="table">
            <tbody>
                <tr>
                    <td style="border: none">Fecha:</td>
                    <td style="border: none">Dirección de Salud Laboral: </td>
                </tr>
                <tr>
                    <td style="border: none">Firma del trabajador:</td>
                    <td style="border: none">Unipresalud</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>