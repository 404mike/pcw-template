<?php
// bootstrap.php
require_once 'vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader('src/templates');
$twig = new \Twig\Environment($loader);