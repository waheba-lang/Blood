<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $campaigns = Campaign::withCount('participants')
            ->where('approval_status', 'approved')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($campaigns);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'nullable|string',
            'location' => 'required|string',
            'description' => 'required|string',
            'target' => 'required|integer',
            'organizer_name' => 'nullable|string',
            'city' => 'nullable|string',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'contact_info' => 'nullable|string',
            'blood_types' => 'nullable|array',
            'image_path' => 'nullable|string',
            'status' => 'nullable|in:upcoming,ongoing,completed',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['approval_status'] = 'pending';

        $campaign = Campaign::create($validated);
        return response()->json($campaign, 201);
    }

    public function update(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $campaign = Campaign::findOrFail($id);
        $campaign->update($request->all());
        return response()->json($campaign);
    }

    public function destroy(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $campaign = Campaign::findOrFail($id);
        $campaign->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function join(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'donor') {
            return response()->json(['message' => 'Only donors can join campaigns'], 403);
        }

        if ($user->last_donation_at && now()->lt(Carbon::parse($user->last_donation_at)->addMonths(3))) {
            return response()->json([
                'message' => 'Not eligible to donate yet',
                'next_available_date' => Carbon::parse($user->last_donation_at)->addMonths(3)->toDateString()
            ], 422);
        }

        $campaign = Campaign::findOrFail($id);
        if ($campaign->approval_status !== 'approved') {
            return response()->json(['message' => 'Campaign is not approved yet'], 400);
        }

        $user->joinedCampaigns()->syncWithoutDetaching([$id => ['status' => 'registered']]);
        $campaign->increment('current');
        
        return response()->json(['message' => 'Joined successfully']);
    }

    public function leave(Request $request, $id)
    {
        $user = $request->user();
        $campaign = Campaign::findOrFail($id);
        
        if ($user->joinedCampaigns()->where('campaign_id', $id)->exists()) {
            $user->joinedCampaigns()->detach($id);
            if ($campaign->current > 0) {
                $campaign->decrement('current');
            }
        }
        
        return response()->json(['message' => 'Left successfully']);
    }

    public function participants(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $campaign = Campaign::findOrFail($id);
        return response()->json($campaign->participants);
    }

    // --- Admin Endpoints ---

    public function adminIndex(Request $request)
    {
        if (!in_array($request->user()->role, ['admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $campaigns = Campaign::with('user')->orderByRaw("CASE WHEN approval_status = 'pending' THEN 1 ELSE 2 END")
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($campaigns);
    }

    public function updateStatus(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'approval_status' => 'required|in:approved,rejected'
        ]);

        $campaign = Campaign::findOrFail($id);
        $campaign->approval_status = $validated['approval_status'];
        $campaign->save();

        return response()->json(['message' => 'Status updated successfully', 'campaign' => $campaign]);
    }
}
