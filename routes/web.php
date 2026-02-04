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
    Route::get('instructor/dashboard', [\App\Http\Controllers\InstructorDashboardController::class, 'index'])->name('instructor.dashboard');

    // Course Routes
    Route::get('/courses', [\App\Http\Controllers\CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/{course:slug}', [\App\Http\Controllers\CourseController::class, 'show'])->name('courses.show');

    // Checkout Flow
    Route::get('/courses/{course:slug}/checkout', [\App\Http\Controllers\CheckoutController::class, 'show'])->name('courses.checkout');
    Route::post('/courses/{course}/pay', [\App\Http\Controllers\CheckoutController::class, 'store'])->name('courses.pay');

    // Payment Callbacks
    Route::get('/payment/success', [\App\Http\Controllers\PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/failure', [\App\Http\Controllers\PaymentController::class, 'failure'])->name('payment.failure');

    // Purchase History
    Route::get('/purchases', [\App\Http\Controllers\PurchaseController::class, 'index'])->name('purchases.index');

    // Certificates
    Route::get('/courses/{course}/certificate', [\App\Http\Controllers\CertificateController::class, 'download'])->name('courses.certificate');

    // Learning Interface
    Route::middleware('enrolled')->group(function () {
        Route::get('/courses/{course:slug}/learn', [\App\Http\Controllers\LessonController::class, 'learn'])->name('courses.learn');
        Route::get('/courses/{course:slug}/lessons/{lesson:slug}', [\App\Http\Controllers\LessonController::class, 'show'])->name('lessons.show');
    });
    Route::post('/lessons/{lesson}/complete', [\App\Http\Controllers\LessonController::class, 'complete'])->name('lessons.complete');
    Route::post('/lessons/{lesson}/comments', [\App\Http\Controllers\CommentController::class, 'store'])->name('comments.store');

    // Favorites
    Route::post('/courses/{course}/favorite', [\App\Http\Controllers\FavoriteController::class, 'toggle'])->name('courses.favorite');

    // Reviews
    Route::post('/courses/{course}/reviews', [\App\Http\Controllers\ReviewController::class, 'store'])->name('courses.reviews.store');
});

// Instructor Routes
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
});

require __DIR__ . '/settings.php';
