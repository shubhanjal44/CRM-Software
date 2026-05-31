<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Investor;
use App\Models\Company;
use App\Models\Pipeline;
use App\Models\PeVc;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::create([
            'name'     => 'Super Admin',
            'email'    => 'admin@tejindia.com',
            'password' => Hash::make('Admin@1234'),
            'role'     => 'super_admin',
            'status'   => 'active',
        ]);

        // Additional users
        User::create([
            'name'     => 'Rohan Mehta',
            'email'    => 'rohan@tejindia.com',
            'password' => Hash::make('Admin@1234'),
            'role'     => 'research_analyst',
            'status'   => 'active',
        ]);

        User::create([
            'name'     => 'Priya Sharma',
            'email'    => 'priya@tejindia.com',
            'password' => Hash::make('Admin@1234'),
            'role'     => 'crm_executive',
            'status'   => 'active',
        ]);

        // Sample investors
        $investors = [
            ['organization_name' => 'Rajan Capital Partners', 'investor_name' => 'Rajan Mehta', 'location' => 'Mumbai', 'email' => 'rajan@rajancapital.com', 'classification' => 'Family Office', 'current_status' => 'Active', 'source_of_introduction' => 'Referral', 'submitted_by' => 'Admin'],
            ['organization_name' => 'Sunrise Angel Network', 'investor_name' => 'Priyanka Verma', 'location' => 'Bangalore', 'email' => 'priyanka@sunrisean.com', 'classification' => 'Angel Investor', 'current_status' => 'Interested', 'source_of_introduction' => 'LinkedIn', 'submitted_by' => 'Rohan Mehta'],
            ['organization_name' => 'GlobalTech Ventures', 'investor_name' => 'Arjun Singhania', 'location' => 'Delhi', 'email' => 'arjun@globaltech.vc', 'classification' => 'VC', 'current_status' => 'Follow-up Required', 'source_of_introduction' => 'Events', 'submitted_by' => 'Priya Sharma'],
        ];
        foreach ($investors as $inv) { Investor::create($inv); }

        // Sample companies
        $companies = [
            ['name' => 'ABC Pharma Ltd', 'industry' => 'Healthcare', 'sector' => 'Pharmaceuticals', 'location' => 'Mumbai', 'current_status' => 'Active', 'submitted_by' => 'Admin'],
            ['name' => 'TechVista Solutions', 'industry' => 'Technology', 'sector' => 'SaaS', 'location' => 'Bangalore', 'current_status' => 'Active', 'submitted_by' => 'Rohan Mehta'],
            ['name' => 'GreenField Energy', 'industry' => 'Energy', 'sector' => 'Renewables', 'location' => 'Pune', 'current_status' => 'Under Review', 'submitted_by' => 'Priya Sharma'],
        ];
        foreach ($companies as $co) { Company::create($co); }

        // Sample pipeline
        $pipelines = [
            ['company_name' => 'TechVista Solutions', 'meeting_date' => '2026-06-10', 'source_name' => 'Referral', 'company_location' => 'Bangalore', 'submitted_by' => 'Admin', 'status' => 'Due Diligence', 'priority' => 'High'],
            ['company_name' => 'GreenField Energy', 'meeting_date' => '2026-06-05', 'source_name' => 'LinkedIn', 'company_location' => 'Pune', 'submitted_by' => 'Rohan Mehta', 'status' => 'Proposal Sent', 'priority' => 'High'],
            ['company_name' => 'AgriTech Innovations', 'meeting_date' => '2026-06-01', 'source_name' => 'Events', 'company_location' => 'Pune', 'submitted_by' => 'Priya Sharma', 'status' => 'New Lead', 'priority' => 'Medium'],
        ];
        foreach ($pipelines as $p) { Pipeline::create($p); }

        // Sample PE/VC
        $peVcs = [
            ['organization_name' => 'Sequoia Capital India', 'met_date' => '2026-05-20', 'person_met' => 'Shailendra Singh', 'stage_of_investment' => 'Series A', 'location' => 'Bangalore', 'email' => 'india@sequoiacap.com', 'fund_size' => '$2.5B', 'focus_sector' => 'Technology', 'submitted_by' => 'Admin'],
            ['organization_name' => 'Lightspeed India', 'met_date' => '2026-05-10', 'person_met' => 'Bejul Somaia', 'stage_of_investment' => 'Seed', 'location' => 'Delhi', 'email' => 'india@lsvp.com', 'fund_size' => '$500M', 'focus_sector' => 'SaaS, Fintech', 'submitted_by' => 'Rohan Mehta'],
        ];
        foreach ($peVcs as $pv) { PeVc::create($pv); }

        $this->command->info('✅ TEJ India CRM seeded successfully!');
    }
}
