Markers = new Mongo.Collection('markers');

if (Meteor.isServer) {
  Meteor.startup(function () {
    // Remove all markers
    Markers.remove({});

    // Big Blast
    // 715 S Main St, Sapulpa, OK 74066
    Markers.insert({ lat: 35.989588, lng: -96.113089, name: 'Big Blast', description: '715 S Main St, Sapulpa, OK 74066' });

    // Jake's World Class Fireworks (West Tulsa store)
    // 16115 W Skelly Dr, Tulsa, OK 74107
    Markers.insert({ lat: 36.163933, lng: -95.797082, name: 'Jake\'s World Class Fireworks (West Tulsa store)', description: '16115 W Skelly Dr, Tulsa, OK 74107' });

    // Jake's World Class Fireworks (By QT on Taft)
    // 1040 E Taft Ave, Sapulpa, OK
    Markers.insert({ lat: 35.988408, lng: -96.100119, name: 'Jake\'s World Class Fireworks (By QT on Taft)', description: '1040 E Taft Ave, Sapulpa, OK' });

    // TNT (West Tulsa Store)
    // 5401 W Skelly Dr, Tulsa, OK 74107
    Markers.insert({ lat: 36.085371, lng: -96.041473, name: 'TNT (West Tulsa Store)', description: '5401 W Skelly Dr, Tulsa, OK 74107' });

    // TNT (Sapulpa Walmart)
    // 1002 W Taft St Sapulpa, OK 74066
    Markers.insert({ lat: 35.988338, lng: -96.125583, name: 'TNT (Sapulpa Walmart)', description: '1002 W Taft St Sapulpa, OK 74066' });

  });
}

if (Meteor.isClient) {

  Meteor.startup(function() {
    GoogleMaps.load();
  });

  Template.map.helpers({
    exampleMapOptions: function() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        // Map initialization options
        return {
          center: new google.maps.LatLng(35.998701, -96.114166),
          zoom: 14
        };
      }
    }
  });

  Template.map.onCreated(function() {

    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', function(map) {

      function hereDoc(f) {
        return f.toString()
          .replace(/^[^\/]+\/\*!?/, '')
          .replace(/\*\/[^\/]+$/, '');
      }

      var image = 'fwico.png';

      var markers = {};

      var iwindows = {};

      /*
      google.maps.event.addListener(map.instance, 'click', function(event) {
        Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });
      */

      Markers.find().observe({
        added: function(document) {

          var content = "<h2>" + document.name + "</h2>" + "<br>" + "<p>" + document.description + "</p>";

          iwindows["infoWin_"+document._id] = new google.maps.InfoWindow({
            content: content
          });

          // Create a marker for this document
          var marker = new google.maps.Marker({
            draggable: true,
            //animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat, document.lng),
            map: map.instance,
            icon: image,
            // We store the document _id on the marker in order 
            // to update the document within the 'dragend' event below.
            id: document._id
          });

          // This listener lets us show a popup modal for this marker
          google.maps.event.addListener(marker, 'click', function() {
            for (var iwin in iwindows) {
              if (iwindows.hasOwnProperty(iwin)) {
                iwindows[iwin].close();
              }
            }
            iwindows["infoWin_"+document._id].open(map.instance,marker);
          });

          // This listener lets us drag markers on the map and update their corresponding document.
          google.maps.event.addListener(marker, 'dragend', function(event) {
            Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
          });

          // Store this marker instance within the markers object.
          markers[document._id] = marker;
        },
        changed: function(newDocument, oldDocument) {
          markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
        },
        removed: function(oldDocument) {
          // Remove the marker from the map
          markers[oldDocument._id].setMap(null);

          // Clear the event listener
          google.maps.event.clearInstanceListeners(
            markers[oldDocument._id]);

          // Remove the reference to this marker instance
          delete markers[oldDocument._id];
        }
      });

    });


  });

}

