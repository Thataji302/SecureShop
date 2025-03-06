/***
**Module Name: Header 
 **File Name :  Header.js
 **Project :    Orasi Media
 **Copyright(c) : X Platform Consulting.
 **Organization : Peafowl Inc
 **author :  chandrasekhar
 **author :  Hari
 **license :
 **version :  1.0.0
 **Created on :
 **Created on: Dec 27 2022
 **Last modified on: Dec 27 2022
 **Description : contains header component details.
 ***/
import React, { useState, useEffect, useContext, useCallback } from "react";
// import { Link, useLocation, useHistory } from "react-router-dom";
// import Header from ".././components/dashboard/header";
import Header from ".././components/header/Header";
import { useHistory } from "react-router";
// import * as Config from "./../../constants/Config";
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useJsApiLoader } from '@react-google-maps/api';
import propertyCalculator from "./propertyCalculator";
let token = localStorage.getItem("token")
// const headerNav = [
//   {
//     display: "Home",
//     path: `/${Config.HOME_PAGE}`,
//   },
//   {
//     display: "Movies",
//     path: `/${Config.HOME_PAGE}/movie`,
//   },
//   {
//     display: "TV Series",
//     path: `/${Config.HOME_PAGE}/tv`,
//   },
// ];


const Myaccount = (props) => {
    // const { pathname } = useLocation();
    // const headerRef = useRef(null);
    // const [scroll, setScroll] = useState(false);
    const history = useHistory();
    const libraries = ["places"];
    // console.log("props", props.menus);
    // const active = headerNav.findIndex((e) => e.path === pathname);
    const [searchBox, setSearchBox] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [searchData, setSearchData] = useState(null);
    const [searchValueData, setSearchValueData] = useState(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCbt0tJTo-ltu5B5xTGurz5GLRCZCEVkF4',
        libraries: libraries,
    });
    const onSearchBoxLoad = useCallback((ref) => {
        setSearchBox(ref);
    }, []);
    function fetchAndStorePlaceImage(place, callback) {
        // Define the Street View Service
        const streetViewService = new window.google.maps.StreetViewService();

        // Request Street View data for the place's location
        streetViewService.getPanorama({ location: place.geometry.location }, (data, status) => {
            if (status === 'OK') {
                // Construct the URL of the Street View image
                const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${place.geometry.location.lat()},${place.geometry.location.lng()}&key=AIzaSyCbt0tJTo-ltu5B5xTGurz5GLRCZCEVkF4`;

                // Call the callback function with the image URL
                callback(imageUrl);
            } else {
                console.error('Could not retrieve Street View image for the place:', status);
                // Call the callback function with null if image retrieval fails
                callback(null);
            }
        });
    }
    const onPlacesChanged = () => {
        const inputValue = document.querySelector('.searchcontroll').value;
        console.log('inputValue', inputValue);
        setSearchValueData(inputValue)
        if (inputValue === '') {
            // Search has been cleared
            console.log('Search cleared');
            // Handle the cleared search as needed (e.g., reset selected place)
            props?.setSelectedPlace('');
            return; // Exit early if the input is empty
        }

        const places = searchBox.getPlaces();
        console.log('places', places);
        const addressData = {}; // Initialize address data object

        // Process address components from the Places API
        places?.[0]?.address_components?.forEach(place => {
            place.types.forEach(type => {
                switch (type) {
                    case 'street_number':
                        addressData.street_number = place.long_name;
                        break;
                    case 'route':
                        addressData.route = place.long_name;
                        break;
                    case 'locality':
                        addressData.locality = place.long_name;
                        break;
                    case 'postal_code':
                        addressData.postal_code = place.long_name;
                        break;
                    // Add additional cases as needed
                    default:
                        break;
                }
            });
        });

        // Use Geocoder to fetch more detailed address information
        const geocoder = new window.google.maps.Geocoder();

    };
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        console.log('valueee----->', value)

        // Check if the input is empty
        if (value === '') {
            console.log('Input cleared');
            props?.setSelectedPlace('');
            // Handle the input clear case here (e.g., resetting state or triggering a search)
        }
    };


    return (
        <div id="layout-wrapper">

            <Header />

            <div className="main-content">

                <div className="page-content my_account">
                    <div className="container-fluid">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="title">My Account</h4>
                        </div>
                        <div className="row">
                            <div className="col-md-6 pe-5">
                                <h3>User Details</h3>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">NAME</label>
                                            <input className="form-control" placeholder="Enter Name" type="text" id="example-text-input" value="Kodandarao" />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">E MAIL ID</label>
                                            <input className="form-control contact-number" type="email" placeholder=" Enter Company Email" id="example-email-input" value="kodandarao@sanchaninfo.com" />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">PHONE NUMBER</label>
                                            <div className="country-code">
                                                <select name="idc" className="colorselect capitalize">
                                                    <option value="">Select</option><option value=" ABW"> ABW(+297)</option>
                                                    <option value=" AGO"> AGO(+244)</option><option value=" AIA"> AIA(+1-264)</option>
                                                    <option value=" ALB"> ALB(+355)</option>
                                                    <option value=" AND"> AND(+376)</option>
                                                </select>
                                                <input className="form-control contact-number" type="tel" name="phone" placeholder="Phone number" id="example-tel-input" value="9705226371" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 ps-5">
                                <h3>CHANGE PASSWORD</h3>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">Old Password<span className="required">*</span></label>
                                            <input type="password" name="oldPassword" placeholder="Old Password" className="form-control" value="" />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">New Password<span className="required">*</span></label>
                                            <input type="password" name="password" placeholder="Password" className="form-control" value="" />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label for="example-text-input" className="col-form-label">Confirm Password<span className="required">*</span></label>
                                            <input type="password" name="confirmPassword" placeholder="Password" className="form-control" value="" />
                                        </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <div className="flex-left terms-block">
                                            <input type="checkbox" id="terms-check" />
                                            <label>Show Password</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mb-4">
                                        <button className="btn btn-primary"> UPDATE</button>
                                    </div>
                                </div>
                            </div>

                        </div>




                    </div>
                </div>




                <footer className="footer">
                    <div className="container-fluid">
                        <div className="row">

                            <div className="col-sm-12 text-center">
                                <div className="text-sm-center d-none d-sm-block text-center">
                                    All Rights Reserved 2024.
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>


        </div>
    );
};



export default Myaccount;
