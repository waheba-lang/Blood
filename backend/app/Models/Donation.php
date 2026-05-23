<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = [
        'user_id',
        'donation_date',
        'quantity',
        'status',
        'hospital',
        'recipient_name',
        'certificate_id',
    ];

    protected $casts = [
        'donation_date' => 'date',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
