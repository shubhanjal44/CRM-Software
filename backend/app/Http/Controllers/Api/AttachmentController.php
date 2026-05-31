<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file'             => 'required|file|max:102400', // 100MB max
            'attachable_type'  => 'required|string',
            'attachable_id'    => 'required|integer',
        ]);

        $file = $request->file('file');
        $path = $file->store("attachments/{$request->attachable_type}/{$request->attachable_id}", 'local');

        $attachment = Attachment::create([
            'attachable_type' => $request->attachable_type,
            'attachable_id'   => $request->attachable_id,
            'file_name'       => $file->getClientOriginalName(),
            'file_path'       => $path,
            'file_size'       => $file->getSize(),
            'file_type'       => $file->getClientOriginalExtension(),
            'uploaded_by'     => auth()->user()->name,
        ]);

        return response()->json($attachment, 201);
    }

    public function destroy(Attachment $attachment)
    {
        Storage::disk('local')->delete($attachment->file_path);
        $attachment->delete();
        return response()->json(['message' => 'File deleted']);
    }

    public function download(Attachment $attachment)
    {
        return Storage::disk('local')->download($attachment->file_path, $attachment->file_name);
    }
}
