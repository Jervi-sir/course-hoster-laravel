<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckEnrollment
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $course = $request->route('course');

        if (! $course) {
            abort(404);
        }

        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // Allow admins and the course creator to access
        if ($user->hasRole('admin') || $user->id === $course->creator_id) {
            return $next($request);
        }

        // Check enrollment
        if (! $user->courses()->where('courses.id', $course->id)->exists()) {
            return redirect()->route('courses.show', $course)->with('error', 'You need to enroll in this course to access the lessons.');
        }

        return $next($request);
    }
}
