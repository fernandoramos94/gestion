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

Route::get('/nomina', function(){
    return view('nomina.index');
});

Route::get('/nomina/create', function(){
    return view('nomina.create');
});
Route::get('/getPdf/{id}', 'DocumentController@getPdf');

Route::get('/generatePdf/{id}', 'DocumentController@pdf');

Route::get('/feedback/create', 'FeedbackController@create');
Route::get('/bankdata/create', 'BankDataController@create');
Route::post('/employee/add', 'EmployeeController@store');
Route::post('/feedback/add', 'FeedbackController@store');
Route::get('/feedback', 'FeedbackController@index');
Route::post('/bankdata/add', 'BankDataController@store');
Route::get('/bankdata', 'BankDataController@index');
Route::get('/documents', 'DocumentController@index');
Route::get('/documents/create', 'DocumentController@create');
Route::post('/documents/add', 'DocumentController@store');
Route::post('/documents/addDocumentClient', 'DocumentController@documentCliente');
Route::post('/documents/addDocumentSignature', 'DocumentController@documentSignature');
Route::get('/documents/addDocument', function(){
    return view('documents.documentsAdd');
});
Route::get('/documents/documentSignature', function(){
    return view('documents.documentSignature');
});


Route::get("/document/getDocumentSignature", "DocumentController@getDocumentSignture");

// nomina

Route::post("/enviarSolicitud", "NominaController@store");
Route::post("/updateSolicitud", "NominaController@update");

// perfil

Route::post("/dataProfile", "EmployeeController@profile");
Route::post("/updateProfile", "EmployeeController@updateProfile");


Route::get("profile", function(){
    return view('employee.profile');
});

Route::post("/creacionContrato", "EmployeeController@contrato");
Route::post("/getContratos", "EmployeeController@getContrato");


// apis

Route::post('/api/getCategoriesClient', 'Services@getCategoriesClient');
Route::get('/api/getClients', 'Services@getClients');
Route::get('/api/getCategories', 'Services@getAllCategories');
Route::get('/api/getClients', 'Services@getAllClients');
Route::get('/api/getEmployee', 'EmployeeController@getEmployee');
Route::get('/api/getFeedback', 'FeedbackController@getFeedback');
Route::get('/api/getDocumentCategorie', 'DocumentController@getAllDocument');
Route::get('/api/getDocumentClient', 'DocumentController@getAllDocumentClient');
Route::get("/api/getSolicitudNomina", "NominaController@getSolicitudes");
Route::get("/api/getRevisionNomina", "NominaController@getRevisiones");
