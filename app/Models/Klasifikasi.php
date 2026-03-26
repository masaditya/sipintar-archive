<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Klasifikasi extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'klasifikasi';

    protected $fillable = [
        'name',
        'active_retention',
        'inactive_retention',
        'final_disposition',
        'access_rights',
        'security_classification',
        'status',
    ];
}
