<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'course_id' => Course::factory(),
            'transaction_id' => fake()->unique()->uuid(),
            'amount_paid' => fake()->randomFloat(2, 10, 200),
            'currency' => 'DZD',
            'payment_method' => fake()->randomElement(['cibil', 'card', 'edahabia']),
            'status' => fake()->randomElement(['pending', 'completed', 'failed', 'refunded']),
        ];
    }
}
