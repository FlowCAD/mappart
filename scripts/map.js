/*jslint node: true*/
/*jslint es5: true */
/*global L, $, zonesLargesTLS, datas, alert*/
"use strict";

//--------------------------------------------------------------------------------------------//
//--------------------------------------DATA DEFINITIONS--------------------------------------//
// Map's properties
var mymap = L.map('mapId');

// Map's bounds
var northEastBound = L.latLng(43.68, 1.68),
    southWestBound = L.latLng(43.52, 1.21),
    bounds = L.latLngBounds(northEastBound, southWestBound);

// Background layers
var mbAttr = 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://mapbox.com">Mapbox</a>',
    mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmxvcmlhbmNhZG96IiwiYSI6ImNqMGkzN3ZzYzAwM3MzMm80MDZ6eGQ2bmwifQ.BMmvDcBnXoWT8waOnIKNBg',
    osmAttr = '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

var grayscale = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
    satellite = L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr}),
    streets = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr}),
    osm = L.tileLayer(osmUrl, {attribution: osmAttr});

// Styles
var alertMarkerSymbol = L.AwesomeMarkers.icon({icon: ' fa fa-exclamation', prefix: 'fa', color: 'orange', iconColor: 'white'}),
/*    workMarkerSymbol = L.AwesomeMarkers.icon({icon: ' fa fa-briefcase', prefix: 'fa', color: 'darkblue', iconColor: 'white'}),
    homeMarkerSymbol = L.AwesomeMarkers.icon({icon: ' fa fa-home', prefix: 'fa', color: 'green', iconColor: 'white'}),*/
    transportMarkerSymbol = L.AwesomeMarkers.icon({icon: ' fa fa-subway', prefix: 'fa', color: 'blue', iconColor: 'white'});

var /*zonesFinesStyle = {"weight": 2, "color": "#ff7800", "opacity": 1, fillColor: '#ff7800', fillOpacity: 0.4},*/
    zonesLargesStyle = {"weight": 1, "color": "#0000FF", "opacity": 1, fillColor: '#0000FF', fillOpacity: 0.25},
    polygonStyle = {"weight": 1, "color": "white", "opacity": 1, fillColor: 'rgb(52, 196, 85)', fillOpacity: 0.25};

// Markers
/*var thalesMarker = L.marker([43.536916, 1.513079], {icon: workMarkerSymbol}).bindPopup("<b>Travail</b><br />Thalès Service Labège");*/
var spotsMarker = L.marker([43.53, 1.51], {icon: alertMarkerSymbol}).bindPopup("<b>Coucou</b><br />Test");

// JSONs
/*var zonesLargesTLSJson = L.geoJson(
    zonesLargesTLS,
    {
        style: zonesLargesStyle,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<b> Quartier : " + feature.properties.libelle_du + "</b>");
        }
    }
);*/
var datasJson = L.geoJson(
    datas,
    {
        style: alertMarkerSymbol,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<b> Michel : " + feature.properties.libelle + "</b>");
        }
    }
)

//--------------------------------------------------------------------------------------------//
//-------------------------------------MAP INITIALIZATION-------------------------------------//
var initParam = function () {
    console.log("fonction initParam !");
    /*thalesMarker.addTo(mymap);
    zonesLargesTLSJson.addTo(mymap);*/
    datasJson.addTo(mymap);
    osm.addTo(mymap);
};

var checkForUrlTransmission = function () {
    console.log('checkForUrlTransmission');
    var myCurrentUrl = window.location.href,
        paramURL = null,
        myUrlRegexDev = /\/index\.html$/,
        myUrlRegexProd = /\/gotoulouse-datas\/?$/,
        myUrlParamRegex = /#([0-9]{1,2})\/([0-9]{1,2}\.?[0-9]*)\/(-?[0-9]{1,2}\.?[0-9]*)$/; /* like: #12/44.8369/-0.5713 */
    if (!myUrlRegexDev.test(myCurrentUrl) && !myUrlRegexProd.test(myCurrentUrl)) {
        console.log('Il y a des paramètres en URL');
        paramURL = myUrlParamRegex.exec(myCurrentUrl);
        console.log("paramURL : ", paramURL, "\nZoom : ", RegExp.$1, "\nLatitude : ", RegExp.$2, "\nLongitude : ", RegExp.$3);
        L.marker([RegExp.$2, RegExp.$3], {icon: alertMarkerSymbol}).addTo(mymap).bindPopup("<h6>Position transmise</h6>").openPopup();
    }
};

mymap.on("load", function () {
    console.log("map has loaded!");
    initParam();
    checkForUrlTransmission();
});

//--------------------------------------------------------------------------------------------//
//---------------------------------------MAP PROPERTIES---------------------------------------//
mymap.setView([43.599560, 1.441079], 12).setMaxBounds(bounds);
mymap.options.minZoom = 12;

// Hash the map (zoom/lon/lat)
new L.Hash(mymap);

// Basemaps for control
var baseMaps = {
    "OpenStreetMap": osm,
    "Plan gris": grayscale,
    "Plan": streets,
    "Satellite": satellite
};

// Layers for control
var overlayMaps = {
    "Mes Spots": datasJson,
    /*"Thalès Service Labège": datasJson,
    "Zones Larges Toulouse": zonesLargesTLSJson*/
};

// Controler
var lcontrol = L.control.layers(baseMaps, overlayMaps).addTo(mymap);

// Geocorder OpenStreetMap
new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.OpenStreetMap(),
    retainZoomLevel: false,
    showMarker: true
}).addTo(mymap);
//--------------------------------------------------------------------------------------------//
//--------------------------------------OTHER FUNCTIONS---------------------------------------//
// Removing data
var removeData = function (layerToRemove) {
    mymap.removeLayer(layerToRemove);
    lcontrol.removeLayer(layerToRemove);
};

// Adding data
var addingData = function (layerToAdd, layerNameToAdd) {
    mymap.addLayer(layerToAdd);
    lcontrol.addOverlay(layerToAdd, layerNameToAdd);
};

// Send a mail with a link and the coordinates in the url
L.easyButton('fa fa-envelope-o', function () {
    $('#emailLink').val(window.location.href);
    $('#sendMailModal').modal('show');
}).addTo(mymap);

var onclickSendMailButton = function () {
    var receiver = $("#emailAdress").val(),
        senderName = $("#emailSender").val(),
        senderMessage = $("#emailContent").val(),
        senderLink = $("#emailLink").val(),
        bodyOfMailToLink = encodeURI(senderMessage + "\r\n" + senderLink + "\r\n \r\n" + senderName),
        mailToLink = "mailto:" + receiver + "?subject=gÔToulouse&body=" + bodyOfMailToLink;
    window.location.href = mailToLink;
};

// Trigger an onclick event on the map and opening a great multitask popup
var onclickPopupContainer = $('<div />'), mapClickEvent = null, onMapClickSendPositionMail = null, onMapClickPlaceMarker = null, onMapClickAlertCoord = null;

onMapClickSendPositionMail = function () {
    var myUrlWithoutParam = window.location.hostname + window.location.pathname;
    $('#emailLink').val(myUrlWithoutParam + '#' + mymap.getZoom() + '/' + mapClickEvent.latlng.lat.toFixed(4).toString() + '/' + mapClickEvent.latlng.lng.toFixed(4).toString());
    $('#sendMailModal').modal('show');
    mymap.closePopup();
};

onMapClickPlaceMarker = function () {
    var marker = L.marker(mapClickEvent.latlng).bindPopup("<h5><i class='fa fa-info-circle' aria-hidden='true'></i> Marqueur Temporaire</h5><p>Ceci est un marquer temporaire, il ne sera pas sauvegardé après cette session !</p>").addTo(mymap);
    mymap.closePopup();
};

onMapClickAlertCoord = function () {
    alert("Ici, les coordonnées sont : " + mapClickEvent.latlng.toString());
    mymap.closePopup();
};

onclickPopupContainer.html('<div class="btn-group-vertical" role="group"><button id="onMapClickButton1" type="submit" class="btn btn-primary btn-block" onclick="onMapClickSendPositionMail()"><i class="fa fa-envelope fa-fw" aria-hidden="true"></i> Envoyer cette position par mail</button><button id="onMapClickButton2" type="submit" class="btn btn-primary btn-block" onclick="onMapClickPlaceMarker()"><i class="fa fa-map-marker fa-fw" aria-hidden="true"></i> Placer un marker temporaire</button><button id="onMapClickButton3" type="submit" class="btn btn-primary btn-block" onclick="onMapClickAlertCoord()"><i class="fa fa-globe fa-fw" aria-hidden="true"></i> Récupérer les coordonnées</button></div>');


mymap.on('click', function (e) {
    mapClickEvent = e;
    L.popup()
        .setLatLng(e.latlng)
        .setContent(onclickPopupContainer[0])
        .openOn(mymap);
});
//--------------------------------------------------------------------------------------------//
//------------------------------------------SANDBOX-------------------------------------------//
//Go searching for openData from Toulouse Metropole
var fromPointFeatureToLayer = function (featuresCreated, openDataName, openDataProperties) {
    var myData = L.geoJson(
        featuresCreated,
        {
            pointToLayer: function (feature, latlng) {
                return new L.marker((latlng), {icon: transportMarkerSymbol});
            },
            onEachFeature: function (feature, layer) {
                var featureAttributes = "", prop, attr;
                for (prop in openDataProperties) {
                    for (attr in feature.properties) {
                        if (typeof(feature.properties[attr]) !== "object" && attr === openDataProperties[prop].toLowerCase()) {
                            featureAttributes += openDataProperties[prop] + " : " + feature.properties[attr] + "<br />";
                        }
                    }
                }
                layer.bindPopup(featureAttributes);
            }
        }
    );
    addingData(myData, openDataName);
};

var fromPolygonFeatureToLayer = function (featuresCreated, openDataName, openDataProperties) {
    var myData = L.geoJson(
        featuresCreated,
        {
            style: polygonStyle,
            onEachFeature: function (feature, layer) {
                var featureAttributes = "", prop, attr;
                for (prop in openDataProperties) {
                    for (attr in feature.properties) {
                        if (typeof(feature.properties[attr]) !== "object" && attr === openDataProperties[prop].toLowerCase()) {
                            featureAttributes += openDataProperties[prop] + " : " + feature.properties[attr] + "<br />";
                        }
                    }
                }
                layer.bindPopup(featureAttributes);
            }
        }
    );
    addingData(myData, openDataName);
};

var fromFeatureToFeatureType = function (featuresCreated, typeOfGeomArray, openDataName, openDataProperties) {
    console.log(featuresCreated, typeOfGeomArray, openDataName, openDataProperties);
    if (typeOfGeomArray.length !== 1) {
        console.log("Il y a un problème avec le type de géométrie");
    }
    switch (typeOfGeomArray[0]) {
    case "Point":
        fromPointFeatureToLayer(featuresCreated, openDataName, openDataProperties);
        break;
    case "LineString":
        console.log("Hey c'est une LineString !");
        break;
    case "Polygon":
        fromPolygonFeatureToLayer(featuresCreated, openDataName, openDataProperties);
        break;
    case "MultiPoint":
        fromPointFeatureToLayer(featuresCreated, openDataName, openDataProperties);
        break;
    case "MultiLineString":
        console.log("Hey c'est une MultiLineString !");
        break;
    case "MultiPolygon":
        fromPolygonFeatureToLayer(featuresCreated, openDataName, openDataProperties);
        break;
    case "GeometryCollection":
        console.log("Hey c'est une GeometryCollection !");
        break;
    default:
        console.log("Hey je connais pas ce type de géométrie !!");
    }
};

var FeatureConstructor = function (geometry, properties) {
    this.geometry = geometry;
    this.properties = properties;
    this.type = "Feature";
};

var fromXhrToFeature = function (myResponse, openDataName, openDataProperties) {
    var i,
        typeOfGeomArray = [],
        featuresCreated = {
            "type": "FeatureCollection",
            "features": []
        };
    for (i = 0; i < myResponse.records.length; i += 1) {
        var typeOfGeom = myResponse.records[i].record.fields.geo_shape.geometry.type,
            theGeom = myResponse.records[i].record.fields.geo_shape.geometry.coordinates,
            featureObject = new FeatureConstructor(
                {
                    type: typeOfGeom,
                    coordinates: theGeom
                },
                myResponse.records[i].record.fields
            );
        if (typeOfGeomArray.indexOf(typeOfGeom) === -1) {
            typeOfGeomArray.push(typeOfGeom);
        }
        featuresCreated.features.push(featureObject);
    }
    fromFeatureToFeatureType(featuresCreated, typeOfGeomArray, openDataName, openDataProperties);
};

var myXHRSender = function (openData) {
    var openDataLink = openData[0],
        openDataName = openData[1],
        openDataProperties = openData[2],
        openDataXHR = new XMLHttpRequest();
    openDataXHR.open('GET', openDataLink);
    openDataXHR.send(null);
    /*openDataXHR.addEventListener('progress', function (e) {
        console.log(e.loaded + ' / ' + e.total);
    });*/
    openDataXHR.addEventListener('readystatechange', function () {
        if (openDataXHR.readyState === XMLHttpRequest.DONE) {
            if (openDataXHR.status === 200) {
                var myResponse = JSON.parse(openDataXHR.responseText);
                fromXhrToFeature(myResponse, openDataName, openDataProperties);
            } else {
                console.log("openDataXHR ", openDataXHR.statusText);
            }
        }
    });
};

var openDataDistricts = ['https://data.toulouse-metropole.fr/api/v2/catalog/datasets/recensement-population-2012-grands-quartiers-logement/records?rows=100&fields=code_insee%2Creg2016%2Cdep%2Clibelle_du_grand_quartier%2Cgeo_shape&pretty=true&timezone=UTC', "Grands quartiers", ["libelle_du_grand_quartier"]],
    openDataSubwayStations = ['https://data.toulouse-metropole.fr/api/v2/catalog/datasets/stations-de-metro/records?rows=100&pretty=true&timezone=UTC', "Stations de métro", ["Etat", "Ligne", "Nom"]];
myXHRSender(openDataDistricts);
myXHRSender(openDataSubwayStations);