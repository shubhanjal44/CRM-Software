<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TalentResource;
use Illuminate\Http\Request;

class TalentController extends Controller
{
    public function index(Request $request)
    {
        $query = TalentResource::latest();
        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('individual_name', 'ilike', "%{$search}%")
                  ->orWhere('designation', 'ilike', "%{$search}%")
                  ->orWhere('current_organization', 'ilike', "%{$search}%")
                  ->orWhere('previous_organization', 'ilike', "%{$search}%");
            });
        }
        if ($source = $request->source) $query->where('source_of_introduction', $source);
        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'individual_name'       => 'required|string|max:255',
            'interaction_date'      => 'nullable|date',
            'source_of_introduction'=> 'nullable|string|max:255',
            'previous_organization' => 'nullable|string|max:255',
            'current_organization'  => 'nullable|string|max:255',
            'designation'           => 'nullable|string|max:255',
            'contact_number'        => 'nullable|string|max:20',
            'email'                 => 'nullable|email|max:255',
            'notes'                 => 'nullable|string',
        ]);
        $talent = TalentResource::create($validated + ['submitted_by' => auth()->user()->name]);
        return response()->json($talent, 201);
    }

    public function show(TalentResource $talent)
    {
        return response()->json($talent);
    }

    public function update(Request $request, TalentResource $talent)
    {
        $validated = $request->validate([
            'individual_name'       => 'sometimes|required|string|max:255',
            'interaction_date'      => 'nullable|date',
            'source_of_introduction'=> 'nullable|string|max:255',
            'previous_organization' => 'nullable|string|max:255',
            'current_organization'  => 'nullable|string|max:255',
            'designation'           => 'nullable|string|max:255',
            'contact_number'        => 'nullable|string|max:20',
            'email'                 => 'nullable|email|max:255',
            'notes'                 => 'nullable|string',
        ]);
        $talent->update($validated);
        return response()->json($talent);
    }

    public function destroy(TalentResource $talent)
    {
        $talent->delete();
        return response()->json(['message' => 'Talent resource deleted']);
    }
}
