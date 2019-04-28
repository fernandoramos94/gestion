<?php

namespace App\Http\Controllers;

use App\Employee;
use Illuminate\Http\Request;
use Validator;
use App\User;
use Mail;
use Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('employee.index');
    }

    public function getContratosFirmado()
    {
        $contratos = DB::table("contratos_empleado")
        ->join('employee', 'contratos_empleado.user_id', '=', 'employee.user_id')
        ->join('document_signature', 'document_signature.user_id', '=', 'employee.user_id')
        ->where([["employee.user_id", "=", Auth::user()->id], ["contratos_empleado.Firmado", '=', "Si"]])
        ->get();

        return response()->json($contratos);
    }

    public function getContratoSinFirmar()
    {
        $contratos = DB::table("employee")
        ->join('contratos_empleado', 'contratos_empleado.user_id', '=', 'employee.user_id')
        ->where([["employee.user_id", "=", Auth::user()->id], ["contratos_empleado.Firmado", '=', "No"]])
        ->get();
        return response()->json($contratos);
    }

    public function contrato(Request $request)
    {
        if ($request->get("tipoAccion") == "new") {
            $contrato = DB::table('contratos_empleado')->insert(
                ['user_id' => $request->get("user_id"), 'TipoContrato'=>$request->get("TipoContrato"), "MotivoContratacion"=>$request->get("MotivoContratacion"), "FechaFin"=>$request->get("FechaFin")]
            );
        } else {
            DB::table('contratos_empleado')
            ->where('id', $request->get("id"))
            ->update([
                'TipoContrato' => $request->get("TipoContrato"), 
                "MotivoContratacion" => $request->get("MotivoContratacion"),
                "FechaFin" => $request->get("FechaFin")
            ]);
        }
        
        
        return response()->json("Contratos almacenado de forma exitosa.");
    }
    
    public function getContrato(Request $request)
    {
        $contratos = DB::table('contratos_empleado')
        ->where('contratos_empleado.user_id', $request->get("user_id"))
        ->get();

        return response()->json($contratos);
    }

    public function getEmployee()
    {
        $employee = DB::table('users')
        ->join('employee', 'users.id', '=', 'employee.user_id')
        ->get();
        return response()->json($employee);
    }

    public function profile(Request $request)
    {
        $employee = DB::table('users')
        ->join('employee', 'users.id', '=', 'employee.user_id')
        ->where('users.id', $request->get("idUsuario"))
        ->first();

        return response()->json($employee);
    }
    public function updateProfile(Request $request)
    {
        DB::table('employee')
        ->where('user_id', $request->get("id"))
        ->update([
            "last_name" => $request->get('last_name'),
            "first_name" => $request->get('first_name'),
            "DNI_NIE" => $request->get('DNI_NIE'),
            "mobile_phone" => $request->get('mobile_phone'),
            "pais_domicilio" => $request->get("pais_domicilio"),
            "municipio_domicilio" => $request->get("municipio_domicilio"),
            "nacionalidad" => $request->get("nacionalidad"),
            "codigo_pais" => $request->get("codigo_pais"),
            "codigo_municipio" => $request->get("codigo_municipio"),
            "niveEstudio" => $request->get("niveEstudio"),
            "fechaNacimiento" => $request->get("fechaNacimiento"),
            "nAfiliacion" => $request->get("nAfiliacion"),
            "codigo_pais_domicilio"=>$request->get("codigo_pais_domicilio")
        ]);

        return response()->json("datos actualizados");
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('employee.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $logitud = 8;
        $psswd = substr( md5(microtime()), 1, $logitud);

        $data = array (
            "name" => $request->get('last_name')." ".$request->get('first_name'),
            "email" => $request->get('email'),
            "rol" => '3',
            "password" => bcrypt($psswd)
        );
        $user = User::create($data);
        
        $data_employe = array (
            "last_name" => $request->get('last_name'),
            "first_name" => $request->get('first_name'),
            "DNI_NIE" => $request->get('DNI_NIE'),
            "mobile_phone" => $request->get('mobile_phone'),
            "user_id" => $user->id,
            "pais_domicilio" => $request->get("pais_domicilio"),
            "municipio_domicilio" => $request->get("municipio_domicilio"),
            "nacionalidad" => $request->get("nacionalidad"),
            "codigo_pais" => $request->get("codigo_pais"),
            "codigo_municipio" => $request->get("codigo_municipio"),
            "niveEstudio" => $request->get("niveEstudio"),
            "fechaNacimiento" => $request->get("fechaNacimiento"),
            "nAfiliacion" => $request->get("nAfiliacion"),
            "codigo_pais_domicilio"=>$request->get("codigo_pais_domicilio")
        );
        Employee::create($data_employe);
        
        $dataCliente_user = DB::table("client_user")->insert(
            ['id_client' => $request->get("client"), 'id_user'=> $user->id]
        );

        $dataCategorieUser = DB::table('categorie_user')->insert(
            ['id_categorie' => $request->get("categorie"), 'id_user'=>$user->id]
        );
        $dataSend = array(
            'nombre' => $request->get('last_name')." ".$request->get('first_name'),
            'email' => $request->get('email'),
            'pass' => $psswd
        );

        Mail::send('email.assignedUser', ['data' => $dataSend], function ($m) use ($dataSend) {
            $m->from('no-reply@ohlimpiacanarias.com', 'ohlimpiacanarias');

            $m->to($dataSend['email'], $dataSend['nombre'])->subject('Asignación de usuario');
        });
        return response()->json("El empleado se ha registrado de forma exitosa");
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Employee $employee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function destroy(Employee $employee)
    {
        //
    }
}
