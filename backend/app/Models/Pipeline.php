<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pipeline extends Model
{
    use HasFactory;
    protected $fillable = [
        'company_name', 'meeting_date', 'source_name', 'company_location',
        'submitted_by', 'remarks', 'status', 'next_followup_date', 'priority',
    ];
    protected $casts = ['meeting_date' => 'date', 'next_followup_date' => 'date'];
}
