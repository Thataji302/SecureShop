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


const LandingPage = (props) => {
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

    useEffect(() => {
        if (localStorage.getItem("token")) {
            history.push("/dashboard");
        }

    }, []);
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
        geocoder.geocode({ location: places[0]?.geometry.location }, (results, status) => {
            if (status === 'OK' && results[0]) {
                fetchAndStorePlaceImage(results[0], (imageUrl) => {
                    // Store the image URL in addressData
                    addressData.image = imageUrl;
                    console.log('Image URL:', imageUrl);
                    props?.setAddressData(prevData => ({
                        ...prevData,
                        image: imageUrl
                    }));
                });
                const addressComponents = results[0].address_components;
                console.log('addressComponentsaddressData', addressData);
                addressComponents.forEach(component => {
                    const types = component.types;
                    if (types.includes('locality')) {
                        addressData.city = component.long_name;
                    } else if (types.includes('administrative_area_level_1')) {
                        addressData.state = component.long_name;
                    } else if (types.includes('postal_code')) {
                        addressData.postal_code = component.long_name;
                    } else if (types.includes('sublocality_level_1')) {
                        addressData.area = component.long_name;
                    }
                });
            } else {
                console.error('Geocoder failed due to: ', status);
            }

            // Log the processed address data
            // console.log('addressDatahere',addressData.image);
            setSearchData(addressData)

            // Update props with the processed address data
            // props?.setAddressData(prevData => ({
            //     ...prevData,
            //     url: places[0]?.url,
            //     geolocation: places[0]?.geometry,
            //     zipcode: addressData.postal_code || '',
            //     state: addressData.state || addressData.city || '',
            //     address: `${addressData.street_number || ''} ${addressData.route || ''}`,
            //     city: addressData.city || '',
            //     area: addressData.area || '',
            //     fullAddress: places[0].formatted_address,
            //     image: addressData.image
            // }));

            // Set the selected place if formatted address is available
            // if (places[0].formatted_address) {
            //     console.log("place address",places[0].formatted_address);
            //     props?.setSelectedPlace(places[0].formatted_address);
            //     if(props?.placeIndex){
            //         props?.setAddressIndex({...props?.addressIndex,[props?.placeIndex]:props?.placeIndex});// comes from deal under wrtiting termsheet
            //     }

            // }
        });
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
    const handleSearch = () => {
        console.log('searchValueData', searchValueData)
        console.log('searchData', searchData)
        let locData = JSON.stringify(searchData)
        console.log('locData', locData)
        localStorage.setItem("searchData", locData)
        localStorage.setItem("searchValueData", searchValueData)
        if (searchData !== null) {
            console.log('searchValueData', searchValueData)
            history.push("/calculator")
        }
        // const value = event.target.value;
        // setInputValue(value);
        // console.log('valueee----->',value)

        // // Check if the input is empty
        // if (value === '') {
        //   console.log('Input cleared');
        //   props?.setSelectedPlace('');
        //   // Handle the input clear case here (e.g., resetting state or triggering a search)
        // }
    };

    return (
        <div className="landing_page">
            {/* {token && */}
            <Header />
            {/* } */}
            <div class="estimate_calculator">
                <div class="container">
                    <div class="estimate_price">
                        <h1>Efficiently Launch Talent with Freelance Platforms</h1>
                        <div class="d-flex align-items-start mt-3 mb-4 justify-content-between">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <div class="d-flex align-items-center">
                                <a class="register">Get Started</a>
                                <a class="register btn-outline ms-2">Contact Us</a></div>
                        </div>
                    </div>
                    <img class="w-100" src="./assets/images/dummy.png" />
                    {/* <div class="adv_tools">
                        <h2>Advantages of Tools</h2>
                        <p>Nam pharetra egestas tellus, at lobortis erat. Cras vitae auctor nunc.</p>
                        <div class="d-flex align-items-center mt-4 mb-4">
                            <div class="tool_block">
                                <div class="tool_card">
                                    <a href="#">
                                        <span class="material-symbols-outlined">cottage</span>
                                        <h5>Property Valuation</h5>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus enim ex, et bibendum dui lobortis et.</p>
                                        <button type="button">Read More<span class="material-symbols-outlined">arrow_forward</span></button>
                                    </a>
                                </div>
                            </div>
                            <div class="tool_block">
                                <div class="tool_card">
                                    <a href="#">
                                        <span class="material-symbols-outlined"><span class="material-symbols-outlined">
                                            quick_reference_all
                                        </span></span>
                                        <h5>Title Check</h5>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus enim ex, et bibendum dui lobortis et.</p>
                                        <button type="button">Read More<span class="material-symbols-outlined">arrow_forward</span></button>
                                    </a>
                                </div>
                            </div>
                            <div class="tool_block">
                                <div class="tool_card">
                                    <a href="#">
                                        <span class="material-symbols-outlined">trending_up</span>
                                        <h5>Rates and Trends</h5>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus enim ex, et bibendum dui lobortis et.</p>
                                        <button type="button">Read More<span class="material-symbols-outlined">arrow_forward</span></button>
                                    </a>
                                </div>
                            </div>
                            <div class="tool_block">
                                <div class="tool_card">
                                    <a href="#">
                                        <span class="material-symbols-outlined">calculate</span>
                                        <h5>calculator</h5>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus enim ex, et bibendum dui lobortis et.</p>
                                        <button type="button">Read More<span class="material-symbols-outlined">arrow_forward</span></button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div class="reserved">
                    <p>All Rights Reserved 2024.</p>
                </div>
            </div>
        </div>
    );
};



export default LandingPage;
