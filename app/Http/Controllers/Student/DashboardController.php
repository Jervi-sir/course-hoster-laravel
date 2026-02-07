<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $courses = $user->courses()
            ->with(['creator']) // Eager load creator
            ->withCount('lessons')
            ->get()
            ->map(function ($course) use ($user) {
                // Determine completed lessons count
                $completedCount = \App\Models\LessonProgress::where('user_id', $user->id)
                    ->where('course_id', $course->id)
                    ->where('is_completed', true)
                    ->count();

                $progress = $course->lessons_count > 0
                    ? round(($completedCount / $course->lessons_count) * 100)
                    : 0;

                $course->progress = $progress;
                $course->completed_lessons_count = $completedCount;

                return $course;
            });

        return Inertia::render('student/dashboard', [
            'courses' => $courses,
        ]);
    }
}
