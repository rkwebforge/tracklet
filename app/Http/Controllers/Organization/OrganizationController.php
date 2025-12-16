<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Domain\Organization\Models\Organization;

class OrganizationController extends Controller
{
    /**
     * Display a listing of organizations.
     */
    public function index(): Response
    {
        $organizations = Organization::whereHas('members', function($query) {
            $query->where('user_id', auth()->id());
        })->with('owner')->get();

        return Inertia::render('Organization/Index', [
            'organizations' => $organizations,
        ]);
    }

    /**
     * Show the organization details.
     */
    public function show(int $id): Response
    {
        $organization = Organization::with(['owner', 'projects'])
            ->findOrFail($id);

        return Inertia::render('Organization/Show', [
            'organization' => $organization,
        ]);
    }
}
