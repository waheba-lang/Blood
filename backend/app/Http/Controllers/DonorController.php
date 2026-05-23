<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class DonorController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->where('role', 'donor')
            ->select(['id', 'name', 'email', 'blood_type', 'last_donation_at', 'is_available']);

        if ($request->filled('blood_type')) {
            $query->where('blood_type', $request->string('blood_type'));
        }

        return response()->json($query->orderBy('name')->get()->map(function (User $donor) {
            return [
                'id' => $donor->id,
                'name' => $donor->name,
                'email' => $donor->email,
                'blood_type' => $donor->blood_type,
                'last_donation_date' => $donor->last_donation_at?->toDateString(),
                'next_available_date' => $donor->next_eligible_date,
                'status' => $donor->is_eligible ? 'available' : 'not available',
            ];
        }));
    }
}
