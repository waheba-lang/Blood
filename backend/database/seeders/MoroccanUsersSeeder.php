<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class MoroccanUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Hash::make('password123');

        $users = [
            // Donors
            [
                'name' => 'Karim El Amrani',
                'email' => 'karim.elamrani@example.com',
                'password' => $password,
                'role' => 'donor',
                'phone' => '+212600112233',
                'city' => 'Casablanca',
                'blood_type' => 'O+',
                'is_available' => true,
                'age' => 28,
                'gender' => 'male',
                'last_donation_at' => Carbon::now()->subMonths(4),
            ],
            [
                'name' => 'Fatima Zahra',
                'email' => 'fatima.zahra@example.com',
                'password' => $password,
                'role' => 'donor',
                'phone' => '+212600445566',
                'city' => 'Rabat',
                'blood_type' => 'A+',
                'is_available' => true,
                'age' => 32,
                'gender' => 'female',
                'last_donation_at' => null,
            ],
            [
                'name' => 'Youssef Berrada',
                'email' => 'youssef.berrada@example.com',
                'password' => $password,
                'role' => 'donor',
                'phone' => '+212600778899',
                'city' => 'Marrakech',
                'blood_type' => 'B-',
                'is_available' => true,
                'age' => 45,
                'gender' => 'male',
                'last_donation_at' => Carbon::now()->subMonths(6),
            ],
            [
                'name' => 'Amina Bennani',
                'email' => 'amina.bennani@example.com',
                'password' => $password,
                'role' => 'donor',
                'phone' => '+212600123123',
                'city' => 'Fes',
                'blood_type' => 'AB+',
                'is_available' => true,
                'age' => 24,
                'gender' => 'female',
                'last_donation_at' => null,
            ],
            [
                'name' => 'Hassan Alaoui',
                'email' => 'hassan.alaoui@example.com',
                'password' => $password,
                'role' => 'donor',
                'phone' => '+212600321321',
                'city' => 'Tangier',
                'blood_type' => 'O-',
                'is_available' => true,
                'age' => 38,
                'gender' => 'male',
                'last_donation_at' => Carbon::now()->subMonths(2), // not eligible maybe
            ],
            // Patients
            [
                'name' => 'Khadija Tazi',
                'email' => 'khadija.tazi@example.com',
                'password' => $password,
                'role' => 'patient',
                'phone' => '+212611223344',
                'city' => 'Casablanca',
                'blood_type' => 'A-',
                'is_available' => false,
                'age' => 50,
                'gender' => 'female',
            ],
            [
                'name' => 'Nabil Chraibi',
                'email' => 'nabil.chraibi@example.com',
                'password' => $password,
                'role' => 'patient',
                'phone' => '+212611556677',
                'city' => 'Agadir',
                'blood_type' => 'O+',
                'is_available' => false,
                'age' => 42,
                'gender' => 'male',
            ],
            [
                'name' => 'Salma Lahlou',
                'email' => 'salma.lahlou@example.com',
                'password' => $password,
                'role' => 'patient',
                'phone' => '+212611889900',
                'city' => 'Rabat',
                'blood_type' => 'B+',
                'is_available' => false,
                'age' => 19,
                'gender' => 'female',
            ],
            [
                'name' => 'Omar Mansouri',
                'email' => 'omar.mansouri@example.com',
                'password' => $password,
                'role' => 'patient',
                'phone' => '+212622334455',
                'city' => 'Marrakech',
                'blood_type' => 'AB-',
                'is_available' => false,
                'age' => 60,
                'gender' => 'male',
            ],
            [
                'name' => 'Rachid Idrissi',
                'email' => 'rachid.idrissi@example.com',
                'password' => $password,
                'role' => 'patient',
                'phone' => '+212622667788',
                'city' => 'Fes',
                'blood_type' => 'A+',
                'is_available' => false,
                'age' => 27,
                'gender' => 'male',
            ],
            [
                'name' => 'Laila Benali',
                'email' => 'laila.benali@example.com',
                'password' => $password,
                'role' => 'donor',
                'phone' => '+212633123456',
                'city' => 'Oujda',
                'blood_type' => 'AB+',
                'is_available' => true,
                'age' => 29,
                'gender' => 'female',
                'last_donation_at' => null,
            ]
        ];

        foreach ($users as $user) {
            User::firstOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}
