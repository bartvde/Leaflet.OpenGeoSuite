var map = L.map('map').setView([0, 0], 1);

L.tileLayer.wms('/geoserver/wms?', {
    layers: 'opengeo:countries',
    format: 'image/png',
    noWrap: true
}).addTo(map);

L.tileLayer.wms('http://suite.opengeo.org/geoserver/wms?', {
    layers: 'usa:states',
    transparent: true,
    format: 'image/png',
    noWrap: true
}).addTo(map);

var marker;

map.on('click', function(evt) {
    var point = evt.containerPoint; // or use layerPoint?
    var size = map.getSize();
    var bounds = map.getBounds();
    var crs = map.options.crs;
    var sw = crs.project(bounds.getSouthWest());
    var ne = crs.project(bounds.getNorthEast());
    var bbox = [sw.x, sw.y, ne.x, ne.y].join(',');
    var html = [];
    map.eachLayer(function(layer) {
        if (layer instanceof L.TileLayer.WMS) {
            var params = {
                request: 'GetFeatureInfo',
                service: 'WMS',
                srs: map.options.crs.code,
                styles: layer.wmsParams.styles,
                version: layer.wmsParams.version,      
                format: layer.wmsParams.format,
                bbox: bbox,
                height: size.y,
                width: size.x,
                layers: layer.wmsParams.layers,
                query_layers: layer.wmsParams.layers,
                info_format: 'text/html',
                x: point.x,
                y: point.y
            };
            // see: https://github.com/Leaflet/Leaflet/issues/2242
            var url = layer._url + L.Util.getParamString(params, layer._url, true);
            html.push('<iframe seamless src="' + url + '"></iframe>');
        }
    });
    if (!marker) {
        marker = L.marker(evt.latlng).addTo(map);
    } else {
        marker.setLatLng(evt.latlng);
    }
    marker.bindPopup(html.join('')).openPopup();
}, this);
