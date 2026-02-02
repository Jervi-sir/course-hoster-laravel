<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LessonProgress>
 */
class LessonProgressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $lesson = Lesson::factory()->create();

        return [
            'user_id' => User::factory(),
            'lesson_id' => $lesson->id,
            'course_id' => $lesson->module->course_id,
            'is_completed' => fake()->boolean(),
            'completed_at' => fake()->boolean() ? now() : null,
        ];
    }
}
