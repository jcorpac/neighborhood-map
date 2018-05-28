# Neighborhood Map (React) Project

## Table of Contents

* [Project Description](#project-description)
* [Installation](#installation)
* [Application Requirements](#application-requirements)
* [Data Attribution](#data-attribution)

## Project Description

This application was created as part of the Udacity Front End Nanodegree to demonstrate understanding of development using APIs. The application uses the Google Maps API to display points of interest in my vicinity, and pulls detail information from a 3rd party API run by FourSquare. Additionally, the application runs on the React framework to present a filterable list of location names, and updates the markers on the map to show the filtered locations.

## Installation

This application requires that git, a copy of Node.JS, and the Node Package Manager (npm) be installed on the computer that it is running on.

1. From the console, use `git clone https://github.com/jcorpac/neighborhood-map.git` to create a copy of the application on your server.
2. Use `cd neighborhood-map` to enter the project directory.
3. Run `npm install` to download the required Node.js modules.

Once the Node modules are installed, you can start the server by running `npm start` from the project directory. The application will be available on that machine, at port 3000. If you have a web browser on the machine, then a start program will automatically open a browser to `http://localhost:3000` and display the application.

## Application Requirements

This application requires access to the internet to install and to operate. Running the install process requires internet access to download the React NPM modules in order for the application to properly install.

When using the application, internet access is required to access the Google Maps, and FourSquare Venue details APIs. The required keys for both APIs are included as constants in the App.js file.

## Data Attribution

Data for the InfoWindows connected to the map markers is provided by FourSquare's venue details API. Details on the API can be found at https://developer.foursquare.com/docs/api/venues/details
