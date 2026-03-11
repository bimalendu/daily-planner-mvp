<?php
declare(strict_types=1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database Connection (Update with your credentials)
$host = getenv('DB_HOST') ?: 'localhost';
$db   = getenv('DB_NAME') ?: 'timeblocker';
$user = getenv('DB_USER') ?: 'postgres';
$pass = getenv('DB_PASS') ?: 'yourpassword';

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$db", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $date = $_GET['date'] ?? date('Y-m-d');
    $stmt = $pdo->prepare("SELECT id, title, start_time, end_time FROM time_blocks WHERE DATE(start_time) = :date ORDER BY start_time ASC");
    $stmt->execute(['date' => $date]);
    echo json_encode($stmt->fetchAll());
} 
elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['title'], $input['start_time'], $input['end_time'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO time_blocks (title, start_time, end_time) VALUES (:title, :start_time, :end_time) RETURNING id, title, start_time, end_time");
    $stmt->execute([
        'title' => $input['title'],
        'start_time' => $input['start_time'],
        'end_time' => $input['end_time']
    ]);
    
    echo json_encode($stmt->fetch());
}