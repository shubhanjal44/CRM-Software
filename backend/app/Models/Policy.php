<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'category', 'effective_date', 'uploaded_by', 'version', 'archived',
    ];
    protected $casts = ['effective_date' => 'date', 'archived' => 'boolean'];
    public function attachments() { return $this->morphMany(Attachment::class, 'attachable'); }
}
