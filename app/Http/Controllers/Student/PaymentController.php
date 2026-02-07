<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;

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

        // Create Order Record
        $checkoutId = $request->input('checkout_id') ?? 'txn_' . uniqid();

        \App\Models\Order::updateOrCreate(
            [
                'user_id' => $user->id,
                'course_id' => $course->id,
            ],
            [
                'transaction_id' => $checkoutId,
                'amount_paid' => $course->price,
                'currency' => 'DZD',
                'status' => 'completed',
                'payment_method' => 'chargily',
            ]
        );

        return redirect()->route('courses.show', $course)->with('success', 'Enrolled successfully!');
    }

    public function failure(Request $request)
    {
        return redirect()->route('dashboard')->with('error', 'Payment failed or was cancelled.');
    }
}
