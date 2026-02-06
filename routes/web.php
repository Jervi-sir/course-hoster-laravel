<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\VideoStreamController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


// Custom Authentication Routes
use App\Http\Controllers\AuthenticationController;

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticationController::class, 'login'])->name('login');
    Route::post('login', [AuthenticationController::class, 'authenticate'])->name('login.store');

    Route::get('register', [AuthenticationController::class, 'register'])->name('register');
    Route::post('register', [AuthenticationController::class, 'storeRegister'])->name('register.store');
});

Route::post('logout', [AuthenticationController::class, 'logout'])->name('logout')->middleware('auth');

require __DIR__ . '/web/auth.php';
// require __DIR__ . '/web/student.php';
require __DIR__ . '/web/admin.php';

require __DIR__ . '/settings.php';


Route::get('/video-stream/{lesson}/{filename}', [VideoStreamController::class, 'stream'])
    ->middleware(['auth', 'verified'])
    ->name('video.stream');
