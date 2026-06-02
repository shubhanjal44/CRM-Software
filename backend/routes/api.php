<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ResearchController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\PolicyController;
use App\Http\Controllers\Api\PipelineController;
use App\Http\Controllers\Api\InvestorController;
use App\Http\Controllers\Api\TalentController;
use App\Http\Controllers\Api\IntermediaryController;
use App\Http\Controllers\Api\PeVcController;
use App\Http\Controllers\Api\DataCentreController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AttachmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/api/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/change-password', [AuthController::class, 'changePassword']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/charts', [DashboardController::class, 'charts']);
    Route::get('/dashboard/activities', [DashboardController::class, 'activities']);

    // Research
    Route::apiResource('/research', ResearchController::class);

    // Companies
    Route::apiResource('/companies', CompanyController::class);

    // Policies
    Route::apiResource('/policies', PolicyController::class);
    Route::put('/policies/{policy}/archive', [PolicyController::class, 'toggleArchive']);

    // Pipeline
    Route::apiResource('/pipeline', PipelineController::class);

    // CRM - Investors
    Route::apiResource('/investors', InvestorController::class);

    // CRM - Talent Resources
    Route::apiResource('/talent', TalentController::class);

    // CRM - Intermediaries
    Route::apiResource('/intermediaries', IntermediaryController::class);

    // CRM - PE/VC
    Route::apiResource('/pe-vc', PeVcController::class);

    // Data Centre
    Route::get('/data-centre', [DataCentreController::class, 'index']);
    Route::post('/data-centre/bulk-download', [DataCentreController::class, 'bulkDownload']);

    // Attachments (polymorphic)
    Route::post('/attachments', [AttachmentController::class, 'store']);
    Route::delete('/attachments/{attachment}', [AttachmentController::class, 'destroy']);
    Route::get('/attachments/{attachment}/download', [AttachmentController::class, 'download']);

    // User Management (Super Admin only)
    Route::middleware('role:super_admin')->group(function () {
        Route::apiResource('/users', UserController::class);
    });
});
