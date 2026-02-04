<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::query()
            ->withCount(['modules', 'lessons', 'students'])
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/courses/index', [
            'courses' => $courses,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/courses/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'price' => ['required', 'numeric', 'min:0'],
            'level' => ['required', 'in:beginner,intermediate,advanced'],
            'status' => ['nullable', 'in:draft,published,archived'],
        ]);

        $data['slug'] = Str::slug($data['title']);
        $data['creator_id'] = auth()->id();
        $data['status'] = $request->input('status', 'draft');

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('courses/thumbnails', 'public');
        }

        $course = Course::create($data);

        return redirect()->route('admin.courses.builder', $course)
            ->with('success', 'Course created! Now add modules and lessons.');
    }

    public function builder(Course $course)
    {
        $course->load(['modules.lessons']);

        return Inertia::render('admin/courses/builder', [
            'course' => $course,
        ]);
    }

    public function show(Course $course)
    {
        $course->load('creator');

        $totalLessons = $course->lessons()->count();

        $students = $course->students()
            ->withPivot('enrolled_at')
            ->select('users.*')
            ->paginate(10)
            ->through(function ($student) use ($course) {
                $student->completed_lessons_count = $student->lessonProgress()
                    ->whereHas('lesson.module', function ($q) use ($course) {
                        $q->where('course_id', $course->id);
                    })
                    ->where('completed', true)
                    ->count();

                return $student;
            });

        return Inertia::render('admin/courses/show', [
            'course' => $course,
            'students' => $students,
            'totalLessons' => $totalLessons,
        ]);
    }

    public function edit(Course $course)
    {
        return Inertia::render('admin/courses/edit', [
            'course' => $course,
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'price' => ['required', 'numeric', 'min:0'],
            'level' => ['required', 'in:beginner,intermediate,advanced'],
            'status' => ['nullable', 'in:draft,published,archived'],
        ]);

        if ($course->title !== $data['title']) {
            $data['slug'] = Str::slug($data['title']);
        }

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('courses/thumbnails', 'public');
        }

        $course->update($data);

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course deleted successfully.');
    }
}
