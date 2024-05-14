<?php
// index.php
require_once 'bootstrap.php';

$pages = [
    'test' => 'base.twig',
    // 'test2' => 'test2.twig',
];

// check if the dist/pages folder exists
if (!file_exists('dist/pages')) {
    mkdir('dist/pages', 0777, true);
}

foreach ($pages as $page => $template) {
    $html = $twig->render($template);
    file_put_contents("dist/pages/{$page}.html", $html);
}