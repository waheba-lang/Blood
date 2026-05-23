<?php

namespace App\Http\Controllers;

use App\Models\BloodStock;

class BloodStockController extends Controller
{
    public function index()
    {
        $types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

        foreach ($types as $type) {
            BloodStock::firstOrCreate(['blood_type' => $type], ['quantity' => 0]);
        }

        return response()->json(
            BloodStock::query()
                ->select(['blood_type', 'quantity', 'updated_at'])
                ->orderBy('blood_type')
                ->get()
        );
    }
}
