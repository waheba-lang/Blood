<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\DonationRequest;
use App\Models\Donation;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        $totalUsers = User::count();
        $totalDonors = User::where('role', 'donor')->count();
        $totalPatients = User::where('role', 'patient')->count();
        $totalRequests = DonationRequest::count();
        $totalDonations = Donation::count();

        // Recent activity: last 5 users and last 5 requests
        $recentUsers = User::orderBy('created_at', 'desc')->limit(5)->get();
        $recentRequests = DonationRequest::with('user')->orderBy('created_at', 'desc')->limit(5)->get();

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'total_donors' => $totalDonors,
                'total_patients' => $totalPatients,
                'total_requests' => $totalRequests,
                'total_donations' => $totalDonations,
            ],
            'recent_activity' => [
                'users' => $recentUsers,
                'requests' => $recentRequests,
            ]
        ]);
    }
}
