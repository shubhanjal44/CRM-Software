<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Research;
use Illuminate\Http\Request;

class ResearchController extends Controller
{
    public function index(Request $request)
    {
        $query = Research::with('attachments')->latest();
        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('author', 'ilike', "%{$search}%");
            });
        }
        if ($category = $request->category) $query->where('category', $category);
        if ($status   = $request->status)   $query->where('status', $status);
        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'category'    => 'required|string|max:100',
            'author'      => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|string|max:50',
            'tags'        => 'nullable|array',
            'tags.*'      => 'string|max:50',
            'version'     => 'nullable|string|max:20',
        ]);
        $research = Research::create($validated);
        return response()->json($research, 201);
    }

    public function show(Research $research)
    {
        return response()->json($research->load('attachments'));
    }

    public function update(Request $request, Research $research)
    {
        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'category'    => 'sometimes|required|string|max:100',
            'author'      => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|string|max:50',
            'tags'        => 'nullable|array',
            'tags.*'      => 'string|max:50',
            'version'     => 'nullable|string|max:20',
        ]);
        $research->update($validated);
        return response()->json($research);
    }

    public function destroy(Research $research)
    {
        $research->delete();
        return response()->json(['message' => 'Research deleted']);
    }
}
