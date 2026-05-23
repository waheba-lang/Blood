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

        User::updateOrCreate(
            ['email' => 'admin@bloodconnect.com'],
            [
                'name' => 'Admin Super',
                'password' => $password,
                'role' => 'admin',
                'city' => 'Oujda',
                'blood_type' => 'O+',
                'is_available' => true,
            ]
        );

        $donorSpecs = [
            ['name' => 'Amine Benali', 'email' => 'amine.demo@blood.test', 'blood_type' => 'O+', 'city' => 'Oujda', 'phone' => '+212600111001'],
            ['name' => 'Kawtar El Fassi', 'email' => 'kawtar.demo@blood.test', 'blood_type' => 'A-', 'city' => 'Nador', 'phone' => '+212600111002'],
            ['name' => 'Driss Berrada', 'email' => 'driss.demo@blood.test', 'blood_type' => 'AB+', 'city' => 'Berkane', 'phone' => '+212600111003'],
            ['name' => 'Sanae Amrani', 'email' => 'sanae.demo@blood.test', 'blood_type' => 'B+', 'city' => 'Oujda', 'phone' => '+212600111004'],
            ['name' => 'Youssef Tazi', 'email' => 'youssef.demo@blood.test', 'blood_type' => 'O-', 'city' => 'Taourirt', 'phone' => '+212600111005'],
            ['name' => 'Nadia Cherkaoui', 'email' => 'nadia.demo@blood.test', 'blood_type' => 'A+', 'city' => 'Oujda', 'phone' => '+212600111006'],
            ['name' => 'Mehdi Ouazzani', 'email' => 'mehdi.demo@blood.test', 'blood_type' => 'B-', 'city' => 'Jerada', 'phone' => '+212600111007'],
            ['name' => 'Imane Filali', 'email' => 'imane.demo@blood.test', 'blood_type' => 'AB-', 'city' => 'Figuig', 'phone' => '+212600111008'],
            ['name' => 'Omar Lahlou', 'email' => 'omar.demo@blood.test', 'blood_type' => 'O+', 'city' => 'Oujda', 'phone' => '+212600111009'],
            ['name' => 'Hajar Mesbahi', 'email' => 'hajar.demo@blood.test', 'blood_type' => 'A-', 'city' => 'Saïdia', 'phone' => '+212600111010'],
        ];

        $donors = [];
        foreach ($donorSpecs as $spec) {
            $donors[] = User::updateOrCreate(
                ['email' => $spec['email']],
                [
                    'name' => $spec['name'],
                    'password' => $password,
                    'role' => 'donor',
                    'phone' => $spec['phone'],
                    'city' => $spec['city'],
                    'blood_type' => $spec['blood_type'],
                    'is_available' => true,
                    'age' => random_int(22, 55),
                    'gender' => random_int(0, 1) ? 'Male' : 'Female',
                    'last_donation_at' => null,
                    'availability_notified_at' => null,
                ]
            );
        }

        $byEmail = collect($donors)->keyBy('email');

        $donationRows = [
            ['email' => 'amine.demo@blood.test', 'date' => Carbon::now()->subMonths(5), 'qty' => 1],
            ['email' => 'amine.demo@blood.test', 'date' => Carbon::now()->subDays(120), 'qty' => 1],
            ['email' => 'kawtar.demo@blood.test', 'date' => Carbon::now()->subMonths(4), 'qty' => 2],
            ['email' => 'driss.demo@blood.test', 'date' => Carbon::now()->subDays(200), 'qty' => 1],
            ['email' => 'sanae.demo@blood.test', 'date' => Carbon::now()->subDays(15), 'qty' => 1],
            ['email' => 'youssef.demo@blood.test', 'date' => Carbon::now()->subMonths(6), 'qty' => 2],
            ['email' => 'nadia.demo@blood.test', 'date' => Carbon::now()->subDays(95), 'qty' => 1],
            ['email' => 'mehdi.demo@blood.test', 'date' => Carbon::now()->subDays(30), 'qty' => 1],
            ['email' => 'imane.demo@blood.test', 'date' => Carbon::now()->subMonths(8), 'qty' => 1],
            ['email' => 'omar.demo@blood.test', 'date' => Carbon::now()->subDays(400), 'qty' => 2],
            ['email' => 'omar.demo@blood.test', 'date' => Carbon::now()->subDays(200), 'qty' => 1],
            ['email' => 'hajar.demo@blood.test', 'date' => Carbon::now()->subDays(100), 'qty' => 1],
        ];

        foreach ($donationRows as $row) {
            $user = $byEmail[$row['email']];
            Donation::create([
                'user_id' => $user->id,
                'donation_date' => $row['date']->toDateString(),
                'quantity' => $row['qty'],
                'status' => 'Confirmed',
                'hospital' => null,
            ]);

            $stock = BloodStock::firstOrCreate(
                ['blood_type' => $user->blood_type],
                ['quantity' => 0]
            );
            $stock->increment('quantity', $row['qty']);
        }

        foreach ($byEmail as $user) {
            $latest = Donation::where('user_id', $user->id)->max('donation_date');
            if ($latest) {
                $latestCarbon = Carbon::parse($latest);
                $eligible = $latestCarbon->copy()->addDays(90)->isPast();
                $user->update([
                    'last_donation_at' => $latestCarbon->toDateString(),
                    'is_available' => $eligible,
                ]);
            }
        }

        $this->command?->info('Blood management demo: '.count($donors).' donors, '.count($donationRows).' donations. Login: amine.demo@blood.test / '.self::DEMO_PASSWORD);
    }
}
