import React, { Component } from 'react';
import Map from './components/Map';
import LocationList from './components/LocationList'
import './App.css';

const FOURSQUARE_CLIENT_ID = 'DNF1NOLDSH02IGRFWK2FIKRIFHPXUNF3TPDY3LX4V5XADENE';
const FOURSQUARE_CLIENT_SECRET = 'IGHV53OUPXP24ELLVUOCJUEVT1NSMZF1MT1YKOI1JZVYDMIO';
const FOURSQUARE_VENUE_URL = 'https://api.foursquare.com/v2/venues/';

const DEFAULT_LOCATION = { lat: 36.334982, lng: -94.183662};
const DEFAULT_ZOOM = 11;

const ALL_PINS = [{
  title: 'Crystal Bridges Museum of American Art',
  location: {lat:36.382455, lng:-94.202809},
  id: '4c001046c30a2d7f45f1111d'
},{
  title: 'The Walmart Museum',
  location: {lat:36.372612, lng:-94.208917},
  id: '4bc76df914d79521d25e67e9'
},{
  title: 'Scott Family Amazeum',
  location: {lat:36.379356, lng:-94.197245},
  id: '55997726498e20cc6ad28294'
},{
  title: 'The Walmart AMP',
  location: {lat:36.302676, lng:-94.183726},
  id: '533629ef11d26583cf2709a7'
},{
  title: 'Whole Hog Cafe',
  location: {lat:36.333933, lng:-94.190465},
  id: '4b4f87fff964a520300a27e3'
},{
  title: 'Carabbas Italian Grill',
  location: {lat:36.306328, lng:-94.187363},
  id: '4b8d3d63f964a52046ef32e3'
},{
  title: "Napoli's Italian Restaurant",
  location: {lat:36.333104, lng:-94.179032},
  id: '4f63c83de4b06cb9faa0782f'
},{
  title: 'Thai Basil',
  location: {lat:36.338589, lng:-94.209967},
  id: '547fa8d2498ed66921ce6b96'
},{
  title: 'Malco Rogers Towne Cinema Grill',
  location: {lat:36.340568, lng:-94.17644},
  id: '4bc8f093b6c49c742a798d91'
},{
  title: 'Bentonville Brewing Company',
  location: {lat:36.316812, lng:-94.117871},
  id: '5570cc25498e84218b1f2db9'
}];

class App extends Component {

  constructor(props) {
    super(props);
    this.initMap = this.initMap.bind(this);
    this.filterPins = this.filterPins.bind(this);
    this.clearMarkers = this.clearMarkers.bind(this);
    this.locationClicked = this.locationClicked.bind(this);
  }

  state = {
    map: null,
    currentPins: [],
    venueData: {}
  }

  getVenueData() {
    let venueData = {};
    let venueURL = ''
    ALL_PINS.map((pin) => {
      venueURL = `${FOURSQUARE_VENUE_URL}${pin.id}?client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20180523`;
      fetch(venueURL)
      .then((response) => {
        if(response.ok) {return response.json();}
        throw new Error('Network response not OK');
      }).then((jsonData) => {
        venueData[pin.id] = jsonData.response.venue;
        return jsonData;
      }).catch((error) => {console.error(error);})
      return true;
    });
    this.setState({venueData: venueData});
  }

  componentWillMount() {
    window.initMap = this.initMap;

    this.setState({currentPins: ALL_PINS});
    this.getVenueData();
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

    pins.forEach((pin) => {
      let locationId = pin.id;

      let marker = new window.google.maps.Marker({
        position: pin.location,
        title: pin.title,
        map: map,
        animation: window.google.maps.Animation.DROP,
        id: pin.id
      });
      marker.addListener('click', () => {
        // Open InfoWindow
        this.openInfoWindow(locationId, marker);
      });
      bounds.extend(marker.position);
      newPins.push(marker);
    });
    map.fitBounds(bounds);
    this.setState({currentPins: newPins});
    return map;
  }

  clearMarkers() {
    this.setState({currentPins: this.state.currentPins.map((marker) => {marker.setMap(null); return true;})});
  }

  openInfoWindow(locationId, marker) {
    let locationData = {};
    let infoWindow = new window.google.maps.InfoWindow();
    let infoContent = '';
    if(this.state.venueData[locationId] !== undefined){
      let thisVenue = this.state.venueData[locationId];
      locationData.title = thisVenue.name ? thisVenue.name : marker.title;
      locationData.phone = thisVenue.contact.formattedPhone ? thisVenue.contact.formattedPhone : 'Phone number not available';
      locationData.address = thisVenue.location.formattedAddress ? thisVenue.location.formattedAddress.join(' ') : 'Address not available';
      locationData.website = thisVenue.url ? `<a href=${thisVenue.url} target="_blank">${thisVenue.url}</a>` : 'Not Available';
      infoContent = `<div tabindex="0">
        <h4 role="heading">${locationData.title}</h4>
        <p>Phone# ${locationData.phone}</p>
        <p>Address: ${locationData.address}</p>
        <p>Website: ${locationData.website}<p>
        <p><a href="https://foursquare.com/v/${marker.id}/" target="_blank">More Info on FourSquare</a></p>
        <p>Venue data provided by FourSquare</p>
        </div>`
    } else {
      infoContent = 'Unable to retrieve data from FourSquare';
    }
    infoWindow.setContent(infoContent);
    infoWindow.open(this.state.map, marker);
    }

  filterPins(event) {
    this.clearMarkers();
    let currentPins = ALL_PINS;
    if(event.target.value !== "") {
      currentPins = ALL_PINS.filter((pin) => {
        return pin.title.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
      });
    }

    let map = this.state.map;
    map = this.setPins(map, currentPins);
    this.setState({map: map});
  }

  locationClicked(locationId) {
    for(let pin of this.state.currentPins) {
      if(pin.id === locationId){
        pin.setAnimation(window.google.maps.Animation.BOUNCE);
        pin.setAnimation(null);
        this.openInfoWindow(locationId, pin);
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Map/>
        <LocationList currentPins={this.state.currentPins} locationClicked={this.locationClicked} filterPins={this.filterPins} />
      </div>
    );
  }
}

export default App;
