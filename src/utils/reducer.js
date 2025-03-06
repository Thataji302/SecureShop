
import axios from 'axios';
let { lambda, appname } = window.app;
export const getCompanies = async (category) => {
  const token = localStorage.getItem("token")
  const userid = localStorage.getItem("userId")
    // const obj = {'category':category}
    const promise = axios({
        method: 'POST',
        url: lambda + '/companies?appname=' + appname + "&type=content"+ "&token=" + token + "&category=" +category +"&userid="+ userid,
    })
      .then(function (response) {
        console.log('get companies response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }

  export const getClientcontent = async (id) => {
    const token = localStorage.getItem("token")
    const promise = axios({
        method: 'GET',
        url: lambda + '/clientcontent?appname=' + appname+"&contentid="+id + "&token=" + token,
    })
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }
  export const addClientcontent = async (id, data) => {
    const userid = localStorage.getItem("userId")
    const token = localStorage.getItem("token")
    if(data.clientcontentid){
      delete data['created'];
      delete data['updated'];
      delete data['_id'];
    }
    
    const promise = axios({
        method: data.clientcontentid?'PUT':'POST',
        url: lambda + '/clientcontent?appname=' + appname+"&contentid="+id + "&token=" + token+"&userid="+ userid, data
    })
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }

  export const getContentFiles = async (id) => {
    const token = localStorage.getItem("token")
    const promise = axios({
        method: 'GET',
        url: lambda + '/contentfiles?appname=' + appname+"&contentid="+id + "&token=" + token,
    })
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }

  export const updateContentData = async (id, data) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")

    console.log('data', data);
    delete data['created'];
    delete data['updated'];
    delete data['_id'];
    console.log('data-->',data)
    if (data.hasOwnProperty('featured'))    data['featured'] = data['featured'] === true || data['featured'] === "true" ? true : false;
    if (data.hasOwnProperty('isMEavailable'))    data['isMEavailable'] = data['isMEavailable'] === true || data['isMEavailable'] === "true" ? true : false;
    if (data.hasOwnProperty('availabilityofscripts'))    data['availabilityofscripts'] = data['availabilityofscripts'] === true || data['availabilityofscripts'] === "true" ? true : false;
    if (data.hasOwnProperty('IMDBrating'))  data['IMDBrating'] = parseFloat(data['IMDBrating'])
    if (data.hasOwnProperty('noofepisodes')) data['noofepisodes'] = parseInt(data['noofepisodes'])
    if (data.hasOwnProperty('noofseasons'))  data['noofseasons'] = parseInt(data['noofseasons'])
    if (data.hasOwnProperty('releaseyear')) data['releaseyear'] = parseInt(data['releaseyear'])
    if (data.hasOwnProperty('title'))  data['title'] = data['title']?.trim()
    if (data.hasOwnProperty('remarks'))  data['remarks'] = data['remarks']?.trim()
    if (data.hasOwnProperty('foreigntitle'))  data['foreigntitle'] = data['foreigntitle']?.trim()
    // if (data.hasOwnProperty('keywords'))  data['keywords'] = data['keywords']?.trim()
    if (data.hasOwnProperty('analytics'))  data['analytics'] = data['analytics']?.trim()
    if (data.hasOwnProperty('synopsis'))  data['synopsis'] = data['synopsis']?.trim()

    const promise =  axios.post(lambda + '/updatecontent?appname=' + appname+"&contentid="+id + "&token=" + token+"&userid="+ userid, data)
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
    
  }
  export const AddContentData = async ( data) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")

    console.log('data', data);
   
    if (data.hasOwnProperty('featured'))    data['featured'] = data['featured'] === true || data['featured'] === "true" ? true : false;
    if (data.hasOwnProperty('isMEavailable'))    data['isMEavailable'] = data['isMEavailable'] === true || data['isMEavailable'] === "true" ? true : false;
    if (data.hasOwnProperty('availabilityofscripts'))    data['availabilityofscripts'] = data['availabilityofscripts'] === true || data['availabilityofscripts'] === "true" ? true : false;
    if (data.hasOwnProperty('IMDBrating'))  data['IMDBrating'] = parseFloat(data['IMDBrating'])
    if (data.hasOwnProperty('noofepisodes')) data['noofepisodes'] = parseInt(data['noofepisodes'])
    if (data.hasOwnProperty('noofseasons'))  data['noofseasons'] = parseInt(data['noofseasons'])
    if (data.hasOwnProperty('releaseyear'))  data['releaseyear'] = parseInt(data['releaseyear'])
    if (data.hasOwnProperty('title'))  data['title'] = data['title']?.trim()
    if (data.hasOwnProperty('remarks'))  data['remarks'] = data['remarks']?.trim()
    if (data.hasOwnProperty('foreigntitle'))  data['foreigntitle'] = data['foreigntitle']?.trim()
    // if (data.hasOwnProperty('keywords'))  data['keywords'] = data['keywords']?.trim()
    if (data.hasOwnProperty('analytics'))  data['analytics'] = data['analytics']?.trim()
    if (data.hasOwnProperty('synopsis'))  data['synopsis'] = data['synopsis']?.trim()

    const promise =  axios.post(lambda + '/addContent?appname=' + appname + "&token=" + token+"&userid="+ userid, data)
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
    
  }


  export const updateLookup = async (id, data) => {
    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("userId");
    data["name"] = data.name?.trim();
    data["alpha2"] = data.alpha2?.trim();
    data["alpha3"] = data.alpha3?.trim();
    data["countrycode"] = data.countrycode?.trim();
    console.log('data', data);
    delete data['_id'];
    const promise =  axios.post(lambda + '/updatelookups?appname=' + appname+"&lookupcode="+id + "&token=" + token + '&userid=' + userid, data)
      .then(function (response) {
        console.log('api lookup',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }

  export const addLookup = async (data) => {
    const userid = localStorage.getItem("userId")
    const token = localStorage.getItem("token")
    console.log('data', data);
    data["name"] = data.name?.trim();
    data["alpha2"] = data.alpha2?.trim();
    data["alpha3"] = data.alpha3?.trim();
    data["countrycode"] = data.countrycode?.trim();
    delete data['_id'];
    const promise =  axios.put(lambda + '/lookups?appname=' + appname + "&token=" + token +"&userid="+ userid, data)
      .then(function (response) {
        console.log('api lookup',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }

  export const updateCompany = async (id, data,flag) => {
    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("userId");
    data["accountemail"] = data.accountemail?.trim();
    data["accountname"] = data.accountname?.trim();
    data["acquisitionsemail"] = data.acquisitionsemail?.trim();
    data["acquisitionsname"] = data.acquisitionsname?.trim();
    data["address"] = data.address?.trim();
    data["ceoemail"] = data.ceoemail?.trim();
    data["ceoname"] = data.ceoname?.trim();
    data["city"] = data.city?.trim();
    data["ctoemail"] = data.ctoemail?.trim();
    data["ctoname"] = data.ctoname?.trim();
    data["emailid"] = data.emailid?.trim();
    data["legalemail"] = data.legalemail?.trim();
    data["legalname"] = data.legalname?.trim();
    data["region"] = data.region?.trim();
    data["syndicationemail"] = data.syndicationemail?.trim();
    data["syndicationname"] = data.syndicationname?.trim();
    data["technicalemail"] = data.technicalemail?.trim();
    data["technicalname"] = data.technicalname?.trim();
    data["zipcode"] = data.zipcode?.trim();
    console.log('data', data);
    delete data['_id'];
    delete data['created'];
    delete data['updated'];
    if(flag === false){
      delete data["companyname"];
 }

    const promise =  axios.post(lambda + '/company?appname=' + appname+ '&companyid=' + id + "&token=" + token + '&userid=' + userid , data)
      .then(function (response) {
        console.log('api lookup',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }
  export const saveCompany = async (data) => {
    const userid = localStorage.getItem("userId")
    const token = localStorage.getItem("token")
    console.log('data', data);
    delete data['_id'];
    delete data['created'];
    delete data['updated'];
    
    data["companyname"] = data.companyname?.trim();
    data["accountemail"] = data.accountemail?.trim();
    data["accountname"] = data.accountname?.trim();
    data["acquisitionsemail"] = data.acquisitionsemail?.trim();
    data["acquisitionsname"] = data.acquisitionsname?.trim();
    data["address"] = data.address?.trim();
    data["ceoemail"] = data.ceoemail?.trim();
    data["ceoname"] = data.ceoname?.trim();
    data["city"] = data.city?.trim();
    data["ctoemail"] = data.ctoemail?.trim();
    data["ctoname"] = data.ctoname?.trim();
    data["emailid"] = data.emailid?.trim();
    data["legalemail"] = data.legalemail?.trim();
    data["legalname"] = data.legalname?.trim();
    data["region"] = data.region?.trim();
    data["syndicationemail"] = data.syndicationemail?.trim();
    data["syndicationname"] = data.syndicationname?.trim();
    data["technicalemail"] = data.technicalemail?.trim();
    data["technicalname"] = data.technicalname?.trim();
    data["zipcode"] = data.zipcode?.trim();

    const promise =  axios.put(lambda + '/company?appname=' + appname + "&token=" + token+"&userid="+ userid, data)
      .then(function (response) {
        console.log('api lookup',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }
  export const CategoryFieldSet = async (data) => {
    const userid = localStorage.getItem("userId")
    const token = localStorage.getItem("token")
    console.log('data', data);
    
    const promise =  axios.post(lambda + '/getcategoryData?appname=' + appname + "&token=" + token+"&userid="+ userid, {"names":data})
      .then(function (response) {
        console.log('api lookup',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }
  // export const verifyMappedData = async (data) => {
  //   console.log('data', data);
  //   const userid = localStorage.getItem("userId");
  //   const token = localStorage.getItem("token")
  //   const promise =  axios.post(lambda + '/dynamicImport?appname=' + appname+ "&token=" + token + "&userid="+ userid, data)
  //     .then(function (response) {
  //       console.log('api lookup',response);
  //       if (response && response.data) {
  //         return response;
  //       }
  //     });
  //   const dataPromise = promise.then((response) => response.data);
  //   data.assetsData[1].error = "Formats missing, Invalid cast"
  //   return data;

  // }
  
  export const updateBiddingItems = async (id, data) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")

    console.log('data', data);
    delete data['created'];
    delete data['updated'];
    delete data['_id'];
 

    const promise =  axios.post(lambda + '/biddingItems?appname=' + appname+"&itemid="+id + "&token=" + token+"&userid="+ userid, data)
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
    
  }

  export const getItemFiles = async (id) => {
    const token = localStorage.getItem("token")
    const promise = axios({
        method: 'GET',
        url: lambda + '/biddingFiles?appname=' + appname+"&itemid="+id + "&token=" + token,
    })
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }
  export const CountryCombination = async (payload) => {
    const token = localStorage.getItem("token")
   
    const promise = axios({
        method: 'POST',
        url: lambda + '/bidcombination?appname=' + appname + "&token=" + token,
        data:payload,
    })
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }

  export const SaveCombination = async (id,data) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")

    const promise = axios({
        method: 'POST',
        url: lambda + '/combination?appname=' + appname + "&token=" + token+ "&activity=add&itemid=" +id + "&userid="+ userid,
        data:data,
    })
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }

  export const UpdateCombination = async (id,data) => {
    const newdata = data.map((item,i) => {
      delete data[i]['_id'];
    delete data[i]['created'];
    delete data[i]['updated'];
    });
    console.log("newdata",newdata)
    console.log("data",data)
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")
 
    const promise = axios({
        method: 'POST',
        url: lambda + '/combination?appname=' + appname + "&token=" + token+ "&activity=update&itemid=" +id + "&userid="+ userid,
        data:data,
    })
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }

  export const getCombination = async (id) => {
    const token = localStorage.getItem("token")
  
    const promise = axios({
        method: 'POST',
        url: lambda + '/combinationlist?appname=' + appname + "&token=" + token +"&itemid=" + id + "&sortBy=country" ,
    })
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }

  export const updateBiddingLookup = async (id, data) => {
    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("userId");
    console.log('data', data);
    delete data['_id'];
    delete data['alpha2'];
    delete data['alpha3'];
    delete data['modifiedBy'];
    delete data['appname'];
    delete data['updated'];
    delete data['countrycode'];

    let urlLink = lambda + '/updatebiddingLookups?appname=' + appname+"&lookupcode="+id + "&token=" + token + '&userid=' + userid

    const promise =  axios.post(urlLink, data)
      .then(function (response) {
        console.log('api lookup',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }
  export const addBiddingLookup = async (data) => {
    const userid = localStorage.getItem("userId")
    const token = localStorage.getItem("token")
    console.log('data', data);
    data["name"] = data.name?.trim();
    delete data['_id'];
    const promise =  axios.put(lambda + '/biddingLookups?appname=' + appname + "&token=" + token +"&userid="+ userid, data)
      .then(function (response) {
        console.log('api lookup',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }

  export const getCombinationSearch = async (id,search) => {
    const token = localStorage.getItem("token")
  
    const promise = axios({
        method: 'POST',
        url: lambda + '/combinationlist?appname=' + appname + "&token=" + token +"&itemid=" + id +"&sortBy=country",
        data: search
    })
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }
  export const getCombinationAdvSearch = async (id,payload) => {
    const token = localStorage.getItem("token")
  
    const promise = axios({
        method: 'POST',
        url: lambda + '/combinationlist?appname=' + appname + "&token=" + token +"&itemid=" + id+"&sortBy=country",
        data: payload
    })
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;

  }
  export const AddItem = async ( data) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")

    console.log('data', data);
   

    const promise =  axios.post(lambda + '/createItem?appname=' + appname + "&token=" + token+"&userid="+ userid, data)
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
    
  }

  export const setDefault = async ( id,data) => {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userId")

    console.log('data', data);
   

    const promise =  axios.post(lambda + '/biddingItems?appname=' + appname + "&itemid=" + id +  "&token=" + token+"&userid="+ userid, data)
      .then(function (response) {
        console.log('api response',response);
        if (response && response.data) {
          return response;
        }
      });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
    
  }