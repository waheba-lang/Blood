<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request) {
        // Usually for admin, or finding donors
        $query = \App\Models\User::query();
        if($request->has('role')) {
            $query->where('role', $request->role);
        }
        if($request->has('blood_type')) {
            $query->where('blood_type', $request->blood_type);
        }
        if($request->has('city')) {
            $query->where('city', $request->city);
        }
        return response($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = \App\Models\User::withCount(['donations', 'donationRequests'])->findOrFail($id);
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = \App\Models\User::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$id,
            'role' => 'sometimes|in:donor,patient,admin',
            'phone' => 'nullable|string',
            'city' => 'nullable|string',
            'blood_type' => 'nullable|string|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'is_available' => 'sometimes|boolean',
        ]);

        $user->update($validated);
        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = \App\Models\User::findOrFail($id);
        
        if (auth()->id() == $id) {
            return response()->json(['message' => 'Cannot delete your own account'], 400);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
