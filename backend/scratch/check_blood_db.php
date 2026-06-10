<?php
try {
    $db = new PDO('mysql:host=127.0.0.1;port=3307;dbname=blood', 'root', '');
    echo "Connected to database 'blood' on 3307 successfully.\n";
    $tables = $db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables in 'blood': " . implode(', ', $tables) . "\n";
    if (in_array('users', $tables)) {
        $count = $db->query('SELECT COUNT(*) FROM users')->fetchColumn();
        echo "Users count in 'blood': $count\n";
    } else {
        echo "No 'users' table in 'blood'.\n";
    }
} catch (Exception $e) {
    echo "Failed to connect to 'blood': " . $e->getMessage() . "\n";
}
