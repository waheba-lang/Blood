<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Donation;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        $totalUsers = User::count();
        $totalDonors = User::where('role', 'donor')->count();
        $totalDonations = Donation::count();

        $recentUsers = User::orderBy('created_at', 'desc')->limit(5)->get();
        $recentDonations = Donation::with('user')->orderBy('donation_date', 'desc')->limit(5)->get();

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'total_donors' => $totalDonors,
                'total_donations' => $totalDonations,
            ],
            'recent_activity' => [
                'users' => $recentUsers,
                'donations' => $recentDonations,
            ]
        ]);
    }
}
