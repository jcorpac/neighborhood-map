import React, { Component } from 'react';
import './App.css';

const GOOGLE_API_KEY = 'AIzaSyDara-LkUhcFTHJ6lgV_iprMMsbWtZA9fI';
const MAPS_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=3&callback=initMap`;
const FOURSQUARE_CLIENT_ID = 'KUBW02SULCU5BKARC0I5CBP2JO1H04JV0TVNERTJQ4OYYYFB';
const FOURSQUARE_CLIENT_SECRET = 'YXXDENZQH2Z35H15KB0FBRVMGXYMAGXDEBINGPBVKTMNUTF4';
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
  }

  state = {
    map: null,
    currentPins: [],
    venueData: {}
  }

  generateVenueURL(venueId) {
    return `${FOURSQUARE_VENUE_URL}${venueId}?client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20180523`
  }

  getVenueData() {
    let venueData = {};
    ALL_PINS.map((pin) => {
      fetch(this.generateVenueURL(pin.id))
      .then((response) => {
        if(response.ok) {return response.json();}
        throw new Error('Network response not OK');
      }).then((jsonData) => {
        venueData[pin.venueId] = jsonData.response.venue;
        return jsonData;
      })
    });
    this.setState({venueData: venueData});
  }

  componentWillMount() {
    window.initMap = this.initMap;

    this.setState({currentPins: ALL_PINS});

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
    this.getVenueData();
  }

  setPins(map, pins) {
    let newPins = [];
    let bounds = new window.google.maps.LatLngBounds();

    for(var i = 0; i < pins.length; i++) {
      var position = pins[i].location;
      var title = pins[i].title;
      var marker = new window.google.maps.Marker({
        position: position,
        title: title,
        map: map,
        animation: window.google.maps.Animation.DROP,
        id: pins[i].id
      });
      bounds.extend(marker.position);
      newPins.push(marker);
    }
    map.fitBounds(bounds);
    this.setState({currentPins: newPins});
    return map;
  }

  clearMarkers() {
    this.setState({currentPins: this.state.currentPins.map((marker) => {marker.setMap(null)})});
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

  render() {
    return (
      <div className="App">
        <input className="filterInput" type="text" placeholder="Search" onChange={this.filterPins}/>
        {this.state.currentPins.map((pin)=> (
          <div className="location" key={pin.id}>
            <h4>{pin.title}</h4>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
