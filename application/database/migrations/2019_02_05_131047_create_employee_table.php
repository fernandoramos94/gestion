<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee', function (Blueprint $table) {
            
            $table->increments('id');
            $table->string('last_name');
            $table->string('first_name');
            $table->string("DNI_NIE");
            $table->string("mobile_phone");
            $table->string("pais_domicilio")->nullable();
            $table->string("municipio_domicilio")->nullable();
            $table->string("nacionalidad")->nullable();
            $table->string("codigo_pais")->nullable();
            $table->string("codigo_municipio")->nullable();
            $table->string("niveEstudio")->nullable();
            $table->string("fechaNacimiento")->nullable();
            $table->text("firma")->nullable();
            $table->string("nAfiliacion")->nullable();
            $table->string("codigo_pais_domicilio")->nullable();
            $table->integer('user_id')->unsigned();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employee');
    }
}
