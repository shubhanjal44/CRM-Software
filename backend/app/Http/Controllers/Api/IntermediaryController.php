<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Intermediary;
use Illuminate\Http\Request;

class IntermediaryController extends Controller
{
    public function index(Request $request)
    {
        $query = Intermediary::latest();
        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('designation', 'ilike', "%{$search}%")
                  ->orWhere('current_organization', 'ilike', "%{$search}%");
            });
        }
        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                  => 'required|string|max:255',
            'interaction_date'      => 'nullable|date',
            'source_of_introduction'=> 'nullable|string|max:255',
            'previous_organization' => 'nullable|string|max:255',
            'current_organization'  => 'nullable|string|max:255',
            'designation'           => 'nullable|string|max:255',
            'contact_number'        => 'nullable|string|max:20',
            'email'                 => 'nullable|email|max:255',
            'notes'                 => 'nullable|string',
        ]);
        $intermediary = Intermediary::create($validated + ['submitted_by' => auth()->user()->name]);
        return response()->json($intermediary, 201);
    }

    public function show(Intermediary $intermediary)
    {
        return response()->json($intermediary);
    }

    public function update(Request $request, Intermediary $intermediary)
    {
        $validated = $request->validate([
            'name'                  => 'sometimes|required|string|max:255',
            'interaction_date'      => 'nullable|date',
            'source_of_introduction'=> 'nullable|string|max:255',
            'previous_organization' => 'nullable|string|max:255',
            'current_organization'  => 'nullable|string|max:255',
            'designation'           => 'nullable|string|max:255',
            'contact_number'        => 'nullable|string|max:20',
            'email'                 => 'nullable|email|max:255',
            'notes'                 => 'nullable|string',
        ]);
        $intermediary->update($validated);
        return response()->json($intermediary);
    }

    public function destroy(Intermediary $intermediary)
    {
        $intermediary->delete();
        return response()->json(['message' => 'Intermediary deleted']);
    }
}
