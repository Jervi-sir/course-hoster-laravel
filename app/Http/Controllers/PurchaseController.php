<?php

namespace App\Http\Controllers;

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

        return Inertia::render('purchases/index', [
            'orders' => $orders,
        ]);
    }
}
