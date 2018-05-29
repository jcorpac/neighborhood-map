import React, {Component} from 'react';

const GOOGLE_API_KEY = 'AIzaSyDara-LkUhcFTHJ6lgV_iprMMsbWtZA9fI';
const MAPS_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=3&callback=initMap`;

class Map extends Component {

  loadError(error) {
    alert("An error occurred loading Google Maps");
    console.error(`An error occurred while attempting to open ${MAPS_URL}`);
  }

  componentWillMount() {
    // Add Google Maps query to the end of the page body.
    const bodyTag = document.querySelector('body');
    let mapsTag = document.createElement('script');
    mapsTag.src = MAPS_URL;
    mapsTag.onerror = this.loadError;
    mapsTag.async = true;
    mapsTag.defer = true;
    bodyTag.appendChild(mapsTag);
  }

  render() {
    return (
      <div id="map" role="application" tabIndex="-1">Google Maps is loading. Please wait.</div>
    );
  }
}
export default Map;
