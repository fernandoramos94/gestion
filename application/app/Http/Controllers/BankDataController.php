<?php

namespace App\Http\Controllers;

use App\BankData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Auth;
use Illuminate\Support\Facades\DB;
class BankDataController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (Auth::user()->rol=='2' || (Auth::user()->rol=='3' )  )  {
            $bankdata = DB::table('users')
        ->join('bank_data', 'users.id', '=', 'bank_data.user_id')
        ->where('users.id', '=', Auth::user()->id)
        ->get();
        } else {
            $bankdata = DB::table('users')
        ->join('bank_data', 'users.id', '=', 'bank_data.user_id')
        ->get();
        }
        return view('bank_data.index')->with('data',$bankdata);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view("bank_data.create");
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $fileName = "";
        if($request->file("url")){
            $file = $request->file('url');
            \Storage::disk('local')->put($file->getClientOriginalName(),  \File::get($file));
            $fileName = $file->getClientOriginalName();
        }
        $data = array (
            "IBAN" => $request->get('input1')."".$request->get('input2')."".$request->get('input3')."".$request->get('input4')."".$request->get('input5'),
            "url" => $fileName,
            'user_id' => Auth::user()->id
        );
        Bankdata::create($data);
        return redirect("home");
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\BankData  $bankData
     * @return \Illuminate\Http\Response
     */
    public function show(BankData $bankData)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\BankData  $bankData
     * @return \Illuminate\Http\Response
     */
    public function edit(BankData $bankData)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\BankData  $bankData
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, BankData $bankData)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\BankData  $bankData
     * @return \Illuminate\Http\Response
     */
    public function destroy(BankData $bankData)
    {
        //
    }
}
