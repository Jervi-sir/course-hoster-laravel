<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

// Added this import

class ReviewController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = auth()->user();

        // Check if user is enrolled
        $isEnrolled = $course->enrollments()
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->exists();

        if (! $isEnrolled) {
            abort(403, 'You must be enrolled in this course to leave a review.');
        }

        // Check if already reviewed
        $hasReviewed = $course->reviews()
            ->where('user_id', $user->id)
            ->exists();

        if ($hasReviewed) {
            abort(403, 'You have already reviewed this course.');
        }

        $course->reviews()->create([
            'user_id' => $user->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back();
    }
}
