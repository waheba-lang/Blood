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
        Schema::create('donation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Patient
            $table->string('patient_name')->nullable();
            $table->string('blood_type');
            $table->integer('quantity'); // bags
            $table->enum('urgency', ['Normal', 'Urgent', 'Critical'])->default('Normal');
            $table->string('hospital');
            $table->string('city');
            $table->text('contact_note')->nullable();
            $table->enum('status', ['Open', 'In Progress', 'Completed', 'Cancelled'])->default('Open');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donation_requests');
    }
};
