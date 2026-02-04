<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreModuleRequest;
use App\Models\Course;
use App\Models\Module;

class ModuleController extends Controller
{
    public function store(StoreModuleRequest $request, Course $course)
    {
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }

        $data = $request->validated();
        $data['course_id'] = $course->id;

        // Auto-increment sort_order
        $data['sort_order'] = $course->modules()->max('sort_order') + 1;

        $module = Module::create($data);

        return back()->with('success', 'Module added successfully.');
    }

    public function update(StoreModuleRequest $request, Course $course, Module $module)
    {
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }
        abort_unless($module->course_id === $course->id, 404);

        $module->update($request->validated());

        return back()->with('success', 'Module updated successfully.');
    }

    public function destroy(Course $course, Module $module)
    {
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }
        abort_unless($module->course_id === $course->id, 404);

        $module->delete();

        return back()->with('success', 'Module deleted successfully.');
    }

    public function reorder(Course $course)
    {
        if (! auth()->user()->hasRole('admin')) {
            abort_unless($course->creator_id === auth()->id(), 403);
        }

        $order = request()->validate([
            'modules' => 'required|array',
            'modules.*.id' => 'required|exists:modules,id',
            'modules.*.sort_order' => 'required|integer',
        ]);

        foreach ($order['modules'] as $moduleData) {
            Module::where('id', $moduleData['id'])
                ->where('course_id', $course->id)
                ->update(['sort_order' => $moduleData['sort_order']]);
        }

        return back()->with('success', 'Modules reordered successfully.');
    }
}
