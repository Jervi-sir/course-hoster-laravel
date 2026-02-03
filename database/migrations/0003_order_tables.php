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
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->timestamp('enrolled_at')->useCurrent();
            $table->timestamp('expires_at')->nullable(); // Useful for subscriptions
            $table->boolean('is_active')->default(true);

            $table->unique(['user_id', 'course_id']); // Prevent double enrollment
            $table->timestamps();
        });
        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade'); // Redundant but fast for queries
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Index for fast progress bar calculations
            $table->index(['user_id', 'course_id']);
        });
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('course_id')->constrained();
            $table->string('transaction_id')->unique(); // ID from Stripe/Chargily
            $table->decimal('amount_paid', 10, 2);
            $table->string('currency', 3)->default('DZD');
            $table->string('payment_method')->nullable(); // cibil, card, edahabia
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Enrollments');
        Schema::dropIfExists('lesson_progress');
        Schema::dropIfExists('orders');
    }
};
