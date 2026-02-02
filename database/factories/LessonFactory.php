<?php

namespace Database\Factories;

use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lesson>
 */
class LessonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence();

        return [
            'module_id' => Module::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::random(5),
            'type' => fake()->randomElement(['video', 'article', 'quiz', 'file']),
            'content' => fake()->paragraphs(3, true),
            'video_url' => fake()->url(),
            'video_provider' => 's3',
            'duration_minutes' => fake()->numberBetween(5, 60),
            'sort_order' => fake()->numberBetween(0, 100),
            'is_preview' => fake()->boolean(20),
        ];
    }
}
