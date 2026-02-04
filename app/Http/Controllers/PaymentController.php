<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function success(Request $request)
    {
        $courseId = $request->input('course_id');

        if (! $courseId) {
            return redirect()->route('dashboard')->with('error', 'Payment successful but course information missing.');
        }

        $course = Course::findOrFail($courseId);
        $user = $request->user();

        if (! $user->enrollments()->where('course_id', $course->id)->exists()) {
            $user->enrollments()->create([
                'course_id' => $course->id,
                'is_active' => true,
            ]);
        }

        return redirect()->route('courses.show', $course)->with('success', 'Enrolled successfully!');
    }

    public function failure(Request $request)
    {
        return redirect()->route('dashboard')->with('error', 'Payment failed or was cancelled.');
    }
}
