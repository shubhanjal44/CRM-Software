<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pipeline;
use Illuminate\Http\Request;

class PipelineController extends Controller
{
    public function index(Request $request)
    {
        $query = Pipeline::latest();
        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'ilike', "%{$search}%")
                  ->orWhere('source_name', 'ilike', "%{$search}%")
                  ->orWhere('company_location', 'ilike', "%{$search}%");
            });
        }
        if ($status   = $request->status)   $query->where('status', $status);
        if ($priority  = $request->priority)  $query->where('priority', $priority);
        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name'      => 'required|string|max:255',
            'meeting_date'      => 'nullable|date',
            'source_name'       => 'nullable|string|max:255',
            'company_location'  => 'nullable|string|max:255',
            'remarks'           => 'nullable|string',
            'status'            => 'nullable|string|max:50',
            'next_followup_date'=> 'nullable|date',
            'priority'          => 'nullable|string|max:20',
        ]);
        $pipeline = Pipeline::create($validated + ['submitted_by' => auth()->user()->name]);
        return response()->json($pipeline, 201);
    }

    public function show(Pipeline $pipeline)
    {
        return response()->json($pipeline);
    }

    public function update(Request $request, Pipeline $pipeline)
    {
        $validated = $request->validate([
            'company_name'      => 'sometimes|required|string|max:255',
            'meeting_date'      => 'nullable|date',
            'source_name'       => 'nullable|string|max:255',
            'company_location'  => 'nullable|string|max:255',
            'remarks'           => 'nullable|string',
            'status'            => 'nullable|string|max:50',
            'next_followup_date'=> 'nullable|date',
            'priority'          => 'nullable|string|max:20',
        ]);
        $pipeline->update($validated);
        return response()->json($pipeline);
    }

    public function destroy(Pipeline $pipeline)
    {
        $pipeline->delete();
        return response()->json(['message' => 'Pipeline entry deleted']);
    }
}
