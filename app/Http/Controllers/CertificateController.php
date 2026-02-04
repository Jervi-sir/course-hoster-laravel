<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\LessonProgress;
use Illuminate\Support\Facades\Auth;

class CertificateController extends Controller
{
    public function download(Course $course)
    {
        $user = Auth::user();

        // 1. Check enrollment
        $enrolled = $user->enrollments()
            ->where('course_id', $course->id)
            ->where('is_active', true)
            ->exists();

        if (! $enrolled) {
            abort(403, 'You are not enrolled in this course.');
        }

        // 2. Check completion
        $totalLessons = $course->lessons()->count();
        $completedLessons = LessonProgress::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('is_completed', true)
            ->count();

        // Ensure strictly 100% completion
        if ($totalLessons === 0 || $completedLessons < $totalLessons) {
            return back()->with('error', 'You must complete all lessons to get the certificate.');
        }

        // 3. Return View (Simple HTML Certificate)
        return view('certificates.show', [
            'user' => $user,
            'course' => $course,
            'date' => now()->format('F j, Y'),
            'id' => strtoupper(substr(md5($user->id.$course->id.'cert'), 0, 10)),
        ]);
    }
}
