<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreLessonRequest;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Support\Str;

class LessonController extends Controller
{
    public function store(StoreLessonRequest $request, Course $course, Module $module)
    {
        abort_unless($course->creator_id === auth()->id(), 403);
        abort_unless($module->course_id === $course->id, 404);

        $data = $request->validated();
        $data['module_id'] = $module->id;
        $data['slug'] = Str::slug($data['title']);

        // Auto-increment sort_order
        $data['sort_order'] = $module->lessons()->max('sort_order') + 1;

        // Handle video upload if provided
        if ($request->hasFile('video')) {
            $data['video_url'] = $request->file('video')->store('courses/videos', 'public');
            $data['video_provider'] = 's3';
            unset($data['video']); // Remove the file from data array
        }

        $lesson = Lesson::create($data);

        return back()->with('success', 'Lesson added successfully.');
    }

    public function update(StoreLessonRequest $request, Course $course, Module $module, Lesson $lesson)
    {
        abort_unless($course->creator_id === auth()->id(), 403);
        abort_unless($module->course_id === $course->id, 404);
        abort_unless($lesson->module_id === $module->id, 404);

        $data = $request->validated();

        if ($lesson->title !== $data['title']) {
            $data['slug'] = Str::slug($data['title']);
        }

        // Handle video upload if provided
        if ($request->hasFile('video')) {
            $data['video_url'] = $request->file('video')->store('courses/videos', 'public');
            $data['video_provider'] = 's3';
            unset($data['video']); // Remove the file from data array
        }

        $lesson->update($data);

        return back()->with('success', 'Lesson updated successfully.');
    }

    public function destroy(Course $course, Module $module, Lesson $lesson)
    {
        abort_unless($course->creator_id === auth()->id(), 403);
        abort_unless($module->course_id === $course->id, 404);
        abort_unless($lesson->module_id === $module->id, 404);

        $lesson->delete();

        return back()->with('success', 'Lesson deleted successfully.');
    }

    public function reorder(Course $course, Module $module)
    {
        abort_unless($course->creator_id === auth()->id(), 403);
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
