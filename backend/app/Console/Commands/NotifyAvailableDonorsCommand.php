<?php

namespace App\Console\Commands;

use App\Mail\DonorAvailableAgainMail;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class NotifyAvailableDonorsCommand extends Command
{
    protected $signature = 'donors:notify-available';
    protected $description = 'Notify donors when they become eligible again';

    public function handle(): int
    {
        $donors = User::query()
            ->where('role', 'donor')
            ->whereNotNull('last_donation_at')
            ->get()
            ->filter(function (User $donor) {
                return $donor->is_eligible && $donor->availability_notified_at === null;
            });

        foreach ($donors as $donor) {
            Mail::to($donor->email)->send(new DonorAvailableAgainMail($donor));
            $donor->update([
                'is_available' => true,
                'availability_notified_at' => now(),
            ]);
        }

        $this->info("Notified {$donors->count()} donor(s).");

        return self::SUCCESS;
    }
}
