<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'admin@bloodconnect.com')->first();
if ($user) {
    echo "Found user: " . $user->email . "\n";
    echo "Hash match for password123: " . (\Illuminate\Support\Facades\Hash::check('password123', $user->password) ? "YES" : "NO") . "\n";
    
    // Forcefully reset the password directly to be absolutely certain
    $user->password = \Illuminate\Support\Facades\Hash::make('password123');
    $user->save();
    echo "Password aggressively reset to password123 just in case.\n";
} else {
    echo "User NOT FOUND.\n";
}
