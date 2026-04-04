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
        // Global Admin
        User::create([
            'name' => 'Administrator Global',
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'unit_pengolah' => null, // Access to all
        ]);
        
        // Unit Sekretariat
        User::create([
            'name' => 'Admin Sekretariat',
            'username' => 'sekretariat',
            'password' => Hash::make('password'),
            'role' => 'user',
            'unit_pengolah' => 'Sekretariat',
        ]);

        // Unit Perpustakaan
        User::create([
            'name' => 'Admin Perpustakaan',
            'username' => 'perpustakaan',
            'password' => Hash::make('password'),
            'role' => 'user',
            'unit_pengolah' => 'Bidang Perpustakaan',
        ]);

        // Unit Kearsipan
        User::create([
            'name' => 'Admin Kearsipan',
            'username' => 'kearsipan',
            'password' => Hash::make('password'),
            'role' => 'user',
            'unit_pengolah' => 'Bidang Kearsipan',
        ]);
    }
}
