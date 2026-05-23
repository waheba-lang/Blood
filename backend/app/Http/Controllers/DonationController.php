<?php

namespace App\Http\Controllers;

use App\Models\BloodStock;
use App\Models\Donation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DonationController extends Controller
{
    public function index(Request $request)
    {
        $query = Donation::with('user')->latest('donation_date');

        if ($request->user()->role === 'donor') {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'nullable|date',
            'quantity' => 'required|integer|min:1|max:5',
        ]);

        $donor = $request->user();
        $donationDate = $validated['date'] ?? now()->toDateString();

        if ($donor->last_donation_at && now()->lt($donor->last_donation_at->copy()->addMonths(3))) {
            return response()->json([
                'message' => 'Donor is not available yet.',
                'next_available_date' => $donor->last_donation_at->copy()->addMonths(3)->toDateString(),
                'status' => 'not available',
            ], 422);
        }

        $result = DB::transaction(function () use ($donor, $donationDate, $validated) {
            $donation = Donation::create([
                'user_id' => $donor->id,
                'donation_date' => $donationDate,
                'quantity' => $validated['quantity'],
                'status' => 'Confirmed',
                'hospital' => null,
            ]);

            $donor->update([
                'last_donation_at' => $donationDate,
                'is_available' => false,
                'availability_notified_at' => null,
            ]);

            $stock = BloodStock::firstOrCreate(
                ['blood_type' => $donor->blood_type],
                ['quantity' => 0]
            );
            $stock->increment('quantity', $validated['quantity']);

            return [$donation, $stock->fresh()];
        });

        [$donation, $stock] = $result;

        return response()->json([
            'message' => 'Donation saved and blood stock updated.',
            'donation' => $donation->load('user'),
            'blood_stock' => $stock,
            'next_available_date' => Carbon::parse($donationDate)->addMonths(3)->toDateString(),
            'status' => 'not available',
        ], 201);
    }
}
