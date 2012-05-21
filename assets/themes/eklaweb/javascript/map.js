
window.addEvent('domready', function() {

    var position = new google.maps.LatLng(47.2070388, -1.56042720),
    map = new google.maps.Map($('map'), {
        center: position,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false
    });

    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        new google.maps.Marker({
            position: position,
            map: map,
            title: "Eklaweb"
        });
    });

});
