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
    'locate'     => 'locate.twig',
];

$data = [];
$whatFacetList = [];
$whenFacetList = [];
$whatFacet = json_decode(file_get_contents('src/templates/data/what.json'), true);
$whenFacet = json_decode(file_get_contents('src/templates/data/when.json'), true);

foreach($whatFacet as $whatK => $whatV) {

    $whatFacetList[$whatK] = [];
    $whatFacetList[$whatK]['name'] = $whatK;
    $whatFacetList[$whatK]['id'] = preg_replace('/[^a-zA-Z0-9]/', '', $whatK);

    foreach($whatV as $whatK2 => $whatV2) {
        $whatFacetList[$whatK]['sub'][] = [
            'name' => $whatK2,
            'nameClean' => preg_replace('/[^a-zA-Z0-9]/', '', $whatK2),
            'value' => number_format($whatV2)
        ];
    }
}

foreach($whenFacet as $whenK => $whenV) {
    $whenFacetList[$whenK] = [];
    $whenFacetList[$whenK]['name'] = $whenK;
    $whenFacetList[$whenK]['id'] = preg_replace('/[^a-zA-Z0-9]/', '', $whenK);

    foreach($whenV as $whenK2 => $whenV2) {
        $whenFacetList[$whenK]['sub'][] = [
            'name' => $whenK2,
            'nameClean' => preg_replace('/[^a-zA-Z0-9]/', '', $whenK2),
            'value' => $whenV2
        ];
    }
}

// merge the two facet lists into $data
$data = array_merge($whatFacetList, $whenFacetList);


$discover = json_decode(file_get_contents('src/templates/data/discover-items.json'), true);
$collection = json_decode(file_get_contents('src/templates/data/collection.json'), true);
$story = json_decode(file_get_contents('src/templates/data/story.json'), true);

if (!file_exists('dist/pages')) {
    mkdir('dist/pages', 0777, true);
}

foreach ($pages as $page => $template) {
    
    $html = $twig->render($template, [
        'facets' => $data,
        'whatFacet' => $whatFacetList,
        'whenFacet' => $whenFacetList,
        'discover' => $discover,
        'collection' => $collection,
        'story' => $story,
        'page' => $page
    ]);
    file_put_contents("dist/pages/{$page}.html", $html);
}