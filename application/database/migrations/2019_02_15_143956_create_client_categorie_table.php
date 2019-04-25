<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientCategorieTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_categorie', function (Blueprint $table) {
            $table->increments('id');
            $table->integer("id_categorie")->unsigned();
            $table->integer("id_client")->unsigned();
            $table->timestamps();
            $table->foreign('id_categorie')->references('id')->on('categories');
            $table->foreign('id_client')->references('id')->on('clients');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('client_categorie');
    }
}
