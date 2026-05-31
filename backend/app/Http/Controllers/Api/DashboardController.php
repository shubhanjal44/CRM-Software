<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Investor;
use App\Models\Pipeline;
use App\Models\PeVc;
use App\Models\TalentResource;
use App\Models\Intermediary;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_companies'      => Company::count(),
            'active_pipeline'      => Pipeline::whereNotIn('status', ['Closed Won', 'Closed Lost'])->count(),
            'investors'            => Investor::count(),
            'pe_vc_contacts'       => PeVc::count(),
            'talent_resources'     => TalentResource::count(),
            'intermediaries'       => Intermediary::count(),
            'meetings_this_month'  => Pipeline::whereMonth('meeting_date', now()->month)->count(),
            'pending_followups'    => Pipeline::where('next_followup_date', '<=', now()->addDays(7))
                                             ->whereNotNull('next_followup_date')
                                             ->whereNotIn('status', ['Closed Won', 'Closed Lost'])
                                             ->count(),
        ]);
    }

    public function charts()
    {
        // Pipeline status distribution
        $pipelineByStatus = Pipeline::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get();

        // Investor classification distribution
        $investorByClass = Investor::selectRaw('classification, count(*) as count')
            ->groupBy('classification')
            ->get();

        // Monthly meetings trend (last 6 months)
        $monthlyMeetings = Pipeline::selectRaw("TO_CHAR(meeting_date, 'Mon') as month, count(*) as meetings")
            ->whereRaw("meeting_date >= NOW() - INTERVAL '6 months'")
            ->groupByRaw("TO_CHAR(meeting_date, 'Mon'), EXTRACT(MONTH FROM meeting_date)")
            ->orderByRaw("EXTRACT(MONTH FROM meeting_date)")
            ->get();

        // Source-wise leads
        $sourceLeads = Pipeline::selectRaw('source_name as source, count(*) as leads')
            ->whereNotNull('source_name')
            ->groupBy('source_name')
            ->get();

        return response()->json([
            'pipeline_by_status'   => $pipelineByStatus,
            'investor_by_class'    => $investorByClass,
            'monthly_meetings'     => $monthlyMeetings,
            'source_leads'         => $sourceLeads,
        ]);
    }

    public function activities()
    {
        // Return recent activities from audit log or direct queries
        $activities = collect();

        // Recent investors
        $investors = Investor::latest()->take(3)->get()->map(fn($i) => [
            'type' => 'investor',
            'text' => "New investor added: {$i->investor_name} ({$i->organization_name})",
            'time' => $i->created_at->diffForHumans(),
        ]);

        // Recent companies
        $companies = Company::latest()->take(3)->get()->map(fn($c) => [
            'type' => 'company',
            'text' => "{$c->name} added to Companies Portfolio",
            'time' => $c->created_at->diffForHumans(),
        ]);

        // Merge and sort
        $all = $investors->concat($companies)->sortByDesc('time')->take(8)->values();

        return response()->json($all);
    }
}
