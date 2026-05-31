<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TalentResource extends Model
{
    use HasFactory;
    protected $table = 'talent_resources';
    protected $fillable = [
        'individual_name', 'interaction_date', 'source_of_introduction',
        'previous_organization', 'current_organization', 'designation',
        'contact_number', 'email', 'submitted_by', 'notes',
    ];
    protected $casts = ['interaction_date' => 'date'];
}
