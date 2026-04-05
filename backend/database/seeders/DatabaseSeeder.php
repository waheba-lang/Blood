<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@bloodconnect.com',
            'password' => bcrypt('password123'),
            'role' => 'admin'
        ]);

        User::factory()->create([
            'name' => 'John Patient',
            'email' => 'patient@bloodconnect.com',
            'password' => bcrypt('password123'),
            'role' => 'patient',
            'city' => 'Casablanca',
            'blood_type' => 'O+',
        ]);

        User::factory()->create([
            'name' => 'Sarah Donor',
            'email' => 'donor@bloodconnect.com',
            'password' => bcrypt('password123'),
            'role' => 'donor',
            'city' => 'Casablanca',
            'blood_type' => 'A+',
            'is_available' => true,
        ]);
    }
}
