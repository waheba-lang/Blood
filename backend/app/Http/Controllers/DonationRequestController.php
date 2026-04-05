<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DonationRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        $query = \App\Models\DonationRequest::with('user');
        
        if($request->has('blood_type')) {
            $query->where('blood_type', $request->blood_type);
        }
        if($request->has('city')) {
            $query->where('city', $request->city);
        }
        if($request->has('urgency')) {
            $query->where('urgency', $request->urgency);
        }

        return response($query->orderBy('created_at', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_name' => 'required|string',
            'blood_type' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'urgency' => 'required|string',
            'hospital' => 'required|string',
            'city' => 'required|string',
            'contact_note' => 'nullable|string',
        ]);

        $donationRequest = $request->user()->donationRequests()->create($validated);

        return response()->json($donationRequest, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $donationRequest = \App\Models\DonationRequest::with('user')->findOrFail($id);
        return response()->json($donationRequest);
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
        $donationRequest = \App\Models\DonationRequest::findOrFail($id);
        $donationRequest->delete();

        return response()->json(['message' => 'Donation request deleted successfully']);
    }
}
