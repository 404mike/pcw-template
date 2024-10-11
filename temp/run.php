<?php


$url = 'https://www.peoplescollection.wales/items/2170326';


// utm_source

// utm_medium

// utm_campaign

$arr = [
    'oct_24' => [
       [
        'utm_source' => 'facebook',
        'utm_medium' => 'social',
        'utm_campaign' => 'oct_24'
       ],
       [
        'utm_source' => 'twitter',
        'utm_medium' => 'social',
        'utm_campaign' => 'oct_24'
       ],
       [
        'utm_source' => 'instagram',
        'utm_medium' => 'social',
        'utm_campaign' => 'oct_24'
       ],
       [
        'utm_source' => 'email',
        'utm_medium' => 'newsletter',
        'utm_campaign' => 'oct_24'
       ]
    ],
    'nov_24' => [
       [
        'utm_source' => 'facebook',
        'utm_medium' => 'social',
        'utm_campaign' => 'nov_24'
       ],
       [
        'utm_source' => 'twitter',
        'utm_medium' => 'social',
        'utm_campaign' => 'nov_24'
       ],
       [
        'utm_source' => 'instagram',
        'utm_medium' => 'social',
        'utm_campaign' => 'nov_24'
       ],
       [
        'utm_source' => 'email',
        'utm_medium' => 'newsletter',
        'utm_campaign' => 'nov_24'
       ]
    ],
    'dec_24' => [
         [
          'utm_source' => 'facebook',
          'utm_medium' => 'social',
          'utm_campaign' => 'dec_24'
         ],
         [
          'utm_source' => 'twitter',
          'utm_medium' => 'social',
          'utm_campaign' => 'dec_24'
         ],
         [
          'utm_source' => 'instagram',
          'utm_medium' => 'social',
          'utm_campaign' => 'dec_24'
         ],
         [
          'utm_source' => 'email',
          'utm_medium' => 'newsletter',
          'utm_campaign' => 'dec_24'
         ]
     ],
    'jan_24' => [
         [
          'utm_source' => 'facebook',
          'utm_medium' => 'social',
          'utm_campaign' => 'jan_24'
         ],
         [
          'utm_source' => 'twitter',
          'utm_medium' => 'social',
          'utm_campaign' => 'jan_24'
         ],
         [
          'utm_source' => 'instagram',
          'utm_medium' => 'social',
          'utm_campaign' => 'jan_24'
         ],
         [
          'utm_source' => 'email',
          'utm_medium' => 'newsletter',
          'utm_campaign' => 'jan_24'
         ]
    ]
];

foreach($arr as $key => $value) {

    echo "<h1>$key</h1>";

    foreach($value as $v) {
        $source = $v['utm_source'];
        $medium = $v['utm_medium'];
        $campaign = $v['utm_campaign'];

        $linkTitle  = "$source - $medium - $campaign";

        $url = '<p><a target="_blank" href="https://www.peoplescollection.wales/items/2170326';
        $url .= '?utm_source=' . $source;
        $url .= '&utm_medium=' . $medium;
        $url .= '&utm_campaign=' . $campaign;
        $url .= '">' .$linkTitle . '</a></p>';
        echo $url .  PHP_EOL;
    }
}