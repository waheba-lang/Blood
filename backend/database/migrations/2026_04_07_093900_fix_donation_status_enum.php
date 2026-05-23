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
        // SQLite doesn't support modifying enum directly, we would need to recreate the table.
        // But for this purpose, we can just let it be or handle it via code.
        // However, if we want to be clean:
        // Since we are using SQLite, we can't easily change the column type.
        // But we can add the 'Confirmed' action in the controller.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
