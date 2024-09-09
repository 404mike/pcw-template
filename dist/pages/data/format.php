<?php

$json = file_get_contents('geoJsonOld.json');
$data =  json_decode($json, true);

$arr = [];

echo count($data['features']);

// print_r($data);

$chunks = array_chunk($data['features'], 30);

// echo count($chunks) . PHP_EOL;


foreach($chunks as $k => $chunk) {
    $arr['type'] = 'FeatureCollection'; 
    $arr['total_results'] = 63890;
    $arr['features'] = [];
    // $arr['features'] = $chunk;

    foreach($chunk as $kk => $vv) {

        $arr['features'][] = [
            'type' => 'Feature',
            'properties' => [
                'nid' => $vv['properties']['nid'],
                'title' => $vv['properties']['title'],
                'image' => getImage($vv['properties']['description']),
                'description' => $vv['properties']['description'],
            ],
            'geometry' => [
                'type' => 'Point',
                'coordinates' => [
                    (float)$vv['geometry']['coordinates'][0],
                    (float)$vv['geometry']['coordinates'][1],
                ]
            ]
        ];
    }

    file_put_contents('geoJson' . $k . '.json', json_encode($arr, JSON_PRETTY_PRINT));

    echo $k . PHP_EOL;
}

function getImage($string) {
    $pattern = '/<img\s+[^>]*src="([^"]+)"/i';

    preg_match($pattern, $string, $matches);

    if (isset($matches[1])) {
        $image_url = $matches[1];

        if (strpos($image_url, 'http') === false) {
            $image_url = 'https://www.peoplescollection.wales' . $image_url;
        }

        $inage_url = str_replace('pcw_entity_glance', 'edit_node_thumb_larger', $image_url);
        return $image_url;
    } else {
        echo "No image found in the string";
    }
}

// file_put_contents('geoJson.json', json_encode($arr, JSON_PRETTY_PRINT));