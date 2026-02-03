<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCourseRequest;
use App\Http\Requests\Admin\UpdateCourseRequest;
use App\Models\Course;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/courses/index', [
            'courses' => Course::with('creator')->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/courses/create');
    }

    public function store(StoreCourseRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['title']);
        $data['creator_id'] = auth()->id();

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('courses/thumbnails', 'public');
        }

        Course::create($data);

        return redirect()->route('admin.courses.index')->with('success', 'Course created successfully.');
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

    public function update(UpdateCourseRequest $request, Course $course)
    {
        $data = $request->validated();

        if ($course->title !== $data['title']) {
            $data['slug'] = Str::slug($data['title']);
        }

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('courses/thumbnails', 'public');
        }

        $course->update($data);

        return redirect()->route('admin.courses.index')->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->route('admin.courses.index')->with('success', 'Course deleted successfully.');
    }
}
