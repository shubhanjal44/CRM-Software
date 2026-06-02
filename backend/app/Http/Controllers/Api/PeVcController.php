<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PeVc;
use Illuminate\Http\Request;

class PeVcController extends Controller
{
    public function index(Request $request)
    {
        $query = PeVc::with('attachments')->latest();
        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('organization_name', 'ilike', "%{$search}%")
                  ->orWhere('person_met', 'ilike', "%{$search}%")
                  ->orWhere('focus_sector', 'ilike', "%{$search}%");
            });
        }
        if ($stage = $request->stage) $query->where('stage_of_investment', $stage);
        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_name'    => 'required|string|max:255',
            'met_date'             => 'nullable|date',
            'person_met'           => 'nullable|string|max:255',
            'stage_of_investment'  => 'nullable|string|max:100',
            'location'             => 'nullable|string|max:255',
            'contact_number'       => 'nullable|string|max:20',
            'email'                => 'nullable|email|max:255',
            'fund_size'            => 'nullable|string|max:100',
            'focus_sector'         => 'nullable|string|max:255',
            'notes'                => 'nullable|string',
        ]);
        $pevc = PeVc::create($validated + ['submitted_by' => auth()->user()->name]);
        return response()->json($pevc, 201);
    }

    public function show(PeVc $peVc)
    {
        return response()->json($peVc->load('attachments'));
    }

    public function update(Request $request, PeVc $peVc)
    {
        $validated = $request->validate([
            'organization_name'    => 'sometimes|required|string|max:255',
            'met_date'             => 'nullable|date',
            'person_met'           => 'nullable|string|max:255',
            'stage_of_investment'  => 'nullable|string|max:100',
            'location'             => 'nullable|string|max:255',
            'contact_number'       => 'nullable|string|max:20',
            'email'                => 'nullable|email|max:255',
            'fund_size'            => 'nullable|string|max:100',
            'focus_sector'         => 'nullable|string|max:255',
            'notes'                => 'nullable|string',
        ]);
        $peVc->update($validated);
        return response()->json($peVc);
    }

    public function destroy(PeVc $peVc)
    {
        $peVc->delete();
        return response()->json(['message' => 'PE/VC record deleted']);
    }
}
