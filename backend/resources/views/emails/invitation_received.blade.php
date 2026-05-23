<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background: #e63946; padding: 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .content { padding: 40px; }
        .content h2 { color: #1d3557; margin-top: 0; }
        .details { background: #fdf2f2; border: 1px solid #fee2e2; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .details p { margin: 10px 0; font-size: 14px; }
        .details strong { color: #e63946; }
        .btn { display: inline-block; background: #e63946; color: white !important; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 700; margin-top: 20px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BloodConnect</h1>
        </div>
        <div class="content">
            <h2>Message BloodConnect</h2>
            <p>Bonjour,</p>
            <p>Un donneur de la communauté BloodConnect souhaite entrer en contact concernant un don de sang.</p>
            
            <div class="details">
                <p><strong>Donneur :</strong> {{ $donorName }}</p>
                <p><strong>Groupe Sanguin :</strong> {{ $bloodType }}</p>
                <p><strong>Hôpital :</strong> {{ $hospital }}</p>
            </div>

            <p>Connectez-vous à votre compte BloodConnect pour suivre votre activité et vos échanges.</p>
            
            <a href="{{ config('app.url') }}/login" class="btn">Se connecter</a>
            
            <p style="margin-top: 30px;">Merci de faire confiance à BloodConnect.</p>
        </div>
        <div class="footer">
            &copy; 2026 BloodConnect Platform Maroc. Sauver des vies, ensemble.
        </div>
    </div>
</body>
</html>
