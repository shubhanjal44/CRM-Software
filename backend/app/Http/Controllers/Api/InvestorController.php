<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Investor;
use Illuminate\Http\Request;

class InvestorController extends Controller
{
    public function index(Request $request)
    {
        $query = Investor::with('attachments')->latest();

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('organization_name', 'ilike', "%{$search}%")
                  ->orWhere('investor_name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }
        if ($status = $request->status) $query->where('current_status', $status);
        if ($class = $request->classification) $query->where('classification', $class);

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_name'       => 'required|string|max:255',
            'investor_name'           => 'required|string|max:255',
            'location'                => 'nullable|string|max:255',
            'contact_number'          => 'nullable|string|max:20',
            'email'                   => 'nullable|email|max:255',
            'classification'          => 'required|string',
            'last_interaction_date'   => 'nullable|date',
            'current_status'          => 'required|string',
            'india_related_investments' => 'nullable|string',
            'comments'                => 'nullable|string',
            'source_of_introduction'  => 'nullable|string|max:255',
            'next_steps'              => 'nullable|string',
            'submitted_by'            => 'nullable|string|max:255',
            'investment_thesis'       => 'nullable|string',
            'preferred_sectors'       => 'nullable|string',
            'ticket_size'             => 'nullable|string|max:100',
            'geography_preference'    => 'nullable|string|max:255',
            'internal_notes'          => 'nullable|string',
        ]);

        $investor = Investor::create($validated + ['submitted_by' => auth()->user()->name]);

        return response()->json($investor, 201);
    }

    public function show(Investor $investor)
    {
        return response()->json($investor->load('attachments'));
    }

    public function update(Request $request, Investor $investor)
    {
        $validated = $request->validate([
            'organization_name'       => 'sometimes|required|string|max:255',
            'investor_name'           => 'sometimes|required|string|max:255',
            'location'                => 'nullable|string|max:255',
            'contact_number'          => 'nullable|string|max:20',
            'email'                   => 'nullable|email|max:255',
            'classification'          => 'sometimes|required|string',
            'last_interaction_date'   => 'nullable|date',
            'current_status'          => 'sometimes|required|string',
            'india_related_investments' => 'nullable|string',
            'comments'                => 'nullable|string',
            'source_of_introduction'  => 'nullable|string|max:255',
            'next_steps'              => 'nullable|string',
            'investment_thesis'       => 'nullable|string',
            'preferred_sectors'       => 'nullable|string',
            'ticket_size'             => 'nullable|string|max:100',
            'geography_preference'    => 'nullable|string|max:255',
            'internal_notes'          => 'nullable|string',
        ]);
        $investor->update($validated);
        return response()->json($investor);
    }

    public function destroy(Investor $investor)
    {
        $investor->delete();
        return response()->json(['message' => 'Investor deleted']);
    }
}
