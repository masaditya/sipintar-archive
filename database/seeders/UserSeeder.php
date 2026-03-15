<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Administrator',
            'username' => 'admin',
            'password' => Hash::make('password'),
        ]);
        
        User::create([
            'name' => 'User Biasa',
            'username' => 'user',
            'password' => Hash::make('password'),
        ]);
    }
}
