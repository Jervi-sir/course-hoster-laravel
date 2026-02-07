<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        $orders = Auth::user()->orders()
            ->with(['course'])
            ->latest()
            ->paginate(10);

        return Inertia::render('student/purchases/index', [
            'orders' => $orders,
        ]);
    }
}
