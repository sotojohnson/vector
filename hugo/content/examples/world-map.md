---
# This front matter is auto generated by the examples.js script
title: Interactive World Map
id: world-map
script: /examples/maps/world-map.js
description: Every country in the world displayed in an interactive.
tags: [maps]
weight: 1
draft: undefined
---

{{< highlight javascript >}}
/**
* @title Interactive World Map
* @description Every country in the world displayed in an interactive.
* @input Input the name of the map you want to see, and the size of the map.
* @tags [maps]
* @weight 1
*/

import {Interactive, getScriptName} from '../../index.js';
import * as data from '../../../maps/maps-json.js';

let myInteractive = new Interactive(getScriptName());
let map = myInteractive.map(data.globalData);

