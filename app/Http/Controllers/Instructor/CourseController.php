<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreCourseRequest;
use App\Models\Course;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::where('creator_id', auth()->id())
            ->withCount(['modules', 'lessons', 'students'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Instructor/Courses/Index', [
            'courses' => $courses,
        ]);
    }

    public function create()
    {
        return Inertia::render('Instructor/Courses/Create');
    }

    public function store(StoreCourseRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['title']);
        $data['creator_id'] = auth()->id();
        $data['status'] = 'draft'; // Always start as draft

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('courses/thumbnails', 'public');
        }

        $course = Course::create($data);

        // Redirect to course builder to add modules and lessons
        return redirect()->route('instructor.courses.builder', $course)
            ->with('success', 'Course created! Now add modules and lessons.');
    }

    public function builder(Course $course)
    {
        // Ensure the authenticated user owns this course
        abort_unless($course->creator_id === auth()->id(), 403);

        $course->load(['modules.lessons']);

        return Inertia::render('Instructor/Courses/Builder', [
            'course' => $course,
        ]);
    }

    public function edit(Course $course)
    {
        abort_unless($course->creator_id === auth()->id(), 403);

        return Inertia::render('Instructor/Courses/Edit', [
            'course' => $course,
        ]);
    }

    public function update(StoreCourseRequest $request, Course $course)
    {
        abort_unless($course->creator_id === auth()->id(), 403);

        $data = $request->validated();

        if ($course->title !== $data['title']) {
            $data['slug'] = Str::slug($data['title']);
        }

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('courses/thumbnails', 'public');
        }

        $course->update($data);

        return redirect()->route('instructor.courses.index')
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        abort_unless($course->creator_id === auth()->id(), 403);

        $course->delete();

        return redirect()->route('instructor.courses.index')
            ->with('success', 'Course deleted successfully.');
    }
}
