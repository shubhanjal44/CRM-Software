<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'attachable_type', 'attachable_id',
        'file_name', 'file_path', 'file_size', 'file_type', 'uploaded_by',
    ];

    // Polymorphic relationship
    public function attachable()
    {
        return $this->morphTo();
    }

    // Get the public URL for the file
    public function getUrlAttribute(): string
    {
        return Storage::url($this->file_path);
    }

    // Accessor for file size in human-readable format
    public function getFileSizeHumanAttribute(): string
    {
        $bytes = $this->file_size;
        if ($bytes < 1024) return $bytes . ' B';
        if ($bytes < 1048576) return round($bytes / 1024, 1) . ' KB';
        return round($bytes / 1048576, 1) . ' MB';
    }
}
