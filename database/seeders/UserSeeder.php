<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('code', 'admin')->first();
        $instructorRole = Role::where('code', 'instructor')->first();
        $studentRole = Role::where('code', 'student')->first();

        // Admin
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
        ]);

        // Instructor
        User::factory()->create([
            'name' => 'Instructor User',
            'email' => 'instructor@example.com',
            'password' => Hash::make('password'),
            'role_id' => $instructorRole->id,
        ]);

        // Student
        User::factory()->create([
            'name' => 'Student User',
            'email' => 'student@example.com',
            'password' => Hash::make('password'),
            'role_id' => $studentRole->id,
        ]);

        // Random users
        User::factory(10)->create([
            'role_id' => $studentRole->id,
        ]);

        User::factory(5)->create([
            'role_id' => $instructorRole->id,
        ]);
    }
}
