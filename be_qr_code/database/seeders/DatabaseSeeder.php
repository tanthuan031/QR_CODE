<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::factory(1)->create();
        DB::table('teachers')->insert([
            ['id' => 1, 'teacher_code' => 800000, 'first_name' => 'Ho Tan', 'last_name' => 'Thuan', 'email' => 'tanthuan@gmail.com', 'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'], //password
        ]);

        //         \App\Models\User::factory()->create([
        //             'name' => 'Test User',
        //             'email' => 'test@example.com',
        //         ]);
        //        $this->call([
        //            User::class
        //        ]);
    }
}
