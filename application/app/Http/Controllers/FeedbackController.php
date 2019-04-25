<?php

namespace App\Http\Controllers;

use App\Feedback;
use Illuminate\Http\Request;
use Auth;
use Validator;
use Illuminate\Support\Facades\DB;
class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
        return view('feedback.index');
    }
    public function getFeedback()
    {
        if (Auth::user()->rol=='2' || (Auth::user()->rol=='3' )  )  {
            $feedback = DB::table('users')
        ->join('feedbacks_suggestions', 'users.id', '=', 'feedbacks_suggestions.user_id')
        ->where('users.id', '=', Auth::user()->id)
        ->get();
        } else {
            $feedback = DB::table('users')
        ->join('feedbacks_suggestions', 'users.id', '=', 'feedbacks_suggestions.user_id')
        ->get();
        }
        return response()->json($feedback);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view("feedback.create");
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject' => 'required',
            'description' => 'required'
        ]);

        if ($validator ->fails()) {
            return response()->json(['error'=>$validator->error()], 422);
        }

        $data = array (
            'subject' => $request->get('subject'),
            'description' => $request->get('description'),
            'user_id' => Auth::user()->id
        );
        Feedback::create($data);
        return redirect("home");
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Feedback  $feedback
     * @return \Illuminate\Http\Response
     */
    public function show(Feedback $feedback)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Feedback  $feedback
     * @return \Illuminate\Http\Response
     */
    public function edit(Feedback $feedback)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Feedback  $feedback
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Feedback $feedback)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Feedback  $feedback
     * @return \Illuminate\Http\Response
     */
    public function destroy(Feedback $feedback)
    {
        //
    }
}
