import React from "react";
import { Route, Switch } from "react-router-dom";
import AddUser from "../pages/usermanagement/addUser";
import ContentMange from "../pages/contentmanagement/contentmanage";
import CreatePassword from "../pages/createPassword";
import EditUser from "../pages/usermanagement/editUser";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/signin";
import UserManagement from "../pages/usermanagement/userMange";
import ViewUser from "../pages/usermanagement/viewUser";
import ContentUpload from "../pages/contentmanagement/contentupload";
import Client from "../pages/clientmanagement/client";

import Profile from "../pages/profile";
// import Company from "../pages/clientmanagement/company/company";
import EditClient from "../pages/clientmanagement/editclient";
import MapContent from "../pages/contentmanagement/mapcontentnew";
import EditContent from "../pages/contentmanagement/editContent";
import ViewClient from "../pages/clientmanagement/viewClient";
import UpdateCompany from "../pages/clientmanagement/company/updateCompany";
import ViewCompany from "../pages/clientmanagement/company/viewCompany";
import Category from "../pages/categorymanagement/category";
import LookUp from "../pages/lookup/lookup";
import EditLookUp from "../pages/lookup/editLookUp";
import ClientSearch from "../pages/reports/clientSearch/clientSearch"
import ViewClientSearch from "../pages/reports/clientSearch/viewClientSearch";
import AllDeals from "../pages/dealmanagement/allDeals";
import Recommend from "../pages/reports/recommended/recommendNew";
import Contact from "../pages/reports/contactus/contactus";
import VideoRequest from "../pages/reports/videoRequests/videoRequest";
import AMReport from "../pages/reports/AMReport/AMReport";
import EditDeals from "../pages/dealmanagement/editDeal";
import BlockBuyer from "../pages/blockBuyer/blockBuyer";
import FrontendSettings from "../pages/frontendSettings/frontendSettings";
import LandingPage from "../pages/frontendSettings/landingPage";
import AdvancedSettings from "../pages/frontendSettings/advancedSettings";
import AppConfig from '../pages/settings/appConfig';
import Privacy from "../pages/frontendSettings/privacy";
import Terms from "../pages/frontendSettings/terms";
import AddDeals from "../pages/dealmanagement/addDeal";
import EditCategory from "../pages/categorymanagement/editCategory";
import ViewContent from "../pages/contentmanagement/viewContent";
import ViewCategory from "../pages/categorymanagement/viewCategory";
import ViewDeals from "../pages/dealmanagement/viewDeals";
import Team from "../pages/frontendSettings/team";
import Aboutus from "../pages/frontendSettings/aboutus";
import ViewLookUp from "../pages/lookup/viewLookup";
import ViewTerms from "../pages/frontendSettings/viewTerms";
import ViewPrivacy from "../pages/frontendSettings/ViewPrivacy";
import ViewTeam from "../pages/frontendSettings/ViewTeam";
import ViewAboutus from "../pages/frontendSettings/ViewAboutus";
import ViewAdvancedSettings from "../pages/frontendSettings/ViewAdvancedSettings";
import ViewLandingPage from "../pages/frontendSettings/ViewLandingPage";
import EditBlockBuyer from "../pages/blockBuyer/editBlockBuyer";
import Changecategoryorder from "../pages/categorymanagement/changeCategoryOrder";
import EmailLogs from "../pages/reports/emailLogs/emailLogs";
import ClientActivity from "../pages/reports/ClientActivity/ClientActivity";
import ClientSessions from "../pages/reports/ClientSessions/ClientSessions";
import TitleAnalysis from "../pages/reports/TitleAnalysis/TitleAnalysis";
import Orders from "../pages/ordersNew/orders";
import WorkShops from "../pages/workshops/workshops";
import Customers from "../pages/customers/customers";
import ViewWorkShop from "../pages/workshops/viewWorkshop";
import EditWorkShops from "../pages/workshops/editWorkshops";
import EditCustomer from "../pages/customers/editCustomer";
import ViewCustomer from "../pages/customers/viewCustomer";
import Products from "../pages/products/products";
import AddProduct from "../pages/products/editproduct";
import CreateOrders from "../pages/orders/createordersold";
import ViewOrder from "../pages/orders/viewOrder";
import Tasks from "../pages/tasks/tasks";
import ViewItem from "../pages/tasks/viewItem";
import ViewProduct from "../pages/products/viewProducts";
import GoogleMap from "../pages/googlemap";
import AlgoliaSearch from "../pages/angolia";
import EditOrder from "../pages/ordersNew/ordersV1";


import Item from "../pages/orders/scanedpage";
import Activity from "../pages/spacoversreports/activity";
import Sessions from "../pages/spacoversreports/sessions";
import OrdersNew from "../pages/ordersNew/orders";
import OrdersV1 from "../pages/ordersNew/ordersV1";
import SewingReports from "../pages/spacoversreports/sewingReports";
import propertyCalculator from "../pages/propertyCalculator";
import landingPage from "../pages/landingPage";
import SignInOtp from "../pages/loginOtp";
import Dashboard from "../pages/Dashboard";
import SignUp from "../pages/signup";
import Search from "../pages/Search";
import Myaccount from "../pages/Myaccount";
import SavedProperties from "../pages/SavedProperties";
import PropertyCalculatorV1 from "../pages/PropertyCalculatorV1";
import Company from "../pages/Company";
import YellowForm from "../pages/YellowForm";
import Lookups from "../pages/lookups";
import LookupForm from "../pages/LookupForm";
import Branches from "../pages/Branches";
import Models from "../pages/Models";
import Insurance from "../pages/Insurance";
import Finance from "../pages/Finance";
import Fastag from "../pages/Fastag";
import AddForm from "../pages/AddForm";
import User from "../pages/User";
import Purchases from "../pages/Purchases";

const Routes = () => {
  return (
    <Switch>

      <Route path={'/'} exact component={landingPage} />

      <Route path={`/createpassword`} component={CreatePassword} />
      <Route path={`/login`} component={SignIn} />

      <Route path={`/company`} component={Company} />
      <Route path={`/editcompany/:id`} component={UpdateCompany} />
      <Route path={`/viewcompany/:id`} component={ViewCompany} />
      <Route path={`/addcompany`} component={UpdateCompany} />


      <Route path={`/clientsearch`} component={ClientSearch} />
      <Route path={`/team`} component={Team} />
      <Route path={`/viewclientsearch/:id`} component={ViewClientSearch} />

      <Route path={`/recommended`} component={Recommend} />
      <Route path={`/emaillogs`} component={EmailLogs} />
      <Route path={`/contactus`} component={Contact} />
      <Route path={`/accountmanagers`} component={AMReport} />
      <Route path={`/videorequests`} component={VideoRequest} />
      <Route path={`/clientactivity`} component={ClientActivity} />
      <Route path={`/clientsessions`} component={ClientSessions} />
      <Route path={`/titleanalysis`} component={TitleAnalysis} />

      <Route path={`/categorymanagement`} component={Category} />
      <Route path={`/editcategory/:id`} component={EditCategory} />
      <Route path={`/viewcategory/:id`} component={ViewCategory} />
      <Route path={`/addcategory`} component={EditCategory} />
      <Route path={`/blockbuyer`} component={BlockBuyer} />
      <Route path={`/addblockbuyer`} component={EditBlockBuyer} />
      <Route path={`/editblockbuyer`} component={EditBlockBuyer} />

      <Route path={`/users`} component={UserManagement} />
      <Route path={`/createuser`} component={AddUser} />
      <Route path={`/adduser`} component={EditUser} />

      <Route path={`/edituser/:id`} component={EditUser} />
      <Route path={`/viewuser/:id`} component={ViewUser} />

      <Route path={`/contentmanagement`} component={ContentMange} />
      <Route path={`/contentupload`} component={ContentUpload} />
      <Route path={`/editcontent/:id`} component={EditContent} />
      <Route path={`/viewcontent/:id`} component={ViewContent} />
      <Route path={`/addcontent`} component={EditContent} />
      <Route path={`/contentmap`} component={MapContent} />

      <Route path={`/settings/:id`} component={AppConfig} />


      <Route path={`/dealmanagement`} component={AllDeals} />
      <Route path={`/editdeals/:id`} component={EditDeals} />
      <Route path={`/viewdeals/:id`} component={ViewDeals} />
      <Route path={`/createdeal`} component={AddDeals} />
      <Route path={`/frontendsettings`} component={FrontendSettings} />
      <Route path={`/landingpage`} component={LandingPage} />
      <Route path={`/advancedsearch`} component={AdvancedSettings} />
      <Route path={`/privacypolicy`} component={Privacy} />
      <Route path={`/terms`} component={Terms} />
      <Route path={`/viewterms`} component={ViewTerms} />
      <Route path={`/viewprivacypolicy`} component={ViewPrivacy} />
      <Route path={`/viewteam`} component={ViewTeam} />
      <Route path={`/viewaboutus`} component={ViewAboutus} />
      <Route path={`/viewlandingpage`} component={ViewLandingPage} />
      <Route path={`/viewadvancedsearch`} component={ViewAdvancedSettings} />
      <Route path={`/aboutus`} component={Aboutus} />

      <Route path={`/profile`} component={Profile} />
      <Route path={`/changeCategoryOrder`} component={Changecategoryorder} />



      <Route path={`/clients`} component={Client} />
      <Route path={`/editclient/:id`} component={EditClient} />
      <Route path={`/viewclient/:id`} component={ViewClient} />
      <Route path={`/addclient`} component={EditClient} />
      <Route path={`/activity`} component={Activity} />
      <Route path={`/sessions`} component={Sessions} />
      <Route path={`/sewingreport`} component={SewingReports} />

      {/* <Route path={`/lookups`} component={LookUp} /> */}
      <Route path={`/editlookup/:id`} component={EditLookUp} />
      <Route path={`/viewlookup/:id`} component={ViewLookUp} />
      <Route path={`/addlookup`} component={EditLookUp} />
      <Route path={`/orders`} component={Orders} />
     
      {/* <Route path={`/ordersv1`} component={OrdersNew}/> */}
      {/* <Route path={`/ordersnew`} component ={OrdersV1}/>      */}
      {/* <Route path={`/editordersnew/:id`} component ={OrdersV1}/> */}
      
      <Route path={`/workshops`} component={WorkShops} />
      <Route path={`/viewworkshop/:id`} component={ViewWorkShop} />
      <Route path={`/editworkshop/:id`} component={EditWorkShops} />
      <Route path={`/addworkshop`} component={EditWorkShops} />
      <Route path={`/members`} component={Customers} />
      <Route path={`/editmember/:id`} component={EditCustomer} />
      <Route path={`/addmember`} component={EditCustomer} />
      <Route path={`/viewwholesaler/:id`} component={ViewCustomer} />
      <Route path={`/products`} component={Products} />
      <Route path={`/addproduct`} component={AddProduct} />
      <Route path={`/editproduct/:id`} component={AddProduct} />
      <Route path={`/viewproduct/:id`} component={ViewProduct} />
      <Route path={`/createorder`} component={EditOrder} />
      <Route path={`/vieworder/:id`} component={ViewOrder} />
      <Route path={`/editorder/:id`} component={EditOrder} />
      <Route path={`/items`} component={Tasks} />
      <Route path={`/viewitem/:id`} component={ViewItem} />
      <Route path={`/item/:id/:orderstatus`} component={Item} />
      <Route path={`/map`} component={GoogleMap} />
      <Route path={`/map1`} component={AlgoliaSearch} />
      <Route path={`/propertyCalculator`} component={propertyCalculator} />
      <Route path={`/loginotp`} component={SignInOtp} />
      <Route path={`/dashboard`} component={Dashboard} />
      <Route path={`/signup`} component={SignUp} />
      <Route path={`/search`} component={Search} />
      <Route path={`/profile`} component={Myaccount} />
      <Route path={`/properties`} component={SavedProperties} />
      <Route path={`/calculator`} component={PropertyCalculatorV1} />
      <Route path={`/company`} component={Company} />
      <Route path={`/yellowForm`} component={YellowForm} />
      <Route path={`/lookups`} component={Lookups} />
      <Route path={`/lookupForm`} component={LookupForm} />
      <Route path={`/branches`} component={Branches} />
      <Route path={`/models`} component={Models} />
      <Route path={`/insurance`} component={Insurance} />
      <Route path={`/finance`} component={Finance} />
      <Route path={`/fastag`} component={Fastag} />
      <Route path={`/createForm`} component={AddForm} />
      <Route path={`/user`} component={User} />
      <Route path={`/purchases`} component={Purchases} />
      {/* <Route path={`/landingPage`} component={landingPage} /> */}

      <Route path={`*`} component={NotFound} />




    </Switch>
  );
};

export default Routes;
