<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Lesson $lesson)
    {
        $request->validate(['content' => 'required|string']);

        $comment = $lesson->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        // Notify Creator
        $creator = $lesson->module->course->creator;
        if ($creator && $creator->id !== auth()->id()) {
            \Illuminate\Support\Facades\Mail::to($creator->email)->send(new \App\Mail\NewCommentNotification($comment));
        }

        return back();
    }
}
