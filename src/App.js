import React, { Component } from 'react';
import './App.css';

const GOOGLE_API_KEY = 'AIzaSyDara-LkUhcFTHJ6lgV_iprMMsbWtZA9fI';
const MAPS_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=3&callback=initMap`;
const PLACES_URL = `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_API_KEY}&placeid=`;

const DEFAULT_LOCATION = { lat: 36.334982, lng: -94.183662}
const DEFAULT_ZOOM = 11;

const ALL_PINS = [{
  name: 'Crystal Bridges Museum of American Art',
  location: {lat:36.382455, lng:-94.202809},
  placeid: 'ChIJW5IzxBQayYcROxRb5FkDJq0'
},{
  name: 'The Walmart Museum',
  location: {lat:36.372612, lng:-94.208917},
  placeid: 'ChIJNVzPwpkayYcRlsvVnLH6CEs'
},{
  name: 'The Walmart AMP',
  location: {lat:36.302676, lng:-94.183726},
  placeid: 'ChIJOYU0xw0RyYcRVQ5ZK_iFhjg'
},{
  name: 'Pinnacle Hills Promenade',
  location: {lat:36.304361, lng:-94.175287},
  placeid: 'ChIJ4XLQnhYRyYcRdJwE8e5aTHA'
},{
  name: 'Northwest Arkansas Community College',
  location: {lat:36.358598, lng:-94.172471},
  placeid: 'ChIJa3NSpZgQyYcREsRx-yfw5G8'
},{
  name: 'Whole Hog Cafe',
  location: {lat:36.333933, lng:-94.190465},
  placeid: 'ChIJ_aLJglgQyYcRNQ-ZRDuq49Y'
},{
  name: 'Carabbas Italian Grill',
  location: {lat:36.306328, lng:-94.187363},
  placeid: 'ChIJ5cJyKwkRyYcR8AuU-_HmEWo'
},{
  name: "Napoli's Italian Restaurant",
  location: {lat:36.333104, lng:-94.179032},
  placeid: 'ChIJEc7G7e4QyYcR2pWdL-t1MxQ'
},{
  name: 'Thai Basil',
  location: {lat:36.338589, lng:-94.209967},
  placeid: 'ChIJaxmsUkAQyYcRsaZdXCS2eP8'
},{
  name: 'Malco Rogers Towne Cinema Grill',
  location: {lat:36.340568, lng:-94.17644},
  placeid: 'ChIJg9VPUJIQyYcRmCDUEi93UhM'
}];

class App extends Component {

  constructor(props) {
    super(props);
    this.initMap = this.initMap.bind(this);
  }

  state = {
    map: null,
    currentPins: []
  }

  componentDidMount() {
    window.initMap = this.initMap;

    // Add Google Maps query to the end of the page body.
    const bodyTag = document.querySelector('body');
    let mapsTag = document.createElement('script');
    mapsTag.src = MAPS_URL;
    mapsTag.async = true;
    mapsTag.defer = true;
    bodyTag.appendChild(mapsTag);
  }

  initMap() {
    let map = new window.google.maps.Map(document.querySelector('#map'), {
      center: DEFAULT_LOCATION,
      zoom: DEFAULT_ZOOM,
      mapTypeControl: false
    });
    map = this.setPins(map, ALL_PINS);
    this.setState({map: map});
  }

  setPins(map, pins) {
    let newPins = [];
    let bounds = new window.google.maps.LatLngBounds();

    for(var i = 0; i < pins.length; i++) {
      var position = pins[i].location;
      var title = pins[i].name;
      var marker = new window.google.maps.Marker({
        position: position,
        title: title,
        map: map,
        animation: window.google.maps.Animation.DROP,
        id: i
      });
      bounds.extend(marker.position);
      newPins.push(marker);
    }
    map.fitBounds(bounds);
    this.setState({currentPins: newPins});
    return map;
  }

  render() {
    return (
      <div className="App">
        {ALL_PINS.map((pin)=> (
          <div className="location" key={pin.placeid}>
            <h3>{pin.name}</h3>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
