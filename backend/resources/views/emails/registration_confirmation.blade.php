<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to BloodConnect</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: Arial, Helvetica, sans-serif; color: #1f2937;">
    <div style="max-width: 640px; margin: 24px auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);">
        <div style="background: linear-gradient(135deg, #d62839 0%, #ef476f 100%); padding: 32px; color: #ffffff;">
            <div style="font-size: 24px; font-weight: 700;">BloodConnect</div>
            <div style="margin-top: 8px; font-size: 14px; opacity: 0.92;">Registration confirmed</div>
        </div>

        <div style="padding: 32px;">
            <h1 style="margin: 0 0 16px; font-size: 26px; color: #111827;">Welcome, {{ $user->name }}!</h1>
            <p style="margin: 0 0 16px; line-height: 1.7;">
                Your account has been created successfully. Thank you for joining BloodConnect and supporting a safer, faster blood donation community.
            </p>
            <p style="margin: 0 0 20px; line-height: 1.7;">
                You can now sign in to manage your profile and track your donation activity.
            </p>

            <div style="background: #fff5f5; border: 1px solid #fecdd3; border-radius: 14px; padding: 18px; margin-bottom: 24px;">
                <div style="font-weight: 700; margin-bottom: 8px; color: #b42318;">Account summary</div>
                <div style="line-height: 1.8;">Email: {{ $user->email }}</div>
                <div style="line-height: 1.8;">Role: {{ ucfirst($user->role) }}</div>
                @if($user->blood_type)
                    <div style="line-height: 1.8;">Blood type: {{ $user->blood_type }}</div>
                @endif
                @if($user->city)
                    <div style="line-height: 1.8;">City: {{ $user->city }}</div>
                @endif
            </div>

            <a href="{{ config('app.url') }}/dashboard" style="display: inline-block; background: #d62839; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 700;">
                Open my dashboard
            </a>

            <p style="margin: 28px 0 0; line-height: 1.7;">
                Thank you for being part of this life-saving mission.<br>
                The BloodConnect Team
            </p>
        </div>
    </div>
</body>
</html>
