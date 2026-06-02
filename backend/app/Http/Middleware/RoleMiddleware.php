<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request — check that user has required role.
     *
     * Usage: middleware('role:super_admin') or middleware('role:admin,super_admin')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // super_admin always has access
        if ($user->role === 'super_admin') {
            return $next($request);
        }

        if (!in_array($user->role, $roles)) {
            return response()->json(['message' => 'Forbidden — insufficient role'], 403);
        }

        return $next($request);
    }
}
