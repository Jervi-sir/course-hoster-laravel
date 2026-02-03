<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Lesson;

class CommentController extends Controller
{
    public function store(Request $request, Lesson $lesson)
    {
        $request->validate(['content' => 'required|string']);

        $lesson->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content
        ]);

        return back();
    }
}
