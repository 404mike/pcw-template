<?php

$d = json_decode(file_get_contents('collection.json'),true);

echo count($d);
