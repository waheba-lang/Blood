<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blood_stock', function (Blueprint $table) {
            $table->id();
            $table->string('blood_type')->unique();
            $table->unsignedInteger('quantity')->default(0);
            $table->timestamps();
        });

        $types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        $now = now();
        $rows = array_map(fn ($type) => [
            'blood_type' => $type,
            'quantity' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ], $types);

        DB::table('blood_stock')->insert($rows);
    }

    public function down(): void
    {
        Schema::dropIfExists('blood_stock');
    }
};
