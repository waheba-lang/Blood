<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonationRequest extends Model
{
    protected $fillable = [
        'user_id', 'patient_name', 'blood_type', 'quantity', 'urgency', 'hospital', 'city', 'contact_note', 'status'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function donations() {
        return $this->hasMany(Donation::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }
}
