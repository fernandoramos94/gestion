<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('auth.login');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::get('/employee/create', 'EmployeeController@create');
Route::get('/employee', 'EmployeeController@index');
Route::get('/feedback/create', 'FeedbackController@create');
Route::get('/bank_data/create', 'BankDataController@create');
Route::post('/employee/add', 'EmployeeController@store');
Route::post('/feedback/add', 'FeedbackController@store');
Route::get('/feedback', 'FeedbackController@index');
Route::post('/bankdata/add', 'BankDataController@store');
Route::get('/bankdata', 'BankDataController@index');
