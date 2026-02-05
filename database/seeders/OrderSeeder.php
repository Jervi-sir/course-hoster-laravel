<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Student Users
        $students = User::whereHas('role', function ($query) {
            $query->where('code', 'student');
        })->get();

        $courses = Course::where('status', 'published')->get();

        if ($students->isEmpty() || $courses->isEmpty()) {
            return;
        }

        foreach ($students as $student) {
            // Enroll student in 1-3 random courses
            $randomCourses = $courses->random(min(3, $courses->count()));

            foreach ($randomCourses as $course) {
                // Create Order
                Order::factory()->create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'amount_paid' => $course->price,
                    'status' => 'completed',
                ]);

                // Create Enrollment
                Enrollment::firstOrCreate([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                ]);
            }
        }
    }
}
