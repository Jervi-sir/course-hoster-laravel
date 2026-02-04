<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InstructorDashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $courses = $user->createdCourses()
            ->with(['students'])
            ->withCount('lessons')
            ->get()
            ->map(function ($course) {
                // Formatting students with progress
                $course->students->transform(function ($student) use ($course) {
                    $completedCount = \App\Models\LessonProgress::where('user_id', $student->id)
                        ->where('course_id', $course->id)
                        ->where('is_completed', true) // Assuming definition of completion
                        ->count();

                    $student->progress = $course->lessons_count > 0
                        ? round(($completedCount / $course->lessons_count) * 100)
                        : 0;

                    return $student;
                });

                return $course;
            });

        return Inertia::render('Instructor/Dashboard', [
            'courses' => $courses,
        ]);
    }
}
