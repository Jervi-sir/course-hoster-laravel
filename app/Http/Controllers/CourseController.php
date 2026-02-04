<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::where('status', 'published')
            ->with(['creator', 'category'])
            ->withCount('lessons')
            ->when($request->search, function ($q, $search) {
                $q->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->category, function ($q, $category) {
                $q->where('category_id', $category);
            });

        if (auth()->check()) {
            $query->withExists(['favoritedBy as is_favorited' => function ($q) {
                $q->where('user_id', auth()->id());
            }]);
        }

        $courses = $query->latest()->paginate(12)->withQueryString();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('courses/index', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function show(Course $course)
    {
        if ($course->status !== 'published') {
            abort(404);
        }

        $course->load(['modules.lessons', 'creator', 'reviews.user']);
        $course->loadCount('lessons');
        $course->loadAvg('reviews', 'rating');

        if (auth()->check()) {
            $course->loadExists(['favoritedBy as is_favorited' => function ($query) {
                $query->where('user_id', auth()->id());
            }]);
        }

        // Check if enrolled
        $isEnrolled = false;
        $canReview = false;
        if (auth()->check()) {
            $isEnrolled = Enrollment::where('user_id', auth()->id())
                ->where('course_id', $course->id)
                ->where('is_active', true)
                ->exists();

            if ($isEnrolled) {
                $canReview = ! $course->reviews()->where('user_id', auth()->id())->exists();
            }
        }

        return Inertia::render('courses/show', [
            'course' => $course,
            'isEnrolled' => $isEnrolled,
            'canReview' => $canReview,
        ]);
    }
}
