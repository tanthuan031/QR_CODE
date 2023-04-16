<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class User extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('users')->insert([
            ['id'=>1,'student_code'=>3119410420,'first_name'=>'Ho Tan','last_name'=>'Thuan','email'=>'tanthuan@gmail.com','password'=>'1234'],
            ['id'=>2,'student_code'=>311941042,'first_name'=>'Ho Tan','last_name'=>'Thuan','email'=>'tanthuan@gmail.com','password'=>'1234'],
        ]);
    }
}
