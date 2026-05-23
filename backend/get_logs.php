<?php
$lines = file('storage/logs/laravel.log');
$lastLines = array_splice($lines, -100);
echo implode("", $lastLines);
