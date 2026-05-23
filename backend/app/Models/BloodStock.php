<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BloodStock extends Model
{
    protected $table = 'blood_stock';

    protected $fillable = [
        'blood_type',
        'quantity',
    ];
}
