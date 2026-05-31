<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Research
        Schema::create('research', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->string('author');
            $table->text('description')->nullable();
            $table->enum('status', ['Draft', 'In Review', 'Published', 'Archived'])->default('Draft');
            $table->json('tags')->nullable();
            $table->string('version')->default('v1.0');
            $table->timestamps();
        });

        // Companies
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('industry')->nullable();
            $table->string('sector')->nullable();
            $table->string('website')->nullable();
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->string('current_status')->default('Active');
            $table->string('submitted_by')->nullable();
            $table->date('date_added')->nullable();
            $table->timestamps();
        });

        // Policies
        Schema::create('policies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->date('effective_date')->nullable();
            $table->string('uploaded_by')->nullable();
            $table->string('version')->default('v1.0');
            $table->boolean('archived')->default(false);
            $table->timestamps();
        });

        // Pipeline
        Schema::create('pipelines', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->date('meeting_date')->nullable();
            $table->string('source_name')->nullable();
            $table->string('company_location')->nullable();
            $table->string('submitted_by')->nullable();
            $table->text('remarks')->nullable();
            $table->enum('status', [
                'New Lead', 'Contacted', 'Meeting Scheduled', 'Due Diligence',
                'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'
            ])->default('New Lead');
            $table->date('next_followup_date')->nullable();
            $table->enum('priority', ['High', 'Medium', 'Low'])->default('Medium');
            $table->timestamps();
        });

        // Investors
        Schema::create('investors', function (Blueprint $table) {
            $table->id();
            $table->string('organization_name');
            $table->string('investor_name');
            $table->string('location')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->string('classification');
            $table->date('last_interaction_date')->nullable();
            $table->string('current_status')->default('Active');
            $table->text('india_related_investments')->nullable();
            $table->text('comments')->nullable();
            $table->string('source_of_introduction')->nullable();
            $table->text('next_steps')->nullable();
            $table->string('submitted_by')->nullable();
            $table->text('investment_thesis')->nullable();
            $table->string('preferred_sectors')->nullable();
            $table->string('ticket_size')->nullable();
            $table->string('geography_preference')->nullable();
            $table->text('internal_notes')->nullable();
            $table->timestamps();
        });

        // Talent Resources
        Schema::create('talent_resources', function (Blueprint $table) {
            $table->id();
            $table->string('individual_name');
            $table->date('interaction_date')->nullable();
            $table->string('source_of_introduction')->nullable();
            $table->string('previous_organization')->nullable();
            $table->string('current_organization')->nullable();
            $table->string('designation')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->string('submitted_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Intermediaries
        Schema::create('intermediaries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('interaction_date')->nullable();
            $table->string('source_of_introduction')->nullable();
            $table->string('previous_organization')->nullable();
            $table->string('current_organization')->nullable();
            $table->string('designation')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->string('submitted_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // PE/VC
        Schema::create('pe_vcs', function (Blueprint $table) {
            $table->id();
            $table->string('organization_name');
            $table->date('met_date')->nullable();
            $table->string('person_met')->nullable();
            $table->string('stage_of_investment')->nullable();
            $table->string('location')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->string('fund_size')->nullable();
            $table->string('focus_sector')->nullable();
            $table->string('submitted_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Attachments (polymorphic)
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->morphs('attachable'); // attachable_type + attachable_id
            $table->string('file_name');
            $table->string('file_path');
            $table->bigInteger('file_size')->default(0);
            $table->string('file_type')->nullable();
            $table->string('uploaded_by')->nullable();
            $table->timestamps();
        });

        // Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action'); // created | updated | deleted
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('attachments');
        Schema::dropIfExists('pe_vcs');
        Schema::dropIfExists('intermediaries');
        Schema::dropIfExists('talent_resources');
        Schema::dropIfExists('investors');
        Schema::dropIfExists('pipelines');
        Schema::dropIfExists('policies');
        Schema::dropIfExists('companies');
        Schema::dropIfExists('research');
    }
};
