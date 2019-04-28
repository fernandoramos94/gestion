<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateContratosEmpleadoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contratos_empleado', function (Blueprint $table) {
            $table->increments('id');
            $table->string("TipoContrato")->nullable();
            $table->integer("user_id")->unsigned();
            $table->string("FechaFin")->nullable();
            $table->string("MotivoContratacion")->nullable();
            $table->string("Firmado")->default("No");
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
        Schema::dropIfExists('contratos_empleado');
    }
}
