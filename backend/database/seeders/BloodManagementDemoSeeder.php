<?php

namespace Database\Seeders;

use App\Models\BloodStock;
use App\Models\Donation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BloodManagementDemoSeeder extends Seeder
{
    /** Default password for all demo accounts */
    public const DEMO_PASSWORD = 'password123';

    public function run(): void
    {
        $password = Hash::make(self::DEMO_PASSWORD);

        BloodStock::query()->update(['quantity' => 0]);
        Donation::query()->delete();

        // Create standard demo donors if they don't exist
        $donorSpecs = [
            ['name' => 'Amine Benali', 'email' => 'amine.demo@blood.test', 'blood_type' => 'O+', 'city' => 'Oujda', 'phone' => '+212600111001', 'gender' => 'Male', 'age' => 28],
            ['name' => 'Kawtar El Fassi', 'email' => 'kawtar.demo@blood.test', 'blood_type' => 'A-', 'city' => 'Nador', 'phone' => '+212600111002', 'gender' => 'Female', 'age' => 25],
            ['name' => 'Driss Berrada', 'email' => 'driss.demo@blood.test', 'blood_type' => 'AB+', 'city' => 'Berkane', 'phone' => '+212600111003', 'gender' => 'Male', 'age' => 38],
            ['name' => 'Sanae Amrani', 'email' => 'sanae.demo@blood.test', 'blood_type' => 'B+', 'city' => 'Oujda', 'phone' => '+212600111004', 'gender' => 'Female', 'age' => 30],
            ['name' => 'Youssef Tazi', 'email' => 'youssef.demo@blood.test', 'blood_type' => 'O-', 'city' => 'Taourirt', 'phone' => '+212600111005', 'gender' => 'Male', 'age' => 45],
            ['name' => 'Nadia Cherkaoui', 'email' => 'nadia.demo@blood.test', 'blood_type' => 'A+', 'city' => 'Oujda', 'phone' => '+212600111006', 'gender' => 'Female', 'age' => 32],
            ['name' => 'Mehdi Ouazzani', 'email' => 'mehdi.demo@blood.test', 'blood_type' => 'B-', 'city' => 'Jerada', 'phone' => '+212600111007', 'gender' => 'Male', 'age' => 27],
            ['name' => 'Imane Filali', 'email' => 'imane.demo@blood.test', 'blood_type' => 'AB-', 'city' => 'Figuig', 'phone' => '+212600111008', 'gender' => 'Female', 'age' => 31],
            ['name' => 'Omar Lahlou', 'email' => 'omar.demo@blood.test', 'blood_type' => 'O+', 'city' => 'Oujda', 'phone' => '+212600111009', 'gender' => 'Male', 'age' => 40],
            ['name' => 'Hajar Mesbahi', 'email' => 'hajar.demo@blood.test', 'blood_type' => 'A-', 'city' => 'Saïdia', 'phone' => '+212600111010', 'gender' => 'Female', 'age' => 23],
        ];

        foreach ($donorSpecs as $spec) {
            User::updateOrCreate(
                ['email' => $spec['email']],
                [
                    'name' => $spec['name'],
                    'password' => $password,
                    'role' => 'donor',
                    'phone' => $spec['phone'],
                    'city' => $spec['city'],
                    'blood_type' => $spec['blood_type'],
                    'is_available' => true,
                    'age' => $spec['age'],
                    'gender' => $spec['gender'],
                    'profile_photo_path' => 'defaults/avatars/avatar' . random_int(1, 7) . '.png',
                    'last_donation_at' => null,
                    'availability_notified_at' => null,
                ]
            );
        }

        // Query all seeded donors (from MoroccanUsersSeeder + local)
        $donors = User::where('role', 'donor')->get();
        $currentYear = Carbon::now()->year;

        $hospitals = [
            'Casablanca' => ['CHU Ibn Rochd', 'Hôpital Cheikh Khalifa', 'Hôpital Provincial de Casablanca'],
            'Rabat' => ['CHU Ibn Sina', 'Hôpital Militaire d\'Instruction Mohammed V', 'Hôpital Provincial'],
            'Oujda' => ['CHU Mohammed VI', 'Hôpital Al Farabi', 'Hôpital Militaire Oujda'],
            'Marrakech' => ['CHU Mohammed VI Marrakech', 'Hôpital Ibn Tofail', 'Hôpital Avicenne'],
            'Fes' => ['CHU Hassan II Fes', 'Hôpital Al Ghassani', 'Hôpital Ibn Al Khatib'],
            'Tangier' => ['CHU Tangier-Tetouan', 'Hôpital Duc de Tovar', 'Hôpital Mohammed V'],
            'Agadir' => ['Hôpital Régional Hassan II', 'Hôpital Provincial Agadir'],
            'Nador' => ['Hôpital Hassani Nador'],
            'Berkane' => ['Hôpital Provincial Berkane'],
            'Taourirt' => ['Hôpital Provincial Taourirt'],
            'Meknes' => ['Hôpital Mohamed V Meknes', 'Hôpital Provincial'],
            'Kenitra' => ['Hôpital Al Idrissi Kenitra'],
        ];

        $statuses = ['Confirmed', 'Confirmed', 'Confirmed', 'Confirmed', 'Confirmed', 'Pending', 'Cancelled'];

        // Generate historic donations for 2026 (or current year) month-by-month
        foreach (range(1, 12) as $month) {
            // Number of donations per month
            $donationCount = ($month <= Carbon::now()->month) ? random_int(4, 7) : random_int(0, 1);
            
            for ($k = 0; $k < $donationCount; $k++) {
                $donor = $donors->random();
                $city = $donor->city ?? 'Oujda';
                $hospitalList = $hospitals[$city] ?? ['CHU Mohammed VI', 'Hôpital Régional'];
                $hospital = $hospitalList[array_rand($hospitalList)];
                $qty = random_int(1, 2);
                $status = ($month < Carbon::now()->month) ? 'Confirmed' : $statuses[array_rand($statuses)];
                
                // Let's create a certificate ID if confirmed
                $certId = ($status === 'Confirmed') ? 'CERT-' . $currentYear . '-' . sprintf('%02d', $month) . '-' . random_int(1000, 9999) : null;
                
                // Random date in that month
                $day = random_int(1, 28);
                $date = Carbon::create($currentYear, $month, $day);

                // If date is in the future, don't write it or make it pending/upcoming
                if ($date->isFuture()) {
                    continue;
                }

                Donation::create([
                    'user_id' => $donor->id,
                    'donation_date' => $date->toDateString(),
                    'quantity' => $qty,
                    'status' => $status,
                    'hospital' => $hospital,
                    'recipient_name' => random_int(0, 1) ? 'Patient ' . random_int(10, 99) : null,
                    'certificate_id' => $certId,
                ]);
            }
        }

        // Set eligibility and last_donation_at on users
        foreach ($donors as $user) {
            $latest = Donation::where('user_id', $user->id)
                ->where('status', 'Confirmed')
                ->orderBy('donation_date', 'desc')
                ->first();

            if ($latest) {
                $latestDate = Carbon::parse($latest->donation_date);
                $eligible = $latestDate->copy()->addMonths(3)->isPast();
                $user->update([
                    'last_donation_at' => $latestDate->toDateString(),
                    'is_available' => $eligible,
                ]);
            } else {
                $user->update([
                    'last_donation_at' => null,
                    'is_available' => true,
                ]);
            }
        }

        // Populate realistic blood stock table
        // Healthy stock for positive types, critical for negative types to trigger alerts
        $bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        foreach ($bloodTypes as $bt) {
            $qty = match ($bt) {
                'O+' => 42,
                'A+' => 35,
                'B+' => 22,
                'AB+' => 14,
                'O-' => 4,    // Trigger alert
                'A-' => 7,    // Trigger alert
                'B-' => 5,    // Trigger alert
                'AB-' => 3,   // Trigger alert
            };

            BloodStock::updateOrCreate(
                ['blood_type' => $bt],
                ['quantity' => $qty]
            );
        }
    }
}
