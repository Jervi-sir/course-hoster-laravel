<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Enrollment;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::where('status', 'published')
            ->with(['creator'])
            ->withCount('lessons')
            ->latest()
            ->paginate(12);

        return Inertia::render('courses/index', [
            'courses' => $courses
        ]);
    }

    public function show(Course $course)
    {
        if ($course->status !== 'published') {
            abort(404);
        }

        $course->load(['modules.lessons', 'creator']);
        $course->loadCount('lessons');

        // Check if enrolled
        $isEnrolled = false;
        if (auth()->check()) {
            $isEnrolled = Enrollment::where('user_id', auth()->id())
                ->where('course_id', $course->id)
                ->where('is_active', true)
                ->exists();
        }

        return Inertia::render('courses/show', [
            'course' => $course,
            'isEnrolled' => $isEnrolled
        ]);
    }

    public function learn(Course $course)
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $isEnrolled = Enrollment::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->where('is_active', true)
            ->exists();

        if (!$isEnrolled) {
            return redirect()->route('courses.show', $course);
        }

        // Ideally redirect to the last watched lesson or first lesson
        // For now, redirect to first lesson
        $firstLesson = $course->lessons()->orderBy('modules.sort_order')->orderBy('lessons.sort_order')->first();
        // Note: orderBy on joined table (modules) might need explicit join if using hasManyThrough relation which performs joins, 
        // but hasManyThrough might not join modules automatically in a way we can sort by module column without manual join.
        // Actually hasManyThrough does join. But sort order might be tricky.

        // Simpler approach: Get first module's first lesson.
        $firstModule = $course->modules()->orderBy('sort_order')->first();
        if (!$firstModule) {
            return redirect()->route('courses.show', $course)->with('error', 'Course has no content.');
        }

        $firstLesson = $firstModule->lessons()->orderBy('sort_order')->first();

        if (!$firstLesson) {
            return redirect()->route('courses.show', $course)->with('error', 'Course has no content.');
        }

        return redirect()->route('lessons.show', ['course' => $course, 'lesson' => $firstLesson]);
    }
}
