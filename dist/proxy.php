<?php

$url = $_GET['url'];
$json = file_get_contents($url);
header('Content-Type: application/json');
echo $json;