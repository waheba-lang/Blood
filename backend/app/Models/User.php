<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, \Laravel\Sanctum\HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name', 'email', 'password', 'role', 'phone', 'city', 'blood_type', 'is_available',
        'age', 'gender', 'profile_photo_path', 'last_donation_at', 'availability_notified_at'
    ];

    protected $appends = ['is_eligible', 'next_eligible_date', 'last_donation_date', 'availability_status', 'avatar_url'];

    public function getIsEligibleAttribute() {
        if (!$this->last_donation_at) return true;
        return \Carbon\Carbon::parse($this->last_donation_at)->addMonths(3)->isPast();
    }

    public function getNextEligibleDateAttribute() {
        if (!$this->last_donation_at) return now()->toDateString();
        return \Carbon\Carbon::parse($this->last_donation_at)->addMonths(3)->toDateString();
    }

    public function getLastDonationDateAttribute() {
        return $this->last_donation_at;
    }

    public function getAvailabilityStatusAttribute() {
        return $this->is_eligible ? 'available' : 'not available';
    }

    public function getAvatarUrlAttribute()
    {
        if ($this->profile_photo_path) {
            if (str_starts_with($this->profile_photo_path, 'defaults/')) {
                return url($this->profile_photo_path);
            }
            return url('storage/' . $this->profile_photo_path);
        }

        return url('defaults/avatars/avatar1.png');
    }

    public function donations() {
        return $this->hasMany(Donation::class);
    }

    public function createdCampaigns() {
        return $this->hasMany(Campaign::class, 'user_id');
    }

    public function joinedCampaigns()
    {
        return $this->belongsToMany(Campaign::class, 'campaign_participants')
                    ->withPivot('status')
                    ->withTimestamps();
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_donation_at' => 'date',
            'availability_notified_at' => 'datetime',
            'is_available' => 'boolean',
        ];
    }
}
