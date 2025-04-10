// Initialize Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoicmFuLW1hcCIsImEiOiJjbTlicmp4YXQwa2IyMmtxMWpvbTI1Y3MxIn0.648gkZUHOMLe8Nxww67Yww';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-73.9965, 40.7295],
    zoom: 15
});

// NYU locations data
const nyuLocations = [
    {
        id: 'bobst',
        name: 'Bobst Library',
        description: 'Main university library with 12 floors of resources',
        campus: 'washington-square',
        coordinates: [-73.9972, 40.7296]
    },
    {
        id: 'kimmel',
        name: 'Kimmel Center',
        description: 'Student center with dining, meeting spaces, and offices',
        campus: 'washington-square',
        coordinates: [-73.9968, 40.7292]
    },
    {
        id: 'tisch',
        name: 'Tisch School of the Arts',
        description: 'Arts school offering programs in film, theater, dance, etc.',
        campus: 'washington-square',
        coordinates: [-73.9953, 40.7308]
    },
    {
        id: 'stern',
        name: 'Stern School of Business',
        description: 'Undergraduate and graduate business programs',
        campus: 'washington-square',
        coordinates: [-73.9966, 40.7285]
    },
    {
        id: 'tandon',
        name: 'Tandon School of Engineering',
        description: 'Engineering and applied science programs',
        campus: 'tandon',
        coordinates: [-73.9866, 40.6945]
    },
    {
        id: 'brooklyn',
        name: 'NYU Brooklyn',
        description: 'Brooklyn campus with various academic programs',
        campus: 'brooklyn',
        coordinates: [-73.9872, 40.6938]
    }
];

// Handle window resizing
function handleResize() {
    const headerHeight = document.querySelector('header').offsetHeight;
    const container = document.querySelector('.container');
    container.style.height = `calc(100vh - ${headerHeight}px)`;
    container.style.marginTop = `${headerHeight}px`;
    map.resize();
}

// Add markers to map
function addMarkers() {
    nyuLocations.forEach(location => {
        const marker = new mapboxgl.Marker({
            color: '#57068c'
        })
        .setLngLat(location.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
            <h3>${location.name}</h3>
            <p>${location.description}</p>
        `))
        .addTo(map);
        
        location.marker = marker;
    });
}

// Initialize application
window.addEventListener('load', () => {
    handleResize();
    
    map.on('load', () => {
        addMarkers();
        populateLocationList();
        setupSearch();
        setupFilter();
    });
});

window.addEventListener('resize', handleResize);

// Format campus name for display
function formatCampusName(campusId) {
    const names = {
        'washington-square': 'Washington Square',
        'brooklyn': 'Brooklyn',
        'tandon': 'Tandon School of Engineering'
    };
    return names[campusId] || campusId;
}

// Populate the location list
function populateLocationList(filter = 'all') {
    const locationList = document.getElementById('location-list');
    locationList.innerHTML = '';
    
    const filteredLocations = filter === 'all' 
        ? nyuLocations 
        : nyuLocations.filter(loc => loc.campus === filter);
    
    filteredLocations.forEach(location => {
        const item = document.createElement('div');
        item.className = 'location-item';
        item.innerHTML = `
            <h3>${location.name}</h3>
            <p>${location.description}</p>
            <small>Campus: ${formatCampusName(location.campus)}</small>
        `;
        
        item.addEventListener('click', () => {
            // Fly to the location
            map.flyTo({
                center: location.coordinates,
                zoom: 16
            });
            
            // Open the popup
            location.marker.getPopup().addTo(map);
        });
        
        locationList.appendChild(item);
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase();
        if (!query) return;
        
        const results = nyuLocations.filter(location => 
            location.name.toLowerCase().includes(query) || 
            location.description.toLowerCase().includes(query)
        );
        
        if (results.length > 0) {
            // Fly to the first result
            map.flyTo({
                center: results[0].coordinates,
                zoom: 16
            });
            
            // Open its popup
            results[0].marker.getPopup().addTo(map);
            
            // Highlight in list
            populateLocationList('all');
            highlightResults(results.map(r => r.id));
        }
    }
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// Highlight search results in the list
function highlightResults(ids) {
    const items = document.querySelectorAll('.location-item');
    items.forEach(item => {
        const id = item.querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-');
        if (ids.includes(id)) {
            item.style.backgroundColor = '#e8d5f7';
            item.style.fontWeight = 'bold';
        } else {
            item.style.backgroundColor = 'white';
            item.style.fontWeight = 'normal';
        }
    });
}

// Filter functionality
function setupFilter() {
    const filter = document.getElementById('campus-filter');
    filter.addEventListener('change', (e) => {
        populateLocationList(e.target.value);
    });
}

// Initialize the application
map.on('load', () => {
    addMarkers();
    populateLocationList();
    setupSearch();
    setupFilter();
});