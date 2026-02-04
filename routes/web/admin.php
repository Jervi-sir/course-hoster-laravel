<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:instructor,admin'])->prefix('instructor')->as('instructor.')->group(function () {
    // Course Management
    Route::get('/courses', [\App\Http\Controllers\Instructor\CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/create', [\App\Http\Controllers\Instructor\CourseController::class, 'create'])->name('courses.create');
    Route::post('/courses', [\App\Http\Controllers\Instructor\CourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}/builder', [\App\Http\Controllers\Instructor\CourseController::class, 'builder'])->name('courses.builder');
    Route::get('/courses/{course}/edit', [\App\Http\Controllers\Instructor\CourseController::class, 'edit'])->name('courses.edit');
    Route::put('/courses/{course}', [\App\Http\Controllers\Instructor\CourseController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{course}', [\App\Http\Controllers\Instructor\CourseController::class, 'destroy'])->name('courses.destroy');

    // Module Management
    Route::post('/courses/{course}/modules', [\App\Http\Controllers\Instructor\ModuleController::class, 'store'])->name('courses.modules.store');
    Route::put('/courses/{course}/modules/{module}', [\App\Http\Controllers\Instructor\ModuleController::class, 'update'])->name('courses.modules.update');
    Route::delete('/courses/{course}/modules/{module}', [\App\Http\Controllers\Instructor\ModuleController::class, 'destroy'])->name('courses.modules.destroy');
    Route::post('/courses/{course}/modules/reorder', [\App\Http\Controllers\Instructor\ModuleController::class, 'reorder'])->name('courses.modules.reorder');

    // Lesson Management
    Route::post('/courses/{course}/modules/{module}/lessons', [\App\Http\Controllers\Instructor\LessonController::class, 'store'])->name('courses.modules.lessons.store');
    Route::put('/courses/{course}/modules/{module}/lessons/{lesson}', [\App\Http\Controllers\Instructor\LessonController::class, 'update'])->name('courses.modules.lessons.update');
    Route::delete('/courses/{course}/modules/{module}/lessons/{lesson}', [\App\Http\Controllers\Instructor\LessonController::class, 'destroy'])->name('courses.modules.lessons.destroy');
    Route::post('/courses/{course}/modules/{module}/lessons/reorder', [\App\Http\Controllers\Instructor\LessonController::class, 'reorder'])->name('courses.modules.lessons.reorder');
});

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);

    // Course Management
    Route::get('/courses/{course}/builder', [\App\Http\Controllers\Admin\CourseController::class, 'builder'])->name('courses.builder');
    Route::resource('courses', \App\Http\Controllers\Admin\CourseController::class);

    // Reuse Instructor Controllers for Modules/Lessons but with admin route names
    Route::post('/courses/{course}/modules', [\App\Http\Controllers\Instructor\ModuleController::class, 'store'])->name('courses.modules.store');
    Route::put('/courses/{course}/modules/{module}', [\App\Http\Controllers\Instructor\ModuleController::class, 'update'])->name('courses.modules.update');
    Route::delete('/courses/{course}/modules/{module}', [\App\Http\Controllers\Instructor\ModuleController::class, 'destroy'])->name('courses.modules.destroy');
    Route::post('/courses/{course}/modules/reorder', [\App\Http\Controllers\Instructor\ModuleController::class, 'reorder'])->name('courses.modules.reorder');

    Route::post('/courses/{course}/modules/{module}/lessons', [\App\Http\Controllers\Instructor\LessonController::class, 'store'])->name('courses.modules.lessons.store');
    Route::put('/courses/{course}/modules/{module}/lessons/{lesson}', [\App\Http\Controllers\Instructor\LessonController::class, 'update'])->name('courses.modules.lessons.update');
    Route::delete('/courses/{course}/modules/{module}/lessons/{lesson}', [\App\Http\Controllers\Instructor\LessonController::class, 'destroy'])->name('courses.modules.lessons.destroy');
    Route::post('/courses/{course}/modules/{module}/lessons/reorder', [\App\Http\Controllers\Instructor\LessonController::class, 'reorder'])->name('courses.modules.lessons.reorder');
});
