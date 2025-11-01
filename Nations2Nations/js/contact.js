document.addEventListener('DOMContentLoaded', function() {
    // Replace static images with interactive maps
    const capeTownImg = document.querySelector('img[alt="Joburg"]');
    const johannesburgImg = document.querySelector('img[alt="Cape"]');
    
    if (capeTownImg && johannesburgImg) {
        // Code for reating map containers
        const capeTownMap = document.createElement('div');
        capeTownMap.id = 'capeTownMap';
        capeTownMap.className = 'map-container';
        capeTownMap.innerHTML = '<h4>Cape Town Location</h4><div id="capeTownMapInner" style="height: 250px;"></div>';
        
        const johannesburgMap = document.createElement('div');
        johannesburgMap.id = 'johannesburgMap';
        johannesburgMap.className = 'map-container';
        johannesburgMap.innerHTML = '<h4>Johannesburg Location</h4><div id="johannesburgMapInner" style="height: 250px;"></div>';
        
        // Replacing images with map containers
        capeTownImg.parentNode.replaceChild(capeTownMap, capeTownImg);
        johannesburgImg.parentNode.replaceChild(johannesburgMap, johannesburgImg);
        
        // Initializing maps using OpenStreetMap.
        initializeMap('capeTownMapInner', -33.9249, 18.4241, 'Nations2Nations Cape Town');
        initializeMap('johannesburgMapInner', -26.2041, 28.0473, 'Nations2Nations Johannesburg');
    }
});

function initializeMap(mapId, lat, lng, popupText) {
    // Simple map implementation using iframe.
    const mapContainer = document.getElementById(mapId);
    mapContainer.innerHTML = `
        <iframe 
            width="100%" 
            height="100%" 
            frameborder="0" 
            scrolling="no" 
            marginheight="0" 
            marginwidth="0" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}"
            style="border: 1px solid #ccc">
        </iframe>
        <br/>
        <small>
            <a href="https://www.openstreetmap.org/?mlat=${lat}&amp;mlon=${lng}#map=15/${lat}/${lng}">View Larger Map</a>
        </small>
    `;
}
