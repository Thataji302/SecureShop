import React, { useState, useEffect } from 'react';

const GoogleMap = () => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    // Load the Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCbt0tJTo-ltu5B5xTGurz5GLRCZCEVkF4&libraries=places`;
    script.async = true;
    script.onload = initializeMap;
    document.body.appendChild(script);

    // Clean up the script tag when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    // const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
    //   center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
    //   zoom: 12,
    // });

    //setMap(mapInstance);

    const input = document.getElementById('search-input');
    const searchBox = new window.google.maps.places.SearchBox(input);

    // mapInstance.addListener('bounds_changed', () => {
    //   searchBox.setBounds(mapInstance.getBounds());
    // });

    searchBox.addListener('places_changed', () => {
      const newPlaces = searchBox.getPlaces();
      setPlaces(newPlaces);

      if (newPlaces.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        newPlaces.forEach(place => {
          if (place.geometry && place.geometry.location) {
            bounds.extend(place.geometry.location);
          }
        });
        // mapInstance.fitBounds(bounds);
      }
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };
  console.log("place",searchInput,places)

  return (
    <div>
      <input
        id="search-input"
        type="text"
        placeholder="Search for a location..."
        value={searchInput}
        onChange={handleSearchInputChange}
      />
      {places.length > 0 && (
        <ul>
          {places.map((place, index) => (
            <li key={index}>{place.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoogleMap;