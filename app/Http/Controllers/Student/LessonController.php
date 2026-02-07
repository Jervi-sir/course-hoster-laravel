<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonController extends Controller
{
    public function learn(Course $course)
    {
        $firstModule = $course->modules()->orderBy('sort_order')->first();

        if (! $firstModule) {
            return redirect()->route('courses.show', $course)->with('error', 'Course has no content.');
        }

        $firstLesson = $firstModule->lessons()->orderBy('sort_order')->first();

        if (! $firstLesson) {
            return redirect()->route('courses.show', $course)->with('error', 'Course has no content.');
        }

        return redirect()->route('lessons.show', ['course' => $course, 'lesson' => $firstLesson]);
    }

    public function show(Course $course, Lesson $lesson)
    {
        $user = auth()->user();

        // Check Enrollment
        if (! $user->enrollments()->where('course_id', $course->id)->where('is_active', true)->exists()) {
            return redirect()->route('courses.show', $course)->with('error', 'You must be enrolled to view this lesson.');
        }

        // Load Course Structure for Sidebar
        $course->load(['modules' => function ($query) {
            $query->orderBy('sort_order');
            $query->with(['lessons' => function ($q) {
                $q->orderBy('sort_order');
            }]);
        }]);

        // Load comments for the lesson
        $lesson->load(['comments.user' => function ($q) {
            $q->select('id', 'name'); // optimize
        }]);

        // Load User Progress for this course (optimization: load all progress for this course at once)
        $courseProgress = LessonProgress::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->get()
            ->keyBy('lesson_id');

        // Attach progress to lessons in memory (not ideal but works for small courses)
        $course->modules->each(function ($module) use ($courseProgress) {
            $module->lessons->each(function ($l) use ($courseProgress) {
                $p = $courseProgress->get($l->id);
                $l->is_completed = $p ? $p->is_completed : false;
            });
        });

        // Current Lesson Progress
        $currentProgress = $courseProgress->get($lesson->id);
        $isCompleted = $currentProgress ? $currentProgress->is_completed : false;

        // Generate Signed HLS Path with IP Binding
        if ($lesson->video_hls_path && $lesson->video_processing_status === 'completed') {
            // Generate a master playlist endpoint that verifies signature
            // We'll assume the route name is 'video.stream' (need to verify/create this name)
            // But wait, the Frontend uses `/video-stream/${lesson.id}/${lesson.id}.m3u8` hardcoded currently.
            // We should pass the FULL URL to the frontend.

            $masterPlaylistUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
                'video.stream',
                now()->addMinutes(180), // 3 hours validity
                [
                    'lesson' => $lesson->id,
                    'filename' => $lesson->id . '.m3u8',
                    'ip' => request()->ip() // Bind to IP
                ]
            );

            // We pass this URL to properties.
            // But we need to overwrite or add a property.
            $lesson->secure_hls_url = $masterPlaylistUrl;
        }

        return Inertia::render('student/lessons/show', [
            'course' => $course,
            'lesson' => $lesson,
            'isCompleted' => $isCompleted,
        ]);
    }

    public function complete(Request $request, Lesson $lesson)
    {
        $user = auth()->user();

        // Needs course_id. Load module to get course_id.
        $lesson->load('module');

        $progress = LessonProgress::firstOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
                'course_id' => $lesson->module->course_id,
            ]
        );

        // Toggle completion
        $isCompleted = ! $progress->is_completed;
        $progress->is_completed = $isCompleted;
        $progress->completed_at = $isCompleted ? now() : null;
        $progress->save();

        return back();
    }
}
