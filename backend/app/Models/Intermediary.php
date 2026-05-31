<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Intermediary extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'interaction_date', 'source_of_introduction',
        'previous_organization', 'current_organization', 'designation',
        'contact_number', 'email', 'submitted_by', 'notes',
    ];
    protected $casts = ['interaction_date' => 'date'];
}
