<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Donation;

echo "Starting debug...\n";

try {
    $start = microtime(true);
    $totalUsers = User::count();
    echo "Total Users: $totalUsers\n";

    $availableDonors = User::where('is_available', true)->count();
    echo "Available Donors: $availableDonors\n";

    $totalDonations = Donation::count();
    echo "Total Donations: $totalDonations\n";

    $monthlyDonations = [];
    for ($m = 1; $m <= 12; $m++) {
        $monthlyDonations[] = Donation::whereYear('created_at', date('Y'))
            ->whereMonth('created_at', $m)
            ->count();
    }
    echo "Monthly Donations calculated.\n";

    $end = microtime(true);
    echo "Execution Time: " . ($end - $start) . " seconds\n";

    echo json_encode([
        'totalUsers' => $totalUsers,
        'availableDonors' => $availableDonors,
        'totalDonations' => $totalDonations,
        'monthlyDonations' => $monthlyDonations,
        'unavailableDonors' => $totalUsers - $availableDonors
    ]);
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
