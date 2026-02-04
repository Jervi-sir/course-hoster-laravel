<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function show(Course $course)
    {
        return Inertia::render('courses/checkout', [
            'course' => $course,
        ]);
    }

    public function store(Request $request, Course $course)
    {
        $user = $request->user();

        $response = Http::withHeaders([
            'Authorization' => 'Bearer test_sk_cVXWOhihuc4VChFqlOZh0v1w57nt9fT6wbHh4sVG',
            'Content-Type' => 'application/json',
        ])->post('https://pay.chargily.net/test/api/v2/checkouts', [
            'amount' => (int) $course->price * 100,
            'currency' => 'dzd',
            'success_url' => route('payment.success', ['course_id' => $course->id]),
            'failure_url' => route('payment.failure'),
            'description' => 'Payment for '.$course->title,
            'metadata' => [
                'course_id' => $course->id,
                'user_id' => $user->id,
            ],
        ]);

        if ($response->successful()) {
            $checkoutUrl = $response->json('checkout_url');

            return Inertia::location($checkoutUrl);
        }

        return back()->with('error', 'Payment initialization failed. Please try again.');
    }
}
