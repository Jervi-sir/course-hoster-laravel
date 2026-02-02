<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $instructorRole = Role::where('code', 'instructor')->first();

        // Get instructors or create some if none exist (though UserSeeder should have handled it)
        $instructors = User::where('role_id', $instructorRole->id)->get();

        if ($instructors->isEmpty()) {
            $instructors = User::factory(3)->create(['role_id' => $instructorRole->id]);
        }

        foreach ($instructors as $instructor) {
            // Create 5 courses for each instructor
            $courses = Course::factory(5)->create(['creator_id' => $instructor->id]);

            foreach ($courses as $course) {
                // Create 3-6 modules per course
                $modules = Module::factory(random_int(3, 6))->create(['course_id' => $course->id]);

                foreach ($modules as $module) {
                    // Create 3-8 lessons per module
                    Lesson::factory(random_int(3, 8))->create([
                        'module_id' => $module->id,
                    ]);
                }
            }
        }
    }
}
