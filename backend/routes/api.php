<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\DonorController;
use App\Http\Controllers\BloodStockController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/chatbot', [\App\Http\Controllers\ChatbotController::class, 'handle']);

Route::get('/donors', [DonorController::class, 'index']);
Route::get('/blood-stock', [BloodStockController::class, 'index']);
Route::get('/campaigns', [CampaignController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Core Blood Management APIs
    Route::get('/donations', [DonationController::class, 'index']);
    Route::post('/donations', [DonationController::class, 'store']);

    // Campaigns APIs
    Route::post('/campaigns', [CampaignController::class, 'store']);
    Route::put('/campaigns/{id}', [CampaignController::class, 'update']);
    Route::delete('/campaigns/{id}', [CampaignController::class, 'destroy']);
    Route::post('/campaigns/{id}/join', [CampaignController::class, 'join']);
    Route::post('/campaigns/{id}/leave', [CampaignController::class, 'leave']);
    Route::get('/campaigns/{id}/participants', [CampaignController::class, 'participants']);
    
    // Admin Campaign APIs
    Route::get('/admin/campaigns', [CampaignController::class, 'adminIndex']);
    Route::patch('/campaigns/{id}/status', [CampaignController::class, 'updateStatus']);
    
    // Admin Stats & Users APIs
    Route::get('/admin/stats', [AdminDashboardController::class, 'stats']);
    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
    
    // Moved Admin Statistics & Dashboard APIs
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/stats/donations', [StatisticsController::class, 'donations']);
});
