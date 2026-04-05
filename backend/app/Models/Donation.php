<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = [
        'user_id', 'donation_request_id', 'hospital', 'donation_date', 'status'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function donationRequest() {
        return $this->belongsTo(DonationRequest::class);
    }
}
