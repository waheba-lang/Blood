<?php

namespace App\Http\Controllers;

use App\Models\BloodStock;
use App\Models\Donation;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $stock = BloodStock::query()->select(['blood_type', 'quantity'])->orderBy('blood_type')->get();
        $totalDonors = User::where('role', 'donor')->count();
        $availableDonors = User::where('role', 'donor')->get()->filter->is_eligible->count();

        return response()->json([
            'total_donors' => $totalDonors,
            'available_donors' => $availableDonors,
            'not_available_donors' => max(0, $totalDonors - $availableDonors),
            'total_donations' => Donation::count(),
            'total_stock_units' => (int) $stock->sum('quantity'),
            'low_stock_alerts' => $stock->where('quantity', '<', 10)->values(),
            'blood_stock' => $stock->values(),
        ]);
    }
}
