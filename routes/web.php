<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Course Routes
    Route::get('/courses', [\App\Http\Controllers\CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/{course:slug}', [\App\Http\Controllers\CourseController::class, 'show'])->name('courses.show');
    Route::post('/courses/{course}/enroll', [\App\Http\Controllers\EnrollmentController::class, 'store'])->name('courses.enroll');

    // Learning Interface
    Route::get('/courses/{course:slug}/learn', [\App\Http\Controllers\CourseController::class, 'learn'])->name('courses.learn');
    Route::get('/courses/{course:slug}/lessons/{lesson:slug}', [\App\Http\Controllers\LessonController::class, 'show'])->name('lessons.show');
    Route::post('/lessons/{lesson}/complete', [\App\Http\Controllers\LessonController::class, 'complete'])->name('lessons.complete');
    Route::post('/lessons/{lesson}/comments', [\App\Http\Controllers\CommentController::class, 'store'])->name('comments.store');
});

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
    Route::resource('courses', \App\Http\Controllers\Admin\CourseController::class);
});


require __DIR__ . '/settings.php';
