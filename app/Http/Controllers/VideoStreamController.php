<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VideoStreamController extends Controller
{
    public function stream($path)
    {
        // Ensure we are only serving from the public disk (storage/app/public)
        // encoding is important if paths contain spaces/etc but normally Laravel handles it.

        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        $absolutePath = Storage::disk('public')->path($path);

        return response()->file($absolutePath);
    }
}
