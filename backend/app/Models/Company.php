<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'industry', 'sector', 'website', 'location',
        'description', 'current_status', 'submitted_by', 'date_added',
    ];
    protected $casts = ['date_added' => 'date'];
    public function attachments() { return $this->morphMany(Attachment::class, 'attachable'); }
}
