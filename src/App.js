import "swiper/swiper.min.css";
import "./App.scss";
import React, { useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";

// import Header from "./components/header/Header";
// import Footer from "./components/footer/Footer";
import tmdbApi from "../src/api/tmdbApi";
import Routes from "./routes/Routes";
import ChangeContentProvider from './context/contentContext'

function App() {
 

  return (
    <BrowserRouter>
    <Route
      render={() => (
        <>
        <ChangeContentProvider>
          <Routes />
          </ChangeContentProvider>
        </>
      )}
    />
  </BrowserRouter>
  );
}

export default App;
