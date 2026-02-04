<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/webhook/chargilypay', [\App\Http\Controllers\WebhookController::class, 'handle']);
