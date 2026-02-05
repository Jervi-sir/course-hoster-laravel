<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Admin User
        $admin = User::where('email', 'admin@example.com')->first();
        if (! $admin) {
            // Fallback if admin wasn't created (though UserSeeder should have run)
            return;
        }

        // Create Categories
        $categories = ['Development', 'Business', 'Finance', 'Design', 'Marketing'];
        $categoryModels = [];

        foreach ($categories as $categoryName) {
            $categoryModels[] = Category::firstOrCreate(
                ['slug' => Str::slug($categoryName)],
                ['name' => $categoryName]
            );
        }

        return;

        // Create Courses
        foreach ($categoryModels as $category) {
            $courses = Course::factory()->count(3)->create([
                'creator_id' => $admin->id,
                'category_id' => $category->id,
                'status' => 'published',
            ]);

            foreach ($courses as $course) {
                // Create Modules
                $modules = Module::factory()->count(4)->create([
                    'course_id' => $course->id,
                ]);

                foreach ($modules as $module) {
                    // Create Lessons
                    Lesson::factory()->count(5)->create([
                        'module_id' => $module->id,
                    ]);
                }
            }
        }
    }
}
