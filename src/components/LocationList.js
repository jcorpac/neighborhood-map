import React from 'react';

function LocationList({filterPins, currentPins, locationClicked}) {
  return (
    <div className="LocationList">
      <input className="filterInput" type="text" placeholder="Search" onChange={filterPins}/>
      {currentPins.map((pin)=> (
        <div className="location" key={pin.id} onClick={() => (locationClicked(pin.id))} tabIndex='0' role='link'>
          <h4>{pin.title}</h4>
        </div>
      ))}
    </div>
  );
}

export default LocationList;
