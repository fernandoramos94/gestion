<?php

namespace App\Http\Controllers;

use App\Nomina;
use Illuminate\Http\Request;
use Auth;
use Validator;
use Illuminate\Support\Facades\DB;

class NominaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return
    }

    public function getSolicitudes()
    {
        if(Auth::user()->rol == 1){
            $data = DB::table("nomina_application")
            ->join("users", "nomina_application.user_id", "=", "users.id")
            ->join("employee", "users.id", "=", "employee.user_id")
            ->select("nomina_application.periodo", "nomina_application.id", "nomina_application.motivo", "nomina_application.adjunto", "employee.last_name", "employee.first_name")
            ->get();
        }else{
            $data = DB::table("nomina_application")
            ->join("users", "nomina_application.user_id", "=", "users.id")
            ->join("employee", "users.id", "=", "employee.user_id")
            ->select("nomina_application.periodo", "nomina_application.id", "nomina_application.motivo", "nomina_application.adjunto", "employee.last_name", "employee.first_name")
            ->where("nomina_application.user_id", Auth::user()->id)
            ->get();
        }
        return response()->json($data);
    }
    public function getRevisiones()
    {
        if(Auth::user()->rol == 1){
            $data = DB::table("nomina_revision")
            ->join("users", "nomina_revision.user_id", "=", "users.id")
            ->join("employee", "users.id", "=", "employee.user_id")
            ->select("nomina_revision.periodo", "nomina_revision.id", "nomina_revision.motivo", "nomina_revision.adjunto", "employee.last_name", "employee.first_name")
            ->get();
        }else{
            $data = DB::table("nomina_revision")
            ->join("users", "nomina_revision.user_id", "=", "users.id")
            ->join("employee", "users.id", "=", "employee.user_id")
            ->select("nomina_revision.periodo", "nomina_revision.id", "nomina_revision.motivo", "nomina_revision.adjunto", "employee.last_name", "employee.first_name")
            ->where("nomina_revision.user_id", Auth::user()->id)
            ->get();
        }
        return response()->json($data);
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view("nomina.create");
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = "";
        if($request->get("tipoSolicitud") == 1){
            $data = DB::table("nomina_application")->insert(["user_id" => Auth::user()->id, "periodo"=>$request->get("mes"), "motivo"=>$request->get("motivo")]);
        }else{
            $file = $request->file('file');
            \Storage::disk('local')->put($file->getClientOriginalName(),  \File::get($file));
        
            DB::table('nomina_revision')->insert(["periodo" => $request->get("periodo"), "motivo"=>$request->get("motivo"), "adjunto"=>$file->getClientOriginalName(), "user_id"=>Auth::user()->id]);
        }
        return response()->json($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Nomina  $nomina
     * @return \Illuminate\Http\Response
     */
    public function show(Nomina $nomina)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Nomina  $nomina
     * @return \Illuminate\Http\Response
     */
    public function edit(Nomina $nomina)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Nomina  $nomina
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $file = $request->file('file');
        \Storage::disk('local')->put($file->getClientOriginalName(),  \File::get($file));

        DB::table('nomina_application')
        ->where('id', $request->get("id"))
        ->update(['adjunto' => $file->getClientOriginalName()]);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Nomina  $nomina
     * @return \Illuminate\Http\Response
     */
    public function destroy(Nomina $nomina)
    {
        //
    }
}
