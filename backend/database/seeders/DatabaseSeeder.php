<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            MoroccanUsersSeeder::class,
            BloodManagementDemoSeeder::class,
            CampaignSeeder::class,
        ]);
    }
}
