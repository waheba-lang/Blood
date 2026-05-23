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
        Schema::table('campaigns', function (Blueprint $table) {
            $table->string('organizer_name')->nullable();
            $table->string('city')->nullable();
            $table->string('start_time')->nullable();
            $table->string('end_time')->nullable();
            $table->string('contact_info')->nullable();
            $table->json('blood_types')->nullable(); // stored as JSON array ["A+", "O-"]
            $table->string('image_path')->nullable();
            $table->enum('status', ['upcoming', 'ongoing', 'completed'])->default('upcoming');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn([
                'organizer_name', 'city', 'start_time', 'end_time', 
                'contact_info', 'blood_types', 'image_path', 'status'
            ]);
        });
    }
};
