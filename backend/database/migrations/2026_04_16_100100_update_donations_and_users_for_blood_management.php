<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            if (!Schema::hasColumn('donations', 'quantity')) {
                $table->unsignedTinyInteger('quantity')->default(1)->after('donation_date');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'availability_notified_at')) {
                $table->timestamp('availability_notified_at')->nullable()->after('last_donation_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            if (Schema::hasColumn('donations', 'quantity')) {
                $table->dropColumn('quantity');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'availability_notified_at')) {
                $table->dropColumn('availability_notified_at');
            }
        });
    }
};
