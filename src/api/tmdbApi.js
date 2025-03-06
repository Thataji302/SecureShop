import axiosClient from "./axiosClient";
import * as Config from "../constants/Config";
let { appname } = window.app;

const tmdbApi = {
  websitedefaults: (params) => {
    const url = "/config?" + 'appname=' + appname;
    return axiosClient.get(url, params);
  },

  appMenus: (params) => {
    const url = "/menus?" + 'appname=' + appname + '&appType=client&page=landingpage';
    return axiosClient.get(url, params);
  },

  signin: (params) => {
    const url = "/signIn?appname=" + appname;
    return axiosClient.post(url, params);
  },

  CreatePassword: (params) => {
    const url = "/setPassword?appname=" + appname;
    return axiosClient.post(url, params);
  },

  ForgotPassword: (params) => {
    const url = "/forgotPassword?appname=" + appname;
    return axiosClient.post(url, params);
  },
  
  Adduser: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/user?appname=" + appname + "&token=" + token+ '&userid=' + userid;
    return axiosClient.put(url, params);
  },


  getContent: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/content?appname=" + appname + "&token=" + token+ '&userid=' + userid;
    return axiosClient.post(url, params);
  },

  dataImport: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")

    const url = "/importData?appname=" + appname + "&token=" + token + '&userid=' + userid;
    return axiosClient.post(url, params);
  },

  getCompany: (params) => {
    const token = localStorage.getItem("token")
    const url = "/companies?appname=" + appname + "&token=" + token;
    return axiosClient.get(url, params);
  },

  SaveClient: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/client?appname=" + appname + "&token=" + token + '&userid=' + userid;
    return axiosClient.put(url, params);
  },

  FollowUp: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/followup?appname=" + appname + "&token=" + token + '&userid=' + userid;
    return axiosClient.put(url, params);
  },

  AddCompany: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/company?appname=" + appname + "&token=" + token + '&userid=' + userid;
    return axiosClient.put(url, params); 
  },

  getAccount: (params) => {
    const token = localStorage.getItem("token")
    const url = "/accountmangers?appname=" + appname + "&token=" + token;
    return axiosClient.get(url, params);
  },

  getCategory: (params) => {
    const token = localStorage.getItem("token")
    // const url = "/category?appname=" + appname + "&token=" + token +"&status=ACTIVE";
    const url = "/category?appname=" + appname + "&token=" + token;
    return axiosClient.get(url, params);
  },

  getLookUp: (params) => {
    const token = localStorage.getItem("token")
    
    let payload = params
    let projection = params?.projection ? params?.projection : "";
    let status = params?.status ? params?.status : "";
    let url = "/lookups?appname=" + appname;
    
    if( projection != "") { url = url + `&projection=tiny`}
    if( status != "") { url = url + `&status=ACTIVE`}
   
    if (payload.hasOwnProperty('projection')) delete payload['projection']
    if (payload.hasOwnProperty('status')) delete payload['status']

    return axiosClient.post(url, payload);

  },

  getUserData: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId") || localStorage.getItem("userid")
    const url = "/user?appname="+ appname +"&userId="+userid+ "&token=" + token;
    return axiosClient.get(url, params);
  },

  filterCategory: (params) => {
    const userid = localStorage.getItem("userId")
    const token = localStorage.getItem("token")
 //   let pageNumber = params.pageNumber || 1;
//    let assetcount = params.assetcount || 10;
   // let cat = params.category || "";
    let url = "/content?appname="+ appname + "&token=" + token + '&userid=' + userid;
    // if( pageNumber != "") { url = url + `&pageNumber=${pageNumber}`}
    // if( assetcount != "") {url = url + `&assetcount=${assetcount}`}
    return axiosClient.post(url, params);

  },

  userDataUpdate: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/user?appname="+ appname +"&userId="+userid + "&token=" + token;
    return axiosClient.post(url, params);
  },

   pwdGenerate: (params) => {
    debugger
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/setPassword?appname=" + appname+'&userid=' + userid;
    return axiosClient.post(url, params);
  },

  clientSearch: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/clientSearch?appname=" + appname + "&token=" + token + '&userid=' + userid;
    return axiosClient.post(url, params);
  },

  AllDeals: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/clientEnquiry?appname=" + appname + "&token=" + token + '&userid=' + userid;
    return axiosClient.post(url, params);
  },

  UpdateDeals: (params) => {
    let payload=params;
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/clientEnquiry?appname=" + appname + "&enquiryid=" + params.enquiryid +  "&token=" + token+ '&userid=' + userid;
    if (payload.hasOwnProperty('enquiryid')) delete payload['enquiryid']
    return axiosClient.put(url, payload);
  },

  UpdateFollowupDeals: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/enquiryFollowup?appname=" + appname + "&token=" + token+ '&userid=' + userid;
    return axiosClient.post(url, params);
  },

  AddDeal: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/clientEnquiry?appname=" + appname + "&token=" + token + '&userid=' + userid;
    return axiosClient.post(url, params);
  },
  
  GetSellers: (params) => {
    const token = localStorage.getItem("token")
    const url = "/companyList?appname=" + appname + "&token=" + token ;
    return axiosClient.get(url, params);
  },

  GetBuyers: (params) => {
    const token = localStorage.getItem("token")
    const url = "/blockCompanyList?appname=" + appname + "&token=" + token +"&companyid="+params.id;
    return axiosClient.get(url, params);
  },

  GetBlockBuyers: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/getblockCompanies?appname=" + appname + "&token=" + token + '&userid=' + userid ;
    return axiosClient.post(url, params);
  },

  SignOutUser: (params) => {
    let payload = {emailid:params.emailId}
    // const url = "/signout?appname="+appname+"&emailid="+params.emailId;
    const url = "/signout?appname="+appname;
    return axiosClient.post(url,payload);
  },

  mapImport: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
  
    const url = "/dynamicImport?appname=" + appname + "&token=" + token + '&userid=' + userid;
    return axiosClient.post(url, params);
  },
  getBiddingLookUp: (params) => {
    const token = localStorage.getItem("token")
    let payload = params
    
    let status = params?.status ? params?.status : "";
    let url = "/biddingLookups?appname=" + appname + "&token=" + token;
    if( status != "") {url = url + `&status=ACTIVE`;}
    if (payload.hasOwnProperty('status')) delete payload['status']
    return axiosClient.post(url, payload);
  },
  getProducts: (id) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    let params = `appname=${appname}&userid=${userId}&token=${token}`;
    let url = `/products?${params}`;
    let method = 'post';
    if (id) {
      url = `/product?${params}&productid=${id}`;
      method = 'get';
      return axiosClient[method](url);
    }
    return axiosClient[method](url, {});
  },
  getItemsData: (params) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
    const url = "/items?appname="+ appname +"&userId="+userid + "&token=" + token;
    return axiosClient.post(url, params);
  },
  signUp: (params) => {
    const url = "/signUp?appname=" + appname ;
    return axiosClient.post(url, params);
  },
  otpVerify: (params) => {
    const url = "/otpVerify?appname=" + appname ;
    return axiosClient.post(url, params);
  },
  
  resendMail: (params) => {
    let payload = params
    let url = `/resendMail?appname=${appname}${params?.page ? `&page=${params?.page}`:''}`;
    if (payload.hasOwnProperty('page')) delete payload['page']

    return axiosClient.post(url, payload);
  },
  signOtp: (params) => {
    const url = "/signIn?appname=" + appname+"&type=signin" ;
    return axiosClient.post(url, params);
  },


};



export default tmdbApi;
