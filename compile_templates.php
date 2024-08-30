<?php
require_once 'bootstrap.php';

$pages = [
    'discover'   => 'discover.twig',
    'discover2'   => 'discover.twig',
    'discover_user'   => 'discover_user.twig',
    'item'       => 'item.twig',
    'collection' => 'collection.twig',
    'story'      => 'story.twig',
    'profile'    => 'profile.twig',
    'upload'     => 'upload.twig',
    'edit'       => 'edit.twig',
];

$data = [];
$whatFacet = json_decode(file_get_contents('src/templates/data/what.json'), true);
$whenFacet = json_decode(file_get_contents('src/templates/data/when.json'), true);

foreach($whatFacet as $whatK => $whatV) {

    $data[$whatK] = [];
    $data[$whatK]['name'] = $whatK;
    $data[$whatK]['id'] = preg_replace('/[^a-zA-Z0-9]/', '', $whatK);

    foreach($whatV as $whatK2 => $whatV2) {
        $data[$whatK]['sub'][] = [
            'name' => $whatK2,
            'value' => number_format($whatV2)
        ];
    }
}

foreach($whenFacet as $whenK => $whenV) {
    $data[$whenK] = [];
    $data[$whenK]['name'] = $whenK;
    $data[$whenK]['id'] = preg_replace('/[^a-zA-Z0-9]/', '', $whenK);

    foreach($whenV as $whenK2 => $whenV2) {
        $data[$whenK]['sub'][] = [
            'name' => $whenK2,
            'value' => $whenV2
        ];
    }
}


$discover = json_decode(file_get_contents('src/templates/data/discover-items.json'), true);
$collection = json_decode(file_get_contents('src/templates/data/collection.json'), true);
$story = json_decode(file_get_contents('src/templates/data/story.json'), true);

if (!file_exists('dist/pages')) {
    mkdir('dist/pages', 0777, true);
}

foreach ($pages as $page => $template) {
    
    $html = $twig->render($template, [
        'facets' => $data,
        'discover' => $discover,
        'collection' => $collection,
        'story' => $story,
        'page' => $page
    ]);
    file_put_contents("dist/pages/{$page}.html", $html);
}