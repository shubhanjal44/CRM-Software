<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use Illuminate\Http\Request;

class DataCentreController extends Controller
{
    protected array $typeLabels = [
        'App\\Models\\Company'        => 'companies',
        'App\\Models\\Investor'       => 'investors',
        'App\\Models\\Research'       => 'research',
        'App\\Models\\Policy'         => 'policies',
        'App\\Models\\PeVc'           => 'pevc',
        'App\\Models\\TalentResource' => 'talent',
        'App\\Models\\Intermediary'   => 'intermediaries',
    ];

    public function index(Request $request)
    {
        $query = Attachment::with('attachable')->latest();

        if ($search = $request->search) {
            $query->where('file_name', 'ilike', "%{$search}%");
        }

        $modelMap = array_flip($this->typeLabels);
        if ($type = $request->type) {
            if (isset($modelMap[$type])) {
                $query->where('attachable_type', $modelMap[$type]);
            }
        }

        $attachments = $query->paginate(50);

        $data = $attachments->getCollection()->map(function ($att) {
            $entity = $att->attachable;
            $entityName = 'Unknown';
            if ($entity) {
                $entityName = $entity->name
                    ?? $entity->organization_name
                    ?? $entity->title
                    ?? $entity->individual_name
                    ?? 'Unknown';
            }
            return [
                'id'          => $att->id,
                'file_name'   => $att->file_name,
                'file_path'   => $att->file_path,
                'file_size'   => $att->file_size,
                'file_type'   => strtoupper(pathinfo($att->file_name, PATHINFO_EXTENSION)),
                'uploaded_by' => $att->uploaded_by,
                'created_at'  => $att->created_at,
                'category'    => $this->typeLabels[$att->attachable_type] ?? 'other',
                'entity_name' => $entityName,
            ];
        });

        return response()->json([
            'data'         => $data,
            'total'        => $attachments->total(),
            'current_page' => $attachments->currentPage(),
            'last_page'    => $attachments->lastPage(),
        ]);
    }

    public function bulkDownload(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer',
        ]);

        $attachments = Attachment::whereIn('id', $request->ids)->get();

        return response()->json([
            'files' => $attachments->map(fn ($a) => [
                'id'        => $a->id,
                'file_name' => $a->file_name,
                'download_url' => url("/api/attachments/{$a->id}/download"),
            ]),
        ]);
    }
}
