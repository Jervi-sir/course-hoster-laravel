<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Jobs\ProcessHlsVideo;

class LessonController extends Controller
{
    public function store(Request $request, Course $course, Module $module)
    {
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }
        abort_unless($module->course_id === $course->id, 404);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:video,article,quiz,file'],
            'content' => ['nullable', 'string'],
            'video' => ['nullable', 'file', 'mimes:mp4,mov,avi,wmv', 'max:1048576'], // 1GB max
            'video_url' => ['nullable', 'string'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'is_preview' => ['nullable', 'boolean'],
        ], [
            'title.required' => 'Please provide a lesson title.',
            'type.required' => 'Please select a lesson type.',
            'video.mimes' => 'Video must be in MP4, MOV, AVI, or WMV format.',
            'video.max' => 'Video size cannot exceed 100MB.',
        ]);
        $data['module_id'] = $module->id;
        $data['slug'] = Str::slug($data['title']);

        // Auto-increment sort_order
        $data['sort_order'] = $module->lessons()->max('sort_order') + 1;

        // Handle video upload if provided
        $videoPath = null;
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('courses/videos', 'local');
            $data['video_url'] = null;
            $data['video_provider'] = 'local';
            unset($data['video']); // Remove the file from data array
        }

        $lesson = Lesson::create($data);

        if ($videoPath) {
            ProcessHlsVideo::dispatch($lesson, $videoPath);
        }

        return back()->with('success', 'Lesson added successfully.');
    }

    public function update(Request $request, Course $course, Module $module, Lesson $lesson)
    {
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }
        abort_unless($module->course_id === $course->id, 404);
        abort_unless($lesson->module_id === $module->id, 404);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:video,article,quiz,file'],
            'content' => ['nullable', 'string'],
            'video' => ['nullable', 'file', 'mimes:mp4,mov,avi,wmv', 'max:1048576'], // 1GB max
            'video_url' => ['nullable', 'string'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'is_preview' => ['nullable', 'boolean'],
        ], [
            'title.required' => 'Please provide a lesson title.',
            'type.required' => 'Please select a lesson type.',
            'video.mimes' => 'Video must be in MP4, MOV, AVI, or WMV format.',
            'video.max' => 'Video size cannot exceed 100MB.',
        ]);

        if ($lesson->title !== $data['title']) {
            $data['slug'] = Str::slug($data['title']);
        }

        // Handle video upload if provided
        $videoPath = null;
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('courses/videos', 'local');
            $data['video_url'] = null;
            $data['video_provider'] = 'local';
            unset($data['video']); // Remove the file from data array
        }

        $lesson->update($data);

        if ($videoPath) {
            ProcessHlsVideo::dispatch($lesson, $videoPath);
        }

        return back()->with('success', 'Lesson updated successfully.');
    }

    public function destroy(Course $course, Module $module, Lesson $lesson)
    {
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }
        abort_unless($module->course_id === $course->id, 404);
        abort_unless($lesson->module_id === $module->id, 404);

        $lesson->delete();

        return back()->with('success', 'Lesson deleted successfully.');
    }

    public function reorder(Course $course, Module $module)
    {
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }
        abort_unless($module->course_id === $course->id, 404);

        $order = request()->validate([
            'lessons' => 'required|array',
            'lessons.*.id' => 'required|exists:lessons,id',
            'lessons.*.sort_order' => 'required|integer',
        ]);

        foreach ($order['lessons'] as $lessonData) {
            Lesson::where('id', $lessonData['id'])
                ->where('module_id', $module->id)
                ->update(['sort_order' => $lessonData['sort_order']]);
        }

        return back()->with('success', 'Lessons reordered successfully.');
    }
}
