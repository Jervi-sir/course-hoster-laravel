<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $studentRole = Role::where('code', 'student')->first();
        $students = User::where('role_id', $studentRole->id)->get();
        $courses = Course::all();

        if ($courses->isEmpty() || $students->isEmpty()) {
            return;
        }

        // Each student creates 1-3 orders/enrollments
        foreach ($students as $student) {
            $randomCourses = $courses->random(random_int(1, 3));

            foreach ($randomCourses as $course) {
                // Create Order
                Order::factory()->create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'status' => 'completed',
                ]);

                // Create Enrollment
                Enrollment::factory()->create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                ]);
            }
        }
    }
}
