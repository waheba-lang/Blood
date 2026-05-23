<?php

namespace App\Http\Controllers;

use App\Mail\RegistrationConfirmationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function register(Request $request) {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed|min:8',
            'role' => 'required|in:donor,patient,admin,organizer',
            'phone' => 'nullable|string',
            'city' => 'nullable|string',
            'blood_type' => 'nullable|string|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'is_available' => 'boolean',
            'age' => 'nullable|integer|min:18|max:100',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'avatar_type' => 'nullable|string',
        ]);

        $profilePhotoPath = null;
        if ($request->hasFile('profile_photo')) {
            $profilePhotoPath = $request->file('profile_photo')->store('profile_photos', 'public');
        } elseif ($request->filled('avatar_type')) {
            $profilePhotoPath = $request->avatar_type;
        }

        $user = \App\Models\User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
            'role' => $fields['role'],
            'phone' => $fields['phone'] ?? null,
            'city' => $fields['city'] ?? null,
            'blood_type' => $fields['blood_type'] ?? null,
            'is_available' => $fields['is_available'] ?? true,
            'age' => $fields['age'] ?? null,
            'gender' => $fields['gender'] ?? null,
            'profile_photo_path' => $profilePhotoPath,
        ]);

        try {
            Mail::to($user->email)->send(new RegistrationConfirmationMail($user));
        } catch (\Throwable $exception) {
            Log::warning('Registration confirmation email could not be sent.', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $exception->getMessage(),
            ]);
        }

        $token = $user->createToken('myapptoken')->plainTextToken;

        return response(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request) {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = \App\Models\User::where('email', $fields['email'])->first();

        if(!$user) {
            return response([
                'message' => 'User not found! Your php artisan serve is looking in the database named: \'' . env('DB_DATABASE') . '\'. Please check your phpMyAdmin to ensure the user exists there.'
            ], 401);
        }

        if(!\Illuminate\Support\Facades\Hash::check($fields['password'], $user->password)) {
            return response(['message' => 'Invalid Password! The user exists in the database, but the password doesn\'t match.'], 401);
        }

        $token = $user->createToken('myapptoken')->plainTextToken;

        return response(['user' => $user, 'token' => $token], 200);
    }

    public function logout(Request $request) {
        $request->user()->tokens()->delete();
        return response(['message' => 'Logged out'], 200);
    }

    public function user(Request $request) {
        $user = $request->user()->load(['donations', 'joinedCampaigns', 'createdCampaigns']);
        return response(['user' => $user], 200);
    }
}
