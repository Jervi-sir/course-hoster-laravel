<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $query = Course::query()
            ->withCount(['modules', 'lessons', 'students'])
            ->latest();

        if (! auth()->user()->hasRole('admin')) {
            $query->where('creator_id', auth()->id());
        }

        $courses = $query->paginate(10);

        return Inertia::render('instructor/courses/index', [
            'courses' => $courses,
        ]);
    }

    public function create()
    {
        return Inertia::render('instructor/courses/create');
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
        ], [
            'title.required' => 'Please provide a course title.',
            'price.required' => 'Please set a price for the course.',
            'price.min' => 'Price cannot be negative.',
            'level.required' => 'Please select a difficulty level.',
            'thumbnail.image' => 'Thumbnail must be an image file.',
            'thumbnail.max' => 'Thumbnail size cannot exceed 2MB.',
        ]);
        $data['slug'] = Str::slug($data['title']);
        $data['creator_id'] = auth()->id();
        $data['status'] = 'draft'; // Always start as draft

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('courses/thumbnails', 'public');
            $data['thumbnail'] = config('app.url') . '/storage/' . $path;
        }

        $course = Course::create($data);

        // Redirect to course builder to add modules and lessons
        return redirect()->route('instructor.courses.builder', $course)
            ->with('success', 'Course created! Now add modules and lessons.');
    }

    public function builder(Course $course)
    {
        // Ensure the authenticated user owns this course or is admin
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }

        $course->load(['modules.lessons']);

        return Inertia::render('instructor/courses/builder', [
            'course' => $course,
        ]);
    }

    public function edit(Course $course)
    {
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }

        return Inertia::render('instructor/courses/edit', [
            'course' => $course,
        ]);
    }

    public function update(Request $request, Course $course)
    {
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'price' => ['required', 'numeric', 'min:0'],
            'level' => ['required', 'in:beginner,intermediate,advanced'],
            'status' => ['nullable', 'in:draft,published,archived'],
        ], [
            'title.required' => 'Please provide a course title.',
            'price.required' => 'Please set a price for the course.',
            'price.min' => 'Price cannot be negative.',
            'level.required' => 'Please select a difficulty level.',
            'thumbnail.image' => 'Thumbnail must be an image file.',
            'thumbnail.max' => 'Thumbnail size cannot exceed 2MB.',
        ]);

        if ($course->title !== $data['title']) {
            $data['slug'] = Str::slug($data['title']);
        }

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('courses/thumbnails', 'public');
            $data['thumbnail'] = config('app.url') . '/storage/' . $path;
        }

        $course->update($data);

        return redirect()->route('instructor.courses.index')
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }

        $course->delete();

        return redirect()->route('instructor.courses.index')
            ->with('success', 'Course deleted successfully.');
    }

    public function students(Course $course)
    {
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }

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
                    ->where('is_completed', true)
                    ->count();

                return $student;
            });

        return Inertia::render('instructor/courses/students', [
            'course' => $course,
            'students' => $students,
            'totalLessons' => $totalLessons,
        ]);
    }
}
