<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Remove legacy blood-request flow: comments, donation_requests, app notifications,
     * and the optional donations.donation_request_id FK.
     */
    public function up(): void
    {
        Schema::dropIfExists('comments');

        if (Schema::hasTable('donations') && Schema::hasColumn('donations', 'donation_request_id')) {
            Schema::table('donations', function (Blueprint $table) {
                $table->dropForeign(['donation_request_id']);
            });
            Schema::table('donations', function (Blueprint $table) {
                $table->dropColumn('donation_request_id');
            });
        }

        Schema::dropIfExists('donation_requests');
        Schema::dropIfExists('notifications');
    }

    public function down(): void
    {
        // Intentionally empty: legacy schema is not restored.
    }
};
