/**
 * Created by Gonzalo on 4/3/2016.
 */
var config = {
    'maps_api_key': 'AIzaSyAe66PG_ORNii6DZDVZEK08Sa4V9ii3gHA',
    'flickr_secret_key': '5be6661081000fc7',
    'flickr_public_key': 'da30fc763d28c340769fc8ca960d22b2'
};
var infowindow = null;
var locations = [
    {
        'name': 'University of Notre Dame',
        'coord0': 41.7035679,
        'coord1': -86.2357006,
        'additionalInfo': "<span style='color:black'>More info in: </span><a href='https://en.wikipedia.org/wiki/University_of_Notre_Dame' target='_blank'>https://en.wikipedia.org/wiki/University_of_Notre_Dame</a>"
    },
    {
        'name': 'Holy Cross College',
        'coord0': 41.6987353,
        'coord1': -86.2535092,
        'additionalInfo': "<span style='color:black'>More info in: </span><a href='https://en.wikipedia.org/wiki/Holy_Cross_College_(Indiana)' target='_blank'>https://en.wikipedia.org/wiki/Holy_Cross_College_(Indiana)</a>"
    },
    {
        'name': 'Notre Dame Stadium',
        'coord0': 41.697910,
        'coord1': -86.233680,
        'additionalInfo': "<span style='color:black'>More info in: </span><a href='https://en.wikipedia.org/wiki/Notre_Dame_Stadium' target='_blank'>https://en.wikipedia.org/wiki/Notre_Dame_Stadium</a>"
    },
    {
        'name': 'Saint Mary\'s Lake',
        'coord0': 41.7026463,
        'coord1': -86.2463946,
        'additionalInfo': "<span style='color:black'>No info available in wikipedia</span>"
    },
    {
        'name': 'Saint Joseph\'s Lake',
        'coord0': 41.7059819,
        'coord1': -86.2415503,
        'additionalInfo': "<span style='color:black'>No info available in wikipedia</span>"
    }
];
/**
 * Model for KnockoutJS data binding
 * @constructor
 */
var SearchModel = function () {
    var self = this;
    this.query = ko.observable("");
    this.locations = locations;
    this.activeLocations = ko.observableArray(locations);
    this.photos = ko.observableArray();

    /**
     * Updates the list according to the query entered by the user. This method is called everytime the user presses a key in the textbox
     */
    this.updateList = function () {
        self.activeLocations([]);
        if (self.query() == "") {
            self.activeLocations(locations);
        } else {
            self.locations.forEach(function (location) {
                if (location.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                    self.activeLocations.push(location);
                }
            });
        }
        mapController.updateMarkers(self.activeLocations);
    };

    /**
     * Click event for locations in the list. It will load images in the gallery and animate the marker.
     * @param location
     */
    this.showGallery = function (location) {
        Flickr.searchPhoto(location.name);
        mapController.animate(location.name);
        mapController.openInfoWindow(location.name,location.additionalInfo);
    };
};
/**
 * Controller to interact with google maps API
 * @constructor
 */
var MapController = function () {
    this.map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {lat: 41.7055756, lng: -86.2375275},
        scrollwheel: true,
        zoom: 14
    });
    this.markers = [];
};
/**
 * Loads markers in the map according to the locations
 *
 * @param locations this should be a knockout observable array
 */
MapController.prototype.initMarkers = function (locations) {
    var self = this;
    locations().forEach(function (location) {

        var marker = new google.maps.Marker({
            position: {'lat': location.coord0, 'lng': location.coord1},
            map: self.map,
            title: location.name
        });
        marker.setAnimation(null);
        marker.addListener('click', function () {
            Flickr.searchPhoto(location.name);
            mapController.animate(location.name);
            mapController.openInfoWindow(location.name,location.additionalInfo);
        });
        self.markers.push(marker);
    });
};

/**
 * Lets you open an infowindow on the marker specified by markerTitle
 * @param markerTitle the title of the marker whose infowindow you want to open.
 * @param info whatever you want to show in the infowindow
 */
MapController.prototype.openInfoWindow = function(markerTitle, info)
{
    var selectedMarker=null;
    var content = info;
    this.markers.forEach(function (marker) {
        if (marker.title == markerTitle) {
            selectedMarker = marker;
        }
    });
    if (infowindow) {
        infowindow.close();
    }
    infowindow = new google.maps.InfoWindow({
        content: content
    });
    infowindow.open(this.map, selectedMarker);
};
/**
 * Toggles the bouncing animation in the marker
 *
 * @param marker google.maps.Marker
 */
MapController.prototype.toggleBounce = function (marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
};
/**
 * Updates the markers in the map according to the locations passed
 * @param locations this should be a knockout observable array
 */
MapController.prototype.updateMarkers = function (locations) {
    this.clearMarkers();
    this.initMarkers(locations);
};

/**
 * Deletes every marker in the map
 */
MapController.prototype.clearMarkers = function () {
    this.markers.forEach(function (marker) {
        marker.setMap(null);
    });
    this.markers = [];
};

/**
 * Animates a marker. This is idempotent (not like toggle bounce).
 * @param marker
 */
MapController.animateMarker = function (marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    var thisMarker = marker;
    var self = this;
    window.setTimeout(function()
    {
        self.stopAnimation(thisMarker);
    }, 2000);
};

/**
 * Stops animating the marker
 * @param marker
 */
MapController.stopAnimation = function (marker) {
    marker.setAnimation(null);
};

/**
 * Animates a single marker.
 * @param markerTitle
 */
MapController.prototype.animate = function (markerTitle) {
    this.markers.forEach(function (marker) {
        if (marker.title != markerTitle) {
            MapController.stopAnimation(marker);
        } else {
            MapController.animateMarker(marker);
        }
    });
};


var searchModel = new SearchModel();

ko.applyBindings(searchModel);

/**
 * Initializes map. This is called after google maps api loads.
 */
function initMap() {
    mapController = new MapController();
    mapController.initMarkers(searchModel.activeLocations);
}


function mapsInitError()
{
    alert("Google maps could not be loaded. Please, check internet connection and try again later");
}

var Flickr = function () {

};

Flickr.secretKey = config.flickr_secret_key;
Flickr.publicKey = config.flickr_public_key;
Flickr.baseURL = 'https://api.flickr.com/services/rest/?method=%method%&api_key=' + Flickr.publicKey + '&extras=url_m&text=%query%&format=json&nojsoncallback=1';
Flickr.photoURL = 'https://www.flickr.com/photos/%author%/%photoId%';

Flickr.searchPhoto = function (name) {
    var method = 'flickr.photos.search';
    var queryURL = this.baseURL.replace("%method%", method).replace("%query%", name.replace(/ /g, "%20"));
    $.getJSON(queryURL, function (photos) {
        searchModel.photos(photos.photos.photo.slice(0, 3));
    }).fail(function () {
        alert("Connecting to Flickr to show photos failed");
    });
};