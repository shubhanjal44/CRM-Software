<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Policy;
use Illuminate\Http\Request;

class PolicyController extends Controller
{
    public function index(Request $request)
    {
        $query = Policy::with('attachments')->latest();
        if ($search = $request->search) {
            $query->where('name', 'ilike', "%{$search}%");
        }
        if ($category = $request->category) $query->where('category', $category);
        if ($request->has('archived')) {
            $query->where('archived', filter_var($request->archived, FILTER_VALIDATE_BOOLEAN));
        }
        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'category'       => 'required|string|max:100',
            'effective_date' => 'nullable|date',
            'version'        => 'nullable|string|max:20',
        ]);
        $policy = Policy::create($validated + [
            'uploaded_by' => auth()->user()->name,
            'archived'    => false,
        ]);
        return response()->json($policy, 201);
    }

    public function show(Policy $policy)
    {
        return response()->json($policy->load('attachments'));
    }

    public function update(Request $request, Policy $policy)
    {
        $validated = $request->validate([
            'name'           => 'sometimes|required|string|max:255',
            'category'       => 'sometimes|required|string|max:100',
            'effective_date' => 'nullable|date',
            'version'        => 'nullable|string|max:20',
        ]);
        $policy->update($validated);
        return response()->json($policy);
    }

    public function destroy(Policy $policy)
    {
        $policy->delete();
        return response()->json(['message' => 'Policy deleted']);
    }

    public function toggleArchive(Policy $policy)
    {
        $policy->update(['archived' => !$policy->archived]);
        return response()->json($policy);
    }
}
