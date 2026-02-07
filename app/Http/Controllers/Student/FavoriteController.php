<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;

use App\Models\Course;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function toggle(Course $course)
    {
        $user = Auth::user();

        if ($user->favorites()->where('course_id', $course->id)->exists()) {
            $user->favorites()->detach($course->id);
            $message = 'Course removed from favorites.';
        } else {
            $user->favorites()->attach($course->id);
            $message = 'Course added to favorites.';
        }

        return back()->with('success', $message);
    }
}
