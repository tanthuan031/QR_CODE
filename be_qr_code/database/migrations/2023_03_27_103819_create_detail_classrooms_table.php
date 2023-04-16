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
        Schema::create('detail_classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('student_code');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('roll_coll');
            $table->string('score');
            $table->foreignId('classroom_id')->constrained('classrooms');
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
        Schema::dropIfExists('detail_classrooms');
    }
};
