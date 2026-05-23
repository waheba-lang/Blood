<?php

namespace Database\Seeders;

use App\Models\Campaign;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        $campaigns = [
            [
                'title' => 'Ramadan Special Drive',
                'date' => Carbon::now()->addDays(15)->toDateString(),
                'time' => '09:00 - 18:00',
                'location' => 'Place Mohammed V, Casablanca',
                'description' => 'A special donation drive during the holy month of Ramadan to replenish our stocks.',
                'target' => 500,
                'current' => 120,
            ],
            [
                'title' => 'University Blood Drive',
                'date' => Carbon::now()->addDays(5)->toDateString(),
                'time' => '10:00 - 16:00',
                'location' => 'UMP University, Oujda',
                'description' => 'Mobile unit will be at the student center. Come join us and save lives!',
                'target' => 150,
                'current' => 45,
            ],
            [
                'title' => 'Emergency Stock Refill',
                'date' => Carbon::now()->subDays(2)->toDateString(),
                'time' => 'Full Day',
                'location' => 'Central Hospital, Rabat',
                'description' => 'Emergency drive to address the shortage of O- blood type.',
                'target' => 300,
                'current' => 280,
            ],
            [
                'title' => 'Summer Solidarity',
                'date' => Carbon::now()->addMonths(2)->toDateString(),
                'time' => '10:00 - 20:00',
                'location' => 'Marina, Agadir',
                'description' => 'Donating blood during summer is crucial for local clinics.',
                'target' => 200,
                'current' => 0,
            ],
        ];

        foreach ($campaigns as $campaign) {
            Campaign::firstOrCreate(
                ['title' => $campaign['title'], 'date' => $campaign['date']],
                $campaign
            );
        }
    }
}
