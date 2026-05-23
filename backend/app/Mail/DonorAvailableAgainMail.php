<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DonorAvailableAgainMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $donor)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'You can donate blood again',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.donor_available_again',
            with: ['donor' => $this->donor],
        );
    }
}
