<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\User;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    /** @var list<string> */
    public const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    /**
     * Public stats: donations aggregated by month and donor blood type (units = sum of quantity).
     */
    public function donations(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $year = (int) $request->query('year', now()->year);
        if ($year < 2000 || $year > 2100) {
            $year = (int) now()->year;
        }

        $rows = Donation::query()
            ->join('users', 'users.id', '=', 'donations.user_id')
            ->whereYear('donations.donation_date', $year)
            ->get([
                'donations.donation_date',
                'donations.quantity',
                'users.blood_type as blood_type',
            ]);

        $matrix = [];
        foreach (range(1, 12) as $m) {
            $matrix[$m] = array_fill_keys(self::BLOOD_TYPES, 0);
        }

        foreach ($rows as $row) {
            $m = (int) \Carbon\Carbon::parse($row->donation_date)->month;
            $bt = $row->blood_type;
            if (! isset($matrix[$m][$bt])) {
                continue;
            }
            $matrix[$m][$bt] += (int) $row->quantity;
        }

        $totalsByMonth = [];
        foreach (range(1, 12) as $m) {
            $totalsByMonth[$m] = array_sum($matrix[$m]);
        }

        $totalsByType = array_fill_keys(self::BLOOD_TYPES, 0);
        foreach (range(1, 12) as $m) {
            foreach (self::BLOOD_TYPES as $bt) {
                $totalsByType[$bt] += $matrix[$m][$bt];
            }
        }

        $monthly = [];
        foreach (range(1, 12) as $m) {
            $monthly[] = [
                'month' => $m,
                'by_type' => $matrix[$m],
                'total' => $totalsByMonth[$m],
            ];
        }

        $totalDonors = User::where('role', 'donor')->count();
        $availableDonors = User::where('role', 'donor')->get()->filter->is_eligible->count();

        return response()->json([
            'year' => $year,
            'blood_types' => self::BLOOD_TYPES,
            'monthly' => $monthly,
            'totals_by_month' => $totalsByMonth,
            'totals_by_type' => $totalsByType,
            'grand_total_units' => array_sum($totalsByMonth),
            'total_users' => User::count(),
            'total_donors' => $totalDonors,
            'available_donors' => $availableDonors,
            'donation_records_count' => Donation::whereYear('donation_date', $year)->count(),
        ]);
    }
}
