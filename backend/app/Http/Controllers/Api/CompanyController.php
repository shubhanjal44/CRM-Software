<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::with('attachments')->latest();
        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('location', 'ilike', "%{$search}%")
                  ->orWhere('industry', 'ilike', "%{$search}%");
            });
        }
        if ($industry = $request->industry) $query->where('industry', $industry);
        if ($status = $request->status) $query->where('current_status', $status);
        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'industry'       => 'nullable|string|max:100',
            'sector'         => 'nullable|string|max:100',
            'website'        => 'nullable|string|max:255',
            'location'       => 'nullable|string|max:255',
            'description'    => 'nullable|string',
            'current_status' => 'nullable|string|max:50',
            'date_added'     => 'nullable|date',
        ]);
        $company = Company::create($validated + ['submitted_by' => auth()->user()->name]);
        return response()->json($company, 201);
    }

    public function show(Company $company)
    {
        return response()->json($company->load('attachments'));
    }

    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'name'           => 'sometimes|required|string|max:255',
            'industry'       => 'nullable|string|max:100',
            'sector'         => 'nullable|string|max:100',
            'website'        => 'nullable|string|max:255',
            'location'       => 'nullable|string|max:255',
            'description'    => 'nullable|string',
            'current_status' => 'nullable|string|max:50',
            'date_added'     => 'nullable|date',
        ]);
        $company->update($validated);
        return response()->json($company);
    }

    public function destroy(Company $company)
    {
        $company->delete();
        return response()->json(['message' => 'Company deleted']);
    }
}
