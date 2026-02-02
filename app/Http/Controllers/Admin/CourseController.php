<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Courses/Index', [
            'courses' => Course::with('creator')->paginate(10),
        ]);
    }

    public function show(Course $course)
    {
        $course->load('creator');

        $totalLessons = $course->lessons()->count();

        $students = $course->students()
            ->withCount(['lessonProgress as completed_lessons_count' => function ($query) use ($course) {
                $query->where('course_id', $course->id)
                    ->where('is_completed', true);
            }])
            ->paginate(10);

        return Inertia::render('Admin/Courses/Show', [
            'course' => $course,
            'students' => $students,
            'totalLessons' => $totalLessons,
        ]);
    }
}
