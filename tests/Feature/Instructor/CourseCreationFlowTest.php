<?php

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    Storage::fake('public');
    $this->instructor = User::factory()->create();
});

test('instructor can create a course and is redirected to builder', function () {
    actingAs($this->instructor)
        ->post('/instructor/courses', [
            'title' => 'Test Course',
            'description' => 'Test Description',
            'price' => 99.99,
            'level' => 'beginner',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    assertDatabaseHas('courses', [
        'title' => 'Test Course',
        'creator_id' => $this->instructor->id,
        'status' => 'draft',
    ]);

    $course = Course::where('title', 'Test Course')->first();
    expect($course)->not->toBeNull();
});

test('instructor can add modules to a course', function () {
    $course = Course::factory()->create(['creator_id' => $this->instructor->id]);

    actingAs($this->instructor)
        ->post("/instructor/courses/{$course->id}/modules", [
            'title' => 'Introduction Module',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    assertDatabaseHas('modules', [
        'course_id' => $course->id,
        'title' => 'Introduction Module',
        'sort_order' => 1,
    ]);
});

test('instructor can add lessons to a module', function () {
    $course = Course::factory()->create(['creator_id' => $this->instructor->id]);
    $module = Module::factory()->create(['course_id' => $course->id]);

    actingAs($this->instructor)
        ->post("/instructor/courses/{$course->id}/modules/{$module->id}/lessons", [
            'title' => 'First Lesson',
            'type' => 'video',
            'duration_minutes' => 10,
            'is_preview' => false,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    assertDatabaseHas('lessons', [
        'module_id' => $module->id,
        'title' => 'First Lesson',
        'type' => 'video',
    ]);
});

test('instructor can upload video with lesson', function () {
    $course = Course::factory()->create(['creator_id' => $this->instructor->id]);
    $module = Module::factory()->create(['course_id' => $course->id]);

    $video = UploadedFile::fake()->create('lesson.mp4', 1024);

    actingAs($this->instructor)
        ->post("/instructor/courses/{$course->id}/modules/{$module->id}/lessons", [
            'title' => 'Video Lesson',
            'type' => 'video',
            'video' => $video,
            'duration_minutes' => 15,
        ])
        ->assertRedirect();

    $lesson = Lesson::where('title', 'Video Lesson')->first();
    expect($lesson->video_url)->not->toBeNull();
    expect($lesson->video_provider)->toBe('s3');
});

test('complete course creation flow', function () {
    // Step 1: Create course
    actingAs($this->instructor)
        ->post('/instructor/courses', [
            'title' => 'Complete Course',
            'description' => 'Full course description',
            'price' => 49.99,
            'level' => 'intermediate',
        ]);

    $course = Course::where('title', 'Complete Course')->first();

    // Step 2: Add first module
    actingAs($this->instructor)
        ->post("/instructor/courses/{$course->id}/modules", [
            'title' => 'Module 1',
        ]);

    $module1 = Module::where('title', 'Module 1')->first();

    // Step 3: Add lessons to first module
    actingAs($this->instructor)
        ->post("/instructor/courses/{$course->id}/modules/{$module1->id}/lessons", [
            'title' => 'Lesson 1.1',
            'type' => 'video',
            'duration_minutes' => 10,
        ]);

    actingAs($this->instructor)
        ->post("/instructor/courses/{$course->id}/modules/{$module1->id}/lessons", [
            'title' => 'Lesson 1.2',
            'type' => 'article',
            'content' => 'Article content here',
        ]);

    // Step 4: Add second module
    actingAs($this->instructor)
        ->post("/instructor/courses/{$course->id}/modules", [
            'title' => 'Module 2',
        ]);

    $module2 = Module::where('title', 'Module 2')->first();

    // Step 5: Add lesson to second module
    actingAs($this->instructor)
        ->post("/instructor/courses/{$course->id}/modules/{$module2->id}/lessons", [
            'title' => 'Lesson 2.1',
            'type' => 'video',
            'duration_minutes' => 20,
        ]);

    // Verify structure
    $course->refresh();
    expect($course->modules)->toHaveCount(2);
    expect($module1->lessons)->toHaveCount(2);
    expect($module2->lessons)->toHaveCount(1);
});

test('instructor cannot access another instructors course', function () {
    $otherInstructor = User::factory()->create();
    $course = Course::factory()->create(['creator_id' => $otherInstructor->id]);

    actingAs($this->instructor)
        ->get("/instructor/courses/{$course->id}/builder")
        ->assertForbidden();
});

test('instructor can delete module and its lessons', function () {
    $course = Course::factory()->create(['creator_id' => $this->instructor->id]);
    $module = Module::factory()->create(['course_id' => $course->id]);
    $lesson = Lesson::factory()->create(['module_id' => $module->id]);

    actingAs($this->instructor)
        ->delete("/instructor/courses/{$course->id}/modules/{$module->id}")
        ->assertRedirect();

    expect(Module::find($module->id))->toBeNull();
    expect(Lesson::find($lesson->id))->toBeNull();
});
