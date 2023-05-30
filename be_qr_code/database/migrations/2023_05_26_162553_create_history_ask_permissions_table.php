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
        Schema::create('history_ask_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('class_code');
            $table->integer('teacher_id');
            $table->string('student_code');
            $table->integer('number_roll_call'); //Tuan
            $table->integer('number_lesson_week'); //Tiet
            $table->string('reason'); //Ly do
            $table->integer('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('history_ask_permissions');
    }
};
