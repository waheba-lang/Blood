<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function index()
    {
        return response()->json(Campaign::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|string',
            'time' => 'required|string',
            'location' => 'required|string',
            'description' => 'required|string',
            'target' => 'required|integer',
            'current' => 'nullable|integer',
        ]);

        $campaign = Campaign::create($validated);
        return response()->json($campaign, 201);
    }
}
