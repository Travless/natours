import babel from '@babel/polyfill';
import $jqtH7$axios from 'axios';

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
/*eslint-disable*/ 
/*eslint-disable*/ const $f60945d37f8e594c$export$4c5dd147b21b9176 = (locations)=>{
    mapboxgl.accessToken = "pk.eyJ1IjoidHJhdmxlc3MiLCJhIjoiY2xmdmN1aXF2MDV1cTNwczNyaGt1d2NjOSJ9.TZ3OiFZvnmJF2gCCvC2d6g";
    let map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/travless/clfvf4vph00lm01mxevslngjv",
        scrollZoom: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc)=>{
        // Create marker
        const el = document.createElement("div");
        el.className = "marker";
        // Add marker
        new mapboxgl.Marker({
            element: el,
            ancchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        // Add popup
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        // Extend the map bounds to include current location
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};


/*eslint-disable*/ 
const $70af9284e599e604$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await (0, ($parcel$interopDefault($jqtH7$axios)))({
            method: "Post",
            url: "http://127.0.0.1:3000/api/v1/users/login",
            data: {
                email: email,
                password: password
            }
        });
        console.log(res);
    } catch (err) {
        console.log(err.response.data);
    }
};


// DOM Elements
const $d0f7ce18c37ad6f6$var$mapBox = document.getElementById("map");
const $d0f7ce18c37ad6f6$var$loginForm = document.querySelector(".form");
// DELEGATION
if ($d0f7ce18c37ad6f6$var$mapBox) {
    const locations = JSON.parse($d0f7ce18c37ad6f6$var$mapBox.dataset.locations);
    (0, $f60945d37f8e594c$export$4c5dd147b21b9176)(locations);
}
if ($d0f7ce18c37ad6f6$var$loginForm) $d0f7ce18c37ad6f6$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $70af9284e599e604$export$596d806903d1f59e)(email, password);
});


//# sourceMappingURL=bundle.js.map
