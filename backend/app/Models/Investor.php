<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investor extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_name', 'investor_name', 'location', 'contact_number', 'email',
        'classification', 'last_interaction_date', 'current_status',
        'india_related_investments', 'comments', 'source_of_introduction',
        'next_steps', 'submitted_by', 'investment_thesis', 'preferred_sectors',
        'ticket_size', 'geography_preference', 'internal_notes',
    ];

    protected $casts = ['last_interaction_date' => 'date'];

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
