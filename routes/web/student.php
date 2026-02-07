<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
    Route::get('instructor/dashboard', [\App\Http\Controllers\InstructorDashboardController::class, 'index'])->name('instructor.dashboard');
    // Course Routes
    Route::get('/courses', [\App\Http\Controllers\Student\CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/{course:slug}', [\App\Http\Controllers\Student\CourseController::class, 'show'])->name('courses.show');
    // Checkout Flow
    Route::get('/courses/{course:slug}/checkout', [\App\Http\Controllers\Student\CheckoutController::class, 'show'])->name('courses.checkout');
    Route::post('/courses/{course}/pay', [\App\Http\Controllers\Student\CheckoutController::class, 'store'])->name('courses.pay');
    // Payment Callbacks
    Route::get('/payment/success', [\App\Http\Controllers\Student\PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/failure', [\App\Http\Controllers\Student\PaymentController::class, 'failure'])->name('payment.failure');
    // Purchase History
    Route::get('/purchases', [\App\Http\Controllers\Student\PurchaseController::class, 'index'])->name('purchases.index');
    // Certificates
    Route::get('/courses/{course}/certificate', [\App\Http\Controllers\Student\CertificateController::class, 'download'])->name('courses.certificate');
    // Learning Interface
    Route::middleware('enrolled')->group(function () {
        Route::get('/courses/{course:slug}/learn', [\App\Http\Controllers\Student\LessonController::class, 'learn'])->name('courses.learn');
        Route::get('/courses/{course:slug}/lessons/{lesson:slug}', [\App\Http\Controllers\Student\LessonController::class, 'show'])->name('lessons.show');
    });
    Route::post('/lessons/{lesson}/complete', [\App\Http\Controllers\Student\LessonController::class, 'complete'])->name('lessons.complete');
    Route::post('/lessons/{lesson}/comments', [\App\Http\Controllers\Student\CommentController::class, 'store'])->name('comments.store');
    // Favorites
    Route::post('/courses/{course}/favorite', [\App\Http\Controllers\Student\FavoriteController::class, 'toggle'])->name('courses.favorite');
    // Reviews
    Route::post('/courses/{course}/reviews', [\App\Http\Controllers\Student\ReviewController::class, 'store'])->name('courses.reviews.store');
});
