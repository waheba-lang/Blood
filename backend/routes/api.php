<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationRequestController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CampaignController;
use App\Models\User;
use App\Models\DonationRequest;
use App\Models\Donation;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public routes for requests and users
Route::get('/requests', [DonationRequestController::class, 'index']);
Route::get('/requests/{id}', [DonationRequestController::class, 'show']); // public view
Route::get('/users/{id}', [UserController::class, 'show']); // public profile
Route::get('/requests/{id}/comments', [\App\Http\Controllers\CommentController::class, 'index']); // public comments
Route::get('/campaigns', [CampaignController::class, 'index']); // public campaigns

Route::get('/stats/public', function () {
    return response()->json([
        'totalDonors' => User::count(),
        'totalRequests' => DonationRequest::count(),
        'fulfilledRequests' => DonationRequest::where('status', 'fulfilled')->count(),
        'totalDonations' => Donation::count()
    ]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Donation requests (Create, Update, Delete)
    Route::post('/requests', [DonationRequestController::class, 'store']);
    Route::put('/requests/{id}', [DonationRequestController::class, 'update']);
    Route::delete('/requests/{id}', [DonationRequestController::class, 'destroy']);

    // Comments (Create)
    Route::post('/requests/{id}/comments', [\App\Http\Controllers\CommentController::class, 'store']);

    // Donations
    Route::get('/donations', [DonationController::class, 'index']);
    Route::post('/donations', [DonationController::class, 'store']);
    Route::put('/donations/{id}', [DonationController::class, 'update']);

    // User specific requests
    Route::get('/my-requests', function (Request $request) {
        return $request->user()->donationRequests()->orderBy('created_at', 'desc')->get();
    });

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::put('/notifications/{id}', [\App\Http\Controllers\NotificationController::class, 'update']);
    Route::delete('/notifications/{id}', [\App\Http\Controllers\NotificationController::class, 'destroy']);

    // Users (profile update)
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}', [UserController::class, 'update']);

    // Admin specific routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/stats', [\App\Http\Controllers\AdminDashboardController::class, 'stats']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::delete('/requests/{id}', [DonationRequestController::class, 'destroy']);
        Route::post('/campaigns', [CampaignController::class, 'store']);
    });
});

