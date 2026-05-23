<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: Arial, Helvetica, sans-serif; color: #1f2937;">
    <div style="max-width: 640px; margin: 24px auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);">
        <div style="background: linear-gradient(135deg, #1d3557 0%, #457b9d 100%); padding: 32px; color: #ffffff;">
            <div style="font-size: 24px; font-weight: 700;">BloodConnect</div>
            <div style="margin-top: 8px; font-size: 14px; opacity: 0.92;">Donation confirmation</div>
        </div>

        <div style="padding: 32px;">
            <h1 style="margin: 0 0 16px; font-size: 26px; color: #111827;">Thank you, {{ $donation->user->name }}.</h1>
            <p style="margin: 0 0 18px; line-height: 1.7;">
                Your blood donation has been marked as completed successfully. We appreciate your generosity and your support for patients who need urgent care.
            </p>

            <div style="background: #f8fafc; border: 1px solid #dbe4ee; border-radius: 14px; padding: 18px; margin-bottom: 24px;">
                <div style="font-weight: 700; margin-bottom: 10px; color: #1d3557;">Donation details</div>
                <div style="line-height: 1.8;">Certificate ID: {{ $donation->certificate_id }}</div>
                <div style="line-height: 1.8;">Donation date: {{ $donation->donation_date }}</div>
                <div style="line-height: 1.8;">Hospital: {{ $donation->hospital ?? 'Not specified' }}</div>
            </div>

            <a href="{{ config('app.url') }}/donations/{{ $donation->id }}/print" style="display: inline-block; background: #1d3557; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 700;">
                View certificate
            </a>

            <p style="margin: 28px 0 0; line-height: 1.7;">
                Your contribution matters deeply.<br>
                The BloodConnect Team
            </p>
        </div>
    </div>
</body>
</html>
