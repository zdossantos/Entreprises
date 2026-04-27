<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entreprises', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('siret');
            $table->unsignedBigInteger('user_id');
            $table->string('name');
            $table->string('adresse');
            $table->string('postalCode');
            $table->string('city');
            $table->bigInteger('siren');
            $table->date('creationDate');
            $table->string('sliceNbEmployee');
            $table->timestamps();
            $table->foreign('user_id')->on('users')->references('id')
                ->onDelete('CASCADE')
                ->onUpdate('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('entreprises');
    }
};
