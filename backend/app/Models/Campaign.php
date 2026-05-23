<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date',
        'time',
        'location',
        'description',
        'target',
        'current',
        'organizer_name',
        'city',
        'start_time',
        'end_time',
        'contact_info',
        'blood_types',
        'image_path',
        'status',
        'user_id',
        'approval_status',
    ];

    protected $casts = [
        'blood_types' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'campaign_participants')
                    ->withPivot('status')
                    ->withTimestamps();
    }
}
