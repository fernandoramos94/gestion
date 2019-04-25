<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDocumentCategorieTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('document_categorie', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_document')->unsigned();
            $table->integer('id_categorie')->unsigned();
            $table->timestamps();
            $table->foreign('id_document')->references('id')->on('documents');
            $table->foreign('id_categorie')->references('id')->on('categories');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('document_categorie');
    }
}
