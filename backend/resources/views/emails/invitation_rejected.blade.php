<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background: #666; padding: 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .content { padding: 40px; }
        .content h2 { color: #1d3557; margin-top: 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BloodConnect</h1>
        </div>
        <div class="content">
            <h2>Mise à jour concernant votre don</h2>
            <p>Bonjour,</p>
            <p>Nous vous remercions sincèrement pour votre proposition de don de sang au profit de <strong>{{ $patientName }}</strong>.</p>
            <p>Le patient a indiqué qu'il n'avait plus besoin de votre don pour le moment (besoin déjà comblé ou autre raison). Ne soyez pas déçu, votre disponibilité reste précieuse pour la communauté.</p>
            <p>Nous vous encourageons à rester disponible pour de futurs besoins sur la plateforme.</p>
            <p style="margin-top: 30px;">Avec gratitude, l'équipe BloodConnect.</p>
        </div>
        <div class="footer">
            &copy; 2026 BloodConnect Platform Maroc. Sauver des vies, ensemble.
        </div>
    </div>
</body>
</html>
