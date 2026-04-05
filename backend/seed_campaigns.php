<?php

use App\Models\Campaign;

Campaign::create(['title'=>'Collecte de sang - Centre Ville','date'=>'15 Avril 2026','time'=>'09:00 - 15:00','location'=>'Place Mohammed V','description'=>'Rejoignez-nous pour notre grande collecte de printemps au cœur de la ville.','target'=>200,'current'=>85]); 

Campaign::create(['title'=>'Unité Mobile - Université','date'=>'22 Avril 2026','time'=>'10:00 - 16:00','location'=>'Campus Principal','description'=>'Étudiants et professeurs, venez donner votre sang entre deux cours !','target'=>150,'current'=>40]); 

Campaign::create(['title'=>'Collecte Urgente - Hôpital Régional','date'=>'Aujourd\'hui','time'=>'Continue','location'=>'Banque de Sang (Hôpital)','description'=>'Nos réserves de O- sont critiques. Nous avons besoin de vous de toute urgence.','target'=>50,'current'=>12]);

echo "Campaigns seeded!\n";
