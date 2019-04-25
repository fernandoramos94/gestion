<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Services extends Controller
{
    function getClients(){
        $clients = DB::table('clients')->get();
        return response()->json($clients);
    }
    function getCategoriesClient(Request $request){
        $client_categorie = DB::table('client_categorie')
        ->join('categories', 'client_categorie.id_categorie', '=', 'categories.id')
        ->where("id_client", "=", $request->get("id_client"))
        ->get();
        return response()->json($client_categorie);
    }
    public function getAllCategories()
    {
        $categories = DB::table('categories')
        ->get();
        return response()->json($categories);
    }

    public function getAllClients()
    {
        $clients = DB::table('clients')
        ->get();
        return response()->json($clients);
    }
}
