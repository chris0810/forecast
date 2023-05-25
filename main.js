/* Wetterstationen Euregio Beispiel */

// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let map = L.map("map", {
    fullscreenControl: true
}).setView([ibk.lat, ibk.lng], 5);

// thematische Layer
let themaLayer = {
    forecast: L.featureGroup()
}

// Hintergrundlayer
let layerControl = L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery").addTo(map)
}, {
    "Wettervorhersage MET Norway": themaLayer.forecast.addTo(map)
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Wettervorhersage MET Norway
async function showForecast(url, latlng) {
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata, latlng);

    let timeseries= jsondata.properties.timeseries


    let current = jsondata.properties.timeseries[0].data.instant.details;
    console.log(current);
    
    let timestamp = new Date(jsondata.properties.meta.updated_at)
    ();
    
    let markup = `<h4>Aktuelles Wetter für ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}</h4>;
    <table>
    <tr><td>Luftdruck (hPa)</td><td>${current.air_pressure_at_sea_level}</td></tr>
    <tr><td>Lufttemperatur (°C)  </td><td>${current.air_temperature}</tr></tr>
    <tr><td>Bewölkung (%) </td><td>${current.cloud_area_fraction}</tr></tr>
    <tr><td>Relative Luftfeuchtigkeit (%) </td><td>${current.relative_humidity}</tr></tr>
    <tr><td>Windrichtung (°)</tr> </td><td>${current.wind_from_direction}</tr></tr>
    <tr><td>Windgeschwindigkeit (m/s) </td><td>${current.wind_speed}</tr></tr>
   
    </table>
    `;

}

    for (let i=0; i<=24, i+=3;) {
        let icon= timeseries[i].data.next_1_hours.summary.symbol_code;
        let image= `icons/${icon}.svg`;
        markup += `<img src=${image} style="width:32px;">`
        console.log(icon, image);

L.popup().setLatLng(latlng).setContent(markup).openOn(map);
}

map.on("click", function(evt) {
    let url=`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${evt.latlng.lat}&lon=${evt.latlng.lng}`
        ;
    showForecast(url, evt.latlng);

});

map.fireEvent("click",{
    latlng: L.latlng(ibk.lat, ibk.lng)
})

async function loadWind(url){
    let response= await fetch(url);
    console.log(jsondata);

}
loadWind("https://geographie.uibk.ac.at/data/ecmwf/data/wind-10u-10v-europe.json")