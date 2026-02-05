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
        $studentRole = Role::where('code', 'student')->first();

        // Create Admin User
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'password_plaintext' => 'password',
                'role_id' => $adminRole->id,
            ]
        );

        // Create Student User
        User::firstOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'Student User',
                'password' => Hash::make('password'),
                'password_plaintext' => 'password',
                'role_id' => $studentRole->id,
            ]
        );

        // Create some random students
        User::factory()->count(10)->create([
            'role_id' => $studentRole->id,
        ]);
    }
}
