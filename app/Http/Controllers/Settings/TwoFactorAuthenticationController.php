<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class TwoFactorAuthenticationController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword')
            ? [new Middleware('password.confirm', only: ['show'])]
            : [];
    }

    /**
     * Show the user's two-factor authentication settings page.
     */
    public function show(Request $request): Response
    {
        if (! Features::enabled(Features::twoFactorAuthentication())) {
            abort(404);
        }

        $this->ensureStateIsValid($request);

        return Inertia::render('settings/two-factor', [
            'twoFactorEnabled' => $request->user()->hasEnabledTwoFactorAuthentication(),
            'requiresConfirmation' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
        ]);
    }

    /**
     * Ensure the two-factor authentication state is valid and handle transitions.
     */
    private function ensureStateIsValid(Request $request): void
    {
        if (! Fortify::confirmsTwoFactorAuthentication()) {
            return;
        }

        $currentTime = time();
        $user = $request->user();
        $session = $request->session();

        if (! $user->hasEnabledTwoFactorAuthentication()) {
            $session->put('two_factor_empty_at', $currentTime);
        }

        if (
            ! is_null($user->two_factor_secret) &&
            is_null($user->two_factor_confirmed_at) &&
            $session->has('two_factor_empty_at') &&
            is_null($session->get('two_factor_confirming_at'))
        ) {
            $session->put('two_factor_confirming_at', $currentTime);
        }

        if (
            ! $session->hasOldInput('code') &&
            is_null($user->two_factor_confirmed_at) &&
            $session->get('two_factor_confirming_at', 0) != $currentTime
        ) {
            app(DisableTwoFactorAuthentication::class)($user);

            $session->put('two_factor_empty_at', $currentTime);
            $session->remove('two_factor_confirming_at');
        }
    }
}
