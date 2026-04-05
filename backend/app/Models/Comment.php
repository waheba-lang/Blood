<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['user_id', 'donation_request_id', 'body'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function donationRequest() {
        return $this->belongsTo(DonationRequest::class);
    }
}
