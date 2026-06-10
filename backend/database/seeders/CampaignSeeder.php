<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch organizers
        $org1 = User::where('email', 'organizer@bloodconnect.com')->first();
        $org2 = User::where('email', 'dr.idrissi@bloodconnect.com')->first();
        $admin = User::where('role', 'admin')->first();

        $orgId1 = $org1 ? $org1->id : ($admin ? $admin->id : null);
        $orgId2 = $org2 ? $org2->id : ($admin ? $admin->id : null);

        // Delete existing participants & campaigns
        DB::table('campaign_participants')->truncate();
        Campaign::query()->delete();

        $campaignData = [
            [
                'title' => 'Collecte Spéciale Ramadan',
                'date' => Carbon::now()->addDays(15)->toDateString(),
                'start_time' => '19:00',
                'end_time' => '23:30',
                'time' => '19:00 - 23:30',
                'location' => 'Place Mohammed V, devant la Wilaya',
                'city' => 'Casablanca',
                'description' => 'Collecte de sang nocturne spéciale pendant le mois sacré du Ramadan pour compenser la baisse des dons en journée et reconstituer les réserves d\'urgence.',
                'target' => 300,
                'organizer_name' => 'Association Al Amal Oujda',
                'contact_info' => '+212620304050',
                'blood_types' => ['O+', 'O-', 'A+', 'A-', 'B+', 'B-'],
                'status' => 'upcoming',
                'approval_status' => 'approved',
                'user_id' => $orgId1,
            ],
            [
                'title' => 'Campagne Universitaire - UMP',
                'date' => Carbon::now()->addDays(4)->toDateString(),
                'start_time' => '09:00',
                'end_time' => '17:00',
                'time' => '09:00 - 17:00',
                'location' => 'Maison de l\'Étudiant, Université Mohammed Premier',
                'city' => 'Oujda',
                'description' => 'Grande collecte étudiante ouverte à tous les départements. Venez nombreux montrer votre solidarité et sauver des vies !',
                'target' => 150,
                'organizer_name' => 'Association Al Amal Oujda',
                'contact_info' => '+212620304050',
                'blood_types' => ['A+', 'A-', 'B+', 'O+', 'O-', 'AB+'],
                'status' => 'upcoming',
                'approval_status' => 'approved',
                'user_id' => $orgId1,
            ],
            [
                'title' => 'Urgence Réserves Négatives',
                'date' => Carbon::now()->subDays(3)->toDateString(),
                'start_time' => '08:00',
                'end_time' => '18:00',
                'time' => '08:00 - 18:00',
                'location' => 'Centre Régional de Transfusion Sanguine, CHU Ibn Sina',
                'city' => 'Rabat',
                'description' => 'Mobilisation d\'urgence pour pallier la pénurie critique de rhésus négatifs (O-, A-, B-). Tous les donneurs de ces groupes sont invités à se présenter.',
                'target' => 200,
                'organizer_name' => 'Dr. Rachid Idrissi (Croissant Rouge)',
                'contact_info' => '+212630405060',
                'blood_types' => ['O-', 'A-', 'B-', 'AB-'],
                'status' => 'completed',
                'approval_status' => 'approved',
                'user_id' => $orgId2,
            ],
            [
                'title' => 'Solidarité Estivale Agadir',
                'date' => Carbon::now()->addMonths(2)->toDateString(),
                'start_time' => '10:00',
                'end_time' => '20:00',
                'time' => '10:00 - 20:00',
                'location' => 'Esplanade de la Marina d\'Agadir',
                'city' => 'Agadir',
                'description' => 'Collecte d\'été à destination des vacanciers et résidents. Assurer la continuité des stocks durant la période estivale est primordial pour la région.',
                'target' => 250,
                'organizer_name' => 'Dr. Rachid Idrissi (Croissant Rouge)',
                'contact_info' => '+212630405060',
                'blood_types' => ['O+', 'A+', 'B+', 'AB+', 'O-'],
                'status' => 'upcoming',
                'approval_status' => 'approved',
                'user_id' => $orgId2,
            ],
            [
                'title' => 'Don de Sang Place Bab Boujloud',
                'date' => Carbon::now()->addDays(8)->toDateString(),
                'start_time' => '10:00',
                'end_time' => '18:00',
                'time' => '10:00 - 18:00',
                'location' => 'Place Bab Boujloud',
                'city' => 'Fes',
                'description' => 'Unité mobile installée sur la place historique pour faciliter le don des habitants de l\'ancienne médina de Fès.',
                'target' => 120,
                'organizer_name' => 'Association Al Amal Oujda',
                'contact_info' => '+212620304050',
                'blood_types' => ['O+', 'A+', 'B+', 'AB+'],
                'status' => 'upcoming',
                'approval_status' => 'approved',
                'user_id' => $orgId1,
            ],
            [
                'title' => 'Don de Sang Faculté de Médecine',
                'date' => Carbon::now()->addDays(20)->toDateString(),
                'start_time' => '09:00',
                'end_time' => '16:00',
                'time' => '09:00 - 16:00',
                'location' => 'Hall d\'entrée, Faculté de Médecine et de Pharmacie',
                'city' => 'Marrakech',
                'description' => 'Campagne annuelle de don de sang en partenariat avec les étudiants en médecine de Marrakech.',
                'target' => 180,
                'organizer_name' => 'Dr. Rachid Idrissi (Croissant Rouge)',
                'contact_info' => '+212630405060',
                'blood_types' => ['O+', 'A+', 'B+', 'O-', 'A-'],
                'status' => 'upcoming',
                'approval_status' => 'approved',
                'user_id' => $orgId2,
            ],
            // A couple of pending campaigns to show in organizer dashboards
            [
                'title' => 'Caravane solidaire Berkane',
                'date' => Carbon::now()->addDays(30)->toDateString(),
                'start_time' => '09:00',
                'end_time' => '18:00',
                'time' => '09:00 - 18:00',
                'location' => 'Place de la Marche Verte',
                'city' => 'Berkane',
                'description' => 'Caravane mobile de sensibilisation et de collecte au cœur de la ville de Berkane.',
                'target' => 100,
                'organizer_name' => 'Association Al Amal Oujda',
                'contact_info' => '+212620304050',
                'blood_types' => ['O+', 'A+'],
                'status' => 'upcoming',
                'approval_status' => 'pending',
                'user_id' => $orgId1,
            ],
            [
                'title' => 'Collecte Corporative Zone Industrielle',
                'date' => Carbon::now()->addDays(45)->toDateString(),
                'start_time' => '08:30',
                'end_time' => '15:30',
                'time' => '08:30 - 15:30',
                'location' => 'Siège Social OCP',
                'city' => 'Casablanca',
                'description' => 'Campagne fermée organisée pour les collaborateurs de l\'entreprise.',
                'target' => 150,
                'organizer_name' => 'Dr. Rachid Idrissi (Croissant Rouge)',
                'contact_info' => '+212630405060',
                'blood_types' => ['O+', 'A+', 'B+', 'AB+'],
                'status' => 'upcoming',
                'approval_status' => 'pending',
                'user_id' => $orgId2,
            ]
        ];

        // Seed Campaigns & attach participants
        $donors = User::where('role', 'donor')->get();

        foreach ($campaignData as $data) {
            $campaign = Campaign::create($data);

            // If campaign is approved, register some random donors to it
            if ($campaign->approval_status === 'approved') {
                // Random number of participants
                $participantCount = random_int(12, min(50, $donors->count()));
                $selectedDonors = $donors->random($participantCount);

                $current = 0;
                foreach ($selectedDonors as $donor) {
                    DB::table('campaign_participants')->insert([
                        'campaign_id' => $campaign->id,
                        'user_id' => $donor->id,
                        'status' => 'registered',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $current++;
                }

                // Update current count to match registered participants
                $campaign->update(['current' => $current]);
            }
        }
    }
}
