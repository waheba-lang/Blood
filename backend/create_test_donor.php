<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Donation;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

$user = User::where('email', 'testdonor@example.com')->first();
if ($user) {
    $user->donations()->delete();
    $user->delete();
}

$lastDonationDate = Carbon::now()->subMonths(1);

$user = User::create([
    'name' => 'Test Donor',
    'email' => 'testdonor@example.com',
    'password' => Hash::make('Test1234!'),
    'role' => 'donor',
    'blood_type' => 'O+',
    'city' => 'Casablanca',
    'phone' => '0600000000',
    'is_available' => true,
    'last_donation_at' => $lastDonationDate,
]);

$donationsData = [
    [
        'hospital' => 'Hôpital Ibn Rochd',
        'donation_date' => Carbon::now()->subMonths(13),
        'status' => 'confirmed',
        'certificate_id' => 'BC-' . strtoupper(Str::random(8)),
    ],
    [
        'hospital' => 'Centre de Transfusion Sanguine',
        'donation_date' => Carbon::now()->subMonths(9),
        'status' => 'confirmed',
        'certificate_id' => 'BC-' . strtoupper(Str::random(8)),
    ],
    [
        'hospital' => 'Hôpital Cheikh Khalifa',
        'donation_date' => Carbon::now()->subMonths(5),
        'status' => 'confirmed',
        'certificate_id' => 'BC-' . strtoupper(Str::random(8)),
    ],
    [
        'hospital' => 'Clinique De Vinci',
        'donation_date' => clone $lastDonationDate,
        'status' => 'confirmed',
        'certificate_id' => 'BC-' . strtoupper(Str::random(8)),
    ],
];

foreach ($donationsData as $data) {
    $user->donations()->create($data);
}

echo "Demo account created successfully.";
