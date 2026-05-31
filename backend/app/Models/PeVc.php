<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeVc extends Model
{
    use HasFactory;
    protected $table = 'pe_vcs';
    protected $fillable = [
        'organization_name', 'met_date', 'person_met', 'stage_of_investment',
        'location', 'contact_number', 'email', 'fund_size', 'focus_sector',
        'submitted_by', 'notes',
    ];
    protected $casts = ['met_date' => 'date'];
    public function attachments() { return $this->morphMany(Attachment::class, 'attachable'); }
}
