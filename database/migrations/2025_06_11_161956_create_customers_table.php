<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('phone', 20)->unique(); // NOT NULL + UNIQUE
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->date('date_of_birth')->nullable();

            $table->enum('gender', ['male', 'female'])->nullable();

            $table->integer('points')->default(0);
            $table->decimal('total_spent', 15, 2)->default(0);
            $table->integer('visit_count')->default(0);
            $table->timestamp('last_visit')->nullable();

            $table->enum('registration_type', ['self', 'cashier', 'auto'])->default('auto');

            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
