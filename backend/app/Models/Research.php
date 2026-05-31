<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Research extends Model
{
    use HasFactory;
    protected $fillable = [
        'title', 'category', 'author', 'description', 'status', 'tags', 'version',
    ];
    protected $casts = ['tags' => 'array'];
    public function attachments() { return $this->morphMany(Attachment::class, 'attachable'); }
}
