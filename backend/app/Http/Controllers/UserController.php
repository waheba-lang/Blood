<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request) {
        $query = \App\Models\User::query();
        
        if($request->has('role')) {
            $query->where('role', $request->role);
        } else {
            // Default to donors if role not specified in a "Find Donors" context
            // But if the user is an admin, let them see everyone
            if (!auth('sanctum')->check() || auth('sanctum')->user()->role !== 'admin') {
                $query->where('role', 'donor');
            }
        }

        if($request->has('blood_type')) {
            $query->where('blood_type', $request->blood_type);
        }
        
        if($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if($request->has('is_available')) {
            $query->where('is_available', $request->boolean('is_available'));
        }

        return response($query->select(['id', 'name', 'city', 'blood_type', 'phone', 'gender', 'is_available', 'profile_photo_path'])->get());
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
        $user = \App\Models\User::with(['donations' => function($q) {
            $q->orderBy('donation_date', 'desc');
        }])->withCount(['donations'])->findOrFail($id);
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
            'role' => 'sometimes|in:donor,admin',
            'phone' => 'nullable|string',
            'city' => 'nullable|string',
            'blood_type' => 'nullable|string|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'is_available' => 'sometimes|boolean',
            'age' => 'nullable|integer|min:18|max:100',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'avatar_type' => 'nullable|string',
        ]);

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $validated['profile_photo_path'] = $path;
        } elseif ($request->filled('avatar_type')) {
            $validated['profile_photo_path'] = $request->avatar_type;
        }

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
