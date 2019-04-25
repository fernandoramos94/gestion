<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Document;
use Illuminate\Support\Facades\Storage;
use Auth;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade as PDF;


class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        return view('documents.index');
    }
    function getPdf($id){
        $data = DB::table('users')
        ->join('employee', 'users.id', '=', 'employee.user_id')
        ->where('users.id', $id)
        ->first();
        $view =  \View::make('pdf.402', compact('data'))->render();
        $pdf = \App::make('dompdf.wrapper');
        $pdf->loadHTML($view);
        return $pdf->stream();
        // $pdf = PDF::loadView('pdf.402', $data);
        // return $pdf->stream();
    }

    public function pdf($id)
    {    
        $description = DB::table('document_signature')->where("id",$id)->first();
        $pdf = \App::make('dompdf.wrapper');
        $pdf->loadHTML($description->data);
        return $pdf->stream();
    }

    public function getAllDocument()
    {
        if(Auth::user()->rol == 1){
            $documents = DB::table("documents")
            ->join("document_categorie", "documents.id", "=", "document_categorie.id_document")
            ->join("categories", "document_categorie.id_categorie", "=", "categories.id")
            ->get();
        }else{
            $documents = DB::table("documents")
            ->join("document_categorie", "documents.id", "=", "document_categorie.id_document")
            ->join("categories", "document_categorie.id_categorie", "=", "categories.id")
            ->join("categorie_user", "categories.id", "=", "categorie_user.id_categorie")
            ->join("users", "categorie_user.id_user", "=", "users.id")
            ->select("documents.url", "categories.name", "documents.id")
            ->where('users.id', '=', Auth::user()->id)
            ->get();
        }
        

        return response()->json($documents);
    }
    public function getAllDocumentClient()
    {
        if(Auth::user()->rol == 1){
            $documents = DB::table("documents")
            ->join("document_client", "documents.id", "=", "document_client.id_document")
            ->join("clients", "document_client.id_client", "=", "clients.id")
            ->get();
        }else{
            $documents = DB::table("documents")
            ->join("document_client", "documents.id", "=", "document_client.id_document")
            ->join("clients", "document_client.id_client", "=", "clients.id")
            ->join("client_user", "clients.id", "=", "client_user.id_client")
            ->select("documents.url", "clients.name")
            ->where("client_user.id_user", Auth::user()->id)
            ->get();
        }
        return response()->json($documents);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('documents.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $file = $request->file('file');
        \Storage::disk('local')->put($file->getClientOriginalName(),  \File::get($file));
        $data = array (
            "url" => $file->getClientOriginalName(),
        );
        $doc = Document::create($data);
        $categories =explode(",", $request->get('categorie'));
        $dataSend = array();
        foreach ($categories as $key) {
            DB::table('document_categorie')->insert(["id_categorie" => $key, "id_document"=>$doc->id]);
        }
        return response()->json("Datos almacenado de forma exitosa.");
    }

    public function getDocumentSignture()
    {
        $data = DB::table("document_signature")->get();
        return response()->json($data);
    }
    public function documentSignature(Request $request)
    {
        $data = array(
            "data" => $request->get("data"),
            "title" => $request->get("title")
        );
        $documet = DB::table("document_signature")->insert($data);
        return response()->json("Documento almacenado de forma exitosa");
    }
    public function documentCliente(Request $request)
    {
        $file = $request->file('file');
        \Storage::disk('local')->put($file->getClientOriginalName(),  \File::get($file));
        $data = array (
            "url" => $file->getClientOriginalName(),
        );
        $doc = Document::create($data);
        $clients = explode(",", $request->get('client'));
        $dataSend = array();
        foreach ($clients as $key) {
            DB::table('document_client')->insert(["id_client" => $key, "id_document"=>$doc->id]);
        }
        return response()->json("Datos almacenado de forma exitosa.");
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
