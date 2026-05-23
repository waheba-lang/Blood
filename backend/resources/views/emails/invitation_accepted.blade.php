<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background: #27ae60; padding: 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .content { padding: 40px; }
        .content h2 { color: #1d3557; margin-top: 0; }
        .alert { background: #ecfdf5; border: 1px solid #d1fae5; color: #065f46; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .btn { display: inline-block; background: #27ae60; color: white !important; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 700; margin-top: 20px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BloodConnect</h1>
        </div>
        <div class="content">
            <h2>Votre proposition a été acceptée !</h2>
            <p>Félicitations,</p>
            <p>Le patient <strong>{{ $patientName }}</strong> a accepté votre proposition de don de sang. Votre geste va faire une réelle différence.</p>
            
            <div class="alert">
                Vous pouvez maintenant imprimer votre <strong>confirmation officielle</strong> pour la présenter à l'hôpital.
            </div>

            <p>Veuillez vous connecter à votre compte pour accéder aux détails complets et imprimer votre document.</p>
            
            <a href="{{ config('app.url') }}/my-donations" class="btn">Imprimer ma confirmation</a>
            
            <p style="margin-top: 30px;">Merci infiniment pour votre générosité.</p>
        </div>
        <div class="footer">
            &copy; 2026 BloodConnect Platform Maroc. Sauver des vies, ensemble.
        </div>
    </div>
</body>
</html>
