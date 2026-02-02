<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->decimal('price', 10, 2)->default(0.00);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->string('level')->default('beginner'); // beginner, intermediate, advanced
            $table->timestamps();
            $table->softDeletes(); // Better for stability
        });
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug');
            $table->enum('type', ['video', 'article', 'quiz', 'file'])->default('video');

            // Content Columns
            $table->longText('content')->nullable(); // For articles/text
            $table->string('video_url')->nullable();
            $table->string('video_provider')->default('s3'); // s3, vimeo, youtube, mux
            $table->integer('duration_minutes')->default(0);

            $table->integer('sort_order')->default(0);
            $table->boolean('is_preview')->default(false); // For free sample lessons
            $table->timestamps();

            $table->unique(['module_id', 'slug']); // SEO stability
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
        Schema::dropIfExists('modules');
        Schema::dropIfExists('lessons');
    }
};
