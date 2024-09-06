<?php

$json = file_get_contents('geoJsonOld.json');
$data =  json_decode($json, true);

$arr = [];

// print_r($data);

$arr['type'] = 'FeatureCollection'; 
$arr['total_results'] = 63890;
$arr['features'] = [];

foreach($data['features'] as $k => $v) {

    $arr['features'][] = [
        'type' => 'Feature',
        'properties' => [
            'nid' => $v['properties']['nid'],
            'title' => $v['properties']['title'],
            'description' => $v['properties']['description'],
        ],
        'geometry' => [
            'type' => 'Point',
            'coordinates' => [
                (float)$v['geometry']['coordinates'][0],
                (float)$v['geometry']['coordinates'][1],
            ]
        ]
    ];
}

file_put_contents('geoJson.json', json_encode($arr, JSON_PRETTY_PRINT));