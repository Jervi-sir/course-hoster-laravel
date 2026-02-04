<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        // 1. Verify Event Type
        if ($request->input('type') !== 'checkout.paid') {
            return response()->json(['message' => 'Ignored event type'], 200);
        }

        $data = $request->input('data');

        // 2. Verify Status
        if (($data['status'] ?? '') !== 'paid') {
            return response()->json(['message' => 'Checkout not paid'], 200);
        }

        // 3. Extract Metadata
        $metadata = $data['metadata'] ?? [];
        $userId = $metadata['user_id'] ?? null;
        $courseId = $metadata['course_id'] ?? null;

        if (! $userId || ! $courseId) {
            // Fallback: Try tracking via metadata if passed differently or log error
            // Potentially we could look up via 'checkout_id' if we stored it, but we didn't in this flow.
            return response()->json(['message' => 'Missing metadata'], 400);
        }

        // 4. Find User and Course
        $user = \App\Models\User::find($userId);
        $course = \App\Models\Course::find($courseId);

        if (! $user || ! $course) {
            return response()->json(['message' => 'User or Course not found'], 404);
        }

        // 5. Create Enrollment
        if (! $user->enrollments()->where('course_id', $course->id)->exists()) {
            $user->enrollments()->create([
                'course_id' => $course->id,
                'is_active' => true,
                // 'payment_id' => $data['id'] ?? null, // optional if we had a column
            ]);

            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\WelcomeEmail($course, $user));
        }

        return response()->json(['message' => 'Webhook handled successfully']);
    }
}
