<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Availability</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f5f8fb; padding: 24px; color: #1f2937;">
    <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb;">
        <h2 style="margin-top: 0; color: #2563eb;">Good news, {{ $donor->name }}.</h2>
        <p>You are eligible to donate blood again.</p>
        <p>Your previous donation date: <strong>{{ optional($donor->last_donation_at)->format('Y-m-d') }}</strong></p>
        <p>Thank you for supporting blood availability and saving lives.</p>
    </div>
</body>
</html>
