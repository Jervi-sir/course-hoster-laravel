<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Course;

class EnrollmentController extends Controller
{
    public function store(Request $request, Course $course)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // Check if already enrolled
        if ($user->enrollments()->where('course_id', $course->id)->exists()) {
            return redirect()->back()->with('error', 'You are already enrolled in this course.');
        }

        // Fake Payment & Order
        $user->orders()->create([
            'course_id' => $course->id,
            'transaction_id' => 'tx_' . uniqid(),
            'amount_paid' => $course->price ?? 0,
            'currency' => 'USD',
            'status' => 'completed',
            'payment_method' => 'card_fake'
        ]);

        // Create Enrollment
        $user->enrollments()->create([
            'course_id' => $course->id,
            'is_active' => true,
        ]);

        return redirect()->route('dashboard')->with('success', 'Enrolled successfully!');
    }
}
