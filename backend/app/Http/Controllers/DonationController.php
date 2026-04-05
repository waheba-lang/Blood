<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Donation;

class DonationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        // Return donations for the logged in user
        return response(Donation::with('donationRequest')->where('user_id', $request->user()->id)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'donation_request_id' => 'required|exists:donation_requests,id',
            'hospital' => 'nullable|string',
            'donation_date' => 'nullable|date',
        ]);

        $donationRequest = \App\Models\DonationRequest::findOrFail($validated['donation_request_id']);

        $donation = $request->user()->donations()->create([
            'donation_request_id' => $validated['donation_request_id'],
            'hospital' => $validated['hospital'] ?? null,
            'donation_date' => $validated['donation_date'] ?? null,
            'status' => 'Pending',
        ]);

        // Create notification for the requester
        \App\Models\Notification::create([
            'user_id' => $donationRequest->user_id,
            'type' => 'donation_response',
            'message' => "{$request->user()->name} a proposé de faire un don pour votre demande ({$donationRequest->blood_type}).",
            'is_read' => false,
            'data' => [
                'donor_id' => $request->user()->id,
                'donor_name' => $request->user()->name,
                'donor_email' => $request->user()->email,
                'donor_phone' => $request->user()->phone,
            ],
        ]);

        return response()->json($donation, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
