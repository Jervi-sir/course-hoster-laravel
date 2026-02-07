<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache; // Added this line
use Symfony\Component\HttpFoundation\StreamedResponse;

class VideoStreamController extends Controller
{
    public function stream(Request $request, $lessonId, $filename)
    {
        $user = auth()->user();
        if (!$user) {
            abort(403);
        }

        // Cache Key: bound to User and Lesson
        $accessKey = 'hls_access_' . $user->id . '_' . $lessonId;

        // MODE 1: Initial Entry (Signed URL)
        if ($request->has('signature')) {
            if (!$request->hasValidSignature()) {
                abort(403, 'Invalid signature.');
            }
            if ($request->query('ip') !== $request->ip()) {
                abort(403, 'IP address mismatch.');
            }

            // Verify Enrollment (Only needed on initial entry)
            $lesson = \App\Models\Lesson::findOrFail($lessonId);
            $isEnrolled = $user->enrollments()
                ->where('course_id', $lesson->module->course_id)
                ->where('is_active', true)
                ->exists();

            $isCreator = $lesson->module->course->creator_id === $user->id;
            $isAdmin = $user->hasRole('admin');

            if (!$isEnrolled && !$isCreator && !$isAdmin) {
                abort(403, 'Not enrolled.');
            }

            // Cache authorization for 3 hours (matches link validity)
            Cache::put($accessKey, $request->ip(), now()->addMinutes(180));
        }
        // MODE 2: Sub-resource / Chunks (Relies on Cached Authorization)
        else {
            $cachedIp = Cache::get($accessKey);

            if (!$cachedIp || $cachedIp !== $request->ip()) {
                abort(403, 'Session expired or IP mismatch. Please refresh the page.');
            }
        }

        // Serve File
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
