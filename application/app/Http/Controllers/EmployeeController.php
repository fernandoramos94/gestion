<?php

namespace App\Http\Controllers;

use App\Employee;
use Illuminate\Http\Request;
use Validator;
use App\User;
use Illuminate\Support\Facades\DB;
class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $employee = DB::table('users')
        ->join('employee', 'users.id', '=', 'employee.user_id')
        ->get();
        return view('employee.index')->with('data',$employee);
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
        // dd($request);
        // $validator = Validator::make($request->all(), [
        //     'last_name' => 'required',
        //     'first_name' => 'required',
        //     'DNI_NIE' => 'required',
        //     'email' => 'required|email',
        //     'mobile_phone' => 'required',
        //     'categorie' => 'required',
        //     'password' => 'required',
        //     'confirm_password' => 'required|same:password'
        // ]);

        // if ($validator ->fails()) {
        //     return response()->json(['error'=>$validator->error()], 422);
        // }

        $data = array (
            "name" => $request->get('last_name')." ".$request->get('first_name'),
            "email" => $request->get('email'),
            "rol" => '3',
            "password" => bcrypt($request->get('password'))
        );
        $user = User::create($data);
        $data_employe = array (
            "last_name" => $request->get('last_name'),
            "first_name" => $request->get('first_name'),
            "DNI_NIE" => $request->get('DNI_NIE'),
            "mobile_phone" => $request->get('mobile_phone'),
            "categorie" => $request->get('categorie'),
            "user_id" => $user->id
        );
        Employee::create($data_employe);
        return redirect("employee");
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
