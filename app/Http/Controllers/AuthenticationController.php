<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class AuthenticationController extends Controller
{
    /**
     * Display the login view.
     */
    public function login()
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'), // Changed from feature check to route check
            'status' => session('status'),
            'canRegister' => Route::has('register'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function authenticate(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($request->only('email', 'password'), true)) {
            $request->session()->regenerate();

            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors([
            'email' => __('The provided credentials do not match our records.'),
        ])->onlyInput('email');
    }

    /**
     * Display the registration view.
     */
    public function register()
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function storeRegister(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'password_plaintext' => ['nullable', 'string'], // Optional as per user logic
        ]);

        $studentRole = Role::where('code', 'student')->first();

        // Fallback for role just in case
        $roleId = $studentRole ? $studentRole->id : 1;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'password_plaintext' => $request->password, // Keeping user's request
            'role_id' => $roleId,
        ]);

        Auth::login($user);

        return redirect(route('dashboard'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
