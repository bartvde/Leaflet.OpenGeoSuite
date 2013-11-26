var map = L.map('map').setView([0, 0], 1);

L.tileLayer.wms('/geoserver/wms?', {
    layers: 'opengeo:countries',
    format: 'image/png'
}).addTo(map);

L.tileLayer.wms('http://suite.opengeo.org/geoserver/wms?', {
    layers: 'usa:states',
    transparent: true,
    format: 'image/png'
}).addTo(map);
