<?php

namespace App\Http\Controllers;

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

        return Inertia::render('lessons/show', [
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
