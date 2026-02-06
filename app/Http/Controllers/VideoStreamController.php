<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VideoStreamController extends Controller
{
    public function stream(Request $request, $lessonId, $filename)
    {
        $user = auth()->user();
        if (!$user) {
            abort(403);
        }

        $lesson = \App\Models\Lesson::findOrFail($lessonId);

        // Check enrollment
        $isEnrolled = $user->enrollments()
            ->where('course_id', $lesson->module->course_id)
            ->where('is_active', true)
            ->exists();

        // Also allow instructor/admin who owns the course to view
        // TODO: Add proper policy check here

        if (!$isEnrolled) {
            abort(403);
        }

        // Path in private storage
        $path = "courses/hls/{$lessonId}/{$filename}";

        if (!Storage::disk('local')->exists($path)) {
            abort(404);
        }

        $headers = [];
        if (str_ends_with($filename, '.m3u8')) {
            $headers['Content-Type'] = 'application/vnd.apple.mpegurl';
        } elseif (str_ends_with($filename, '.ts')) {
            $headers['Content-Type'] = 'video/MP2T';
        }

        return response()->file(Storage::disk('local')->path($path), $headers);
    }
}
