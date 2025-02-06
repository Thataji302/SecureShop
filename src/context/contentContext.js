import React,{ useState, createContext, useEffect ,useRef } from "react";
import tmdbApi from "../api/tmdbApi";
import SessionPopup from "../pages/SessionPopup"
import moment from "moment";
import axios from 'axios';
export const contentContext = createContext();

function ChangeContentProvider(props) {
  const [menus, setMenus] = useState([]);
  const [initialData, setInitialData] = useState([])
  const [data, setData] = useState([]);
  const [retailsData, setRetailsData]= useState([]);
  const [initialCategoriesData1, setInitialCategoriesData1] = useState([]);
  const [isLoad1, setIsLoad1] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [perPageConst, setPerPageConst] = useState(18);
  const [perpage, setPerpage] = useState(18);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPagesArray, setTotalPagesArray] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [catBasedContentFields, setCatBasedContentFields] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [pay, setPay] = useState({});

  const [assetTotal, setAssetTotal] = useState(0);
  const [hideMenu, setHideMenu] = useState(true);
  const [showSessionPopupup, setShowSessionPopupup] = useState(false);

  const [categoryName, setCategoryName] = useState([]); 
  const [categoryNameAdv, setCategoryNameAdv] = useState([]); 
  const [selectedOptionsClientName, setSelectedOptionsClientName] = useState([]);

  const [clientData1, setClientData1] = useState([]);
    const [userData , setUserData] = useState([]);
    const [activeMenuId, setActiveMenuId] = useState("");

  const [arrow, setArrow] = useState("0");

  const [clientsearch, setClientSearch] = useState("");
  const [recommendedsearch, setRecommendedSearch] = useState("");
  const [categorysearch, setCategorySearch] = useState("");
  const [dealsearch, setDealSearch] = useState("");
  const [clientmanagesearch, setClientMangeSearch] = useState("");
  const [companysearch, setCompanySearch] = useState("");
  const [usersearch, setUserSearch] = useState("");
  const [retailsearch, setRetailSearch] = useState("");

  const [contentsearch, setContentSearch] = useState("");
  const [itemsearch, setItemSearch] = useState("");
  const[itemAdvSearch,setItemAdvSearch]=useState("")
  const [clientAdvSearch, setClientAdvSearch] = useState({});
  const [dealsadvSearch, setDealsAdvSearch] = useState({});
  const [companyadvSearch, setCompanyAdvSearch] = useState({});

  const [searchPayload, setSearchPayload] = useState({});
  const [contentAdvCount, setContentAdvCount] = useState("");
  const [bidsSearch, setBidsSearch] = useState("");
  const [bidsAdvSearch, setBidsAdvSearch] = useState({});
  const [contactussearch, setContactusSearch] = useState("");
  // const [countries, setCountries] = useState('');

  const [currentPage, setcurrentPage] = useState(1);

  const [paginationnumber, setPagintionNumber] = useState("");
  const [ActivePageName, setActivePageName] = useState("");
  const [popup, setShowPopup] = useState(false);
    const [activeMenuObj, setActiveMenuObj] = useState({});

    const [multiSelectFields, setMultiSelectFields] = useState({});
    const [activeFieldsObj, setActiveFieldsObj] = useState({CookingshowActive:false,seriesActive:false,SportsActive:false,MusicActive:false,seriesActive:false});

    const [searchedFlag, setSearchedFlag] = useState(false);
    const[currentUrl,setCurrentUrl]=useState("")
    const [currentPageNew, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(15);
  
    const [lookUpType, setlookUpType] = useState("");
  
    // const [lookupsearch, setLookupSearch] = useState("");
  
    const [route, setRoute] = useState("");

    const prevRouteRef = useRef(null);
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [workshopsearch, setWorkshopSearch] = useState("");
    const [productsearch, setProductSearch] = useState("");
    const [selctionOrder, setSelectionOrder] = useState("");
  const handleClosePopup = () => setShowPopup(false);

  function usePrevious(newRoute) {
    const ref = React.useRef();
    React.useEffect(()=>{
      ref.current = newRoute
    }, [newRoute])
    return ref.current
  }


    useEffect(() => {
      GetUserDataContext();
      userAgent();
  }, []);
  const userAgent = async () => {
    axios({
      method: 'GET',
      url: "https://d4nv8o5tzs3mt.cloudfront.net/",
  })
      .then(function (response) {
        let locData = JSON.stringify(response.data)
          localStorage.setItem("loc",locData);
      });
    }
  

   const GetUserDataContext = async () => {
    try {

        const response = await tmdbApi.getUserData({});

        if (response.statusCode === 200) {

            setUserData(response.result[0]);
            localStorage.setItem("username", response.result[0].name)
           // localStorage.setItem("ClientType", response.result[0].type)
            // let userArr = response.result[0].permissions

            // const obj = userArr.reduce((acc, item) => {
            //     if (item.submenus) acc[item.menu] = false;
            //     return acc;
            // }, {});
           
        }
    } catch {
        console.log("error");
    }
};


    const Categories = async () => {
        try {
       
          const response = await tmdbApi.getCategory({});
          console.log('response in content context ',response)
          if (response.result === "Invalid token or Expired" && response.statusCode === 200) {
            setShowSessionPopupup(true)
            
        }
         else if (response.statusCode === 200) {
           
            let arr = []
            let advArr = []
            setCatBasedContentFields(response && response.result &&response.result.data)
            response.result.data.forEach((item) => {
              if(item.status === 'ACTIVE'){
                arr.push(item.name);
              }
              advArr.push(item.name)
             
            });
            const arrOfObj = arr.map((item) => {
              return { value: item, label: item };
            });
            const arrOfObj2 = advArr.map((item) => {
              return { value: item, label: item };
            });
            setCategoryName(arrOfObj);
            setCategoryNameAdv(arrOfObj2);
            setIsLoading(false)
          }
        } catch {
          console.log("error");
        }
      };

  const GetTimeActivity = () => {
  
   localStorage.setItem("timeActivity",moment().format('MMM-DD-YYYY HH:mm:ss'))
  }
  const GetClientDataFunction = async () => {
    try {

      const response = await tmdbApi.getUserData({});
      if (response.statusCode === 200) {
        setClientData1(response.result[0]);
        localStorage.setItem("signed", response.result[0].signednda);

      }
    } catch {
      console.log("error");
    }
  };

  function sortTableAlpha(e, n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("table");
    switching = true;
    dir = "asc";

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];

        if (dir === "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            setArrow(n)
            break;
          }
        } else if (dir === "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            setArrow(false)
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      } else {
        if (switchcount === 0 && dir === "asc") {
          dir = "desc";
          switching = true;

        }

      }

    }
  }

  function sortTableByDate(e, n) {
    var table, rows, switching, i, x, y, shouldSwitch, switchcount = 0, order = "asc";
    table = document.getElementById("table");
    switching = true;
    while (switching) {
      switching = false;
      rows = table.getElementsByTagName("tr");
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("td")[n];
        y = rows[i + 1].getElementsByTagName("td")[n];
        var dateX = new Date(x.innerHTML);
        var dateY = new Date(y.innerHTML);
        if (order === "asc") {
          if ((dateX > dateY)) {
            shouldSwitch = true;
            setArrow(n)
            break;
          }
        } else if (order === "desc") {
          if (dateX < dateY) {
            shouldSwitch = true;
            setArrow(false)
            break;
          }
        }


      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      } else {
        if (switchcount === 0 && order === "asc") {
          order = "desc";
          switching = true;

        }

      }
    }
  }

  

  return (
    <contentContext.Provider value={{ popup, setShowPopup, handleClosePopup, setInitialCategoriesData1, initialData, Categories, categoryName, setCategoryName, categoryNameAdv, setCategoryNameAdv, setIsLoad1, isLoad1, initialCategoriesData1, setHideMenu, hideMenu, perPageConst, setPerPageConst, pageNumber, setPageNumber, assetTotal, setAssetTotal, perpage, setPerpage, totalPagesArray, setTotalPagesArray, totalPages, setTotalPages, menus, isLoading, setIsLoading, clientData1, sortTableAlpha, arrow, sortTableByDate,userData,setUserData, activeMenuObj, setActiveMenuObj ,activeMenuId, setActiveMenuId,catBasedContentFields, setCatBasedContentFields,clientsearch,setClientSearch ,setContactusSearch ,contactussearch,setRecommendedSearch ,recommendedsearch,categorysearch, setCategorySearch ,setDealSearch,dealsearch ,clientmanagesearch, setClientMangeSearch ,companysearch, setCompanySearch ,usersearch, setUserSearch , itemsearch,setItemSearch,contentsearch, setContentSearch ,clientAdvSearch, setClientAdvSearch,dealsadvSearch, setDealsAdvSearch ,companyadvSearch, setCompanyAdvSearch ,searchPayload, setSearchPayload ,contentAdvCount, setContentAdvCount,GetUserDataContext ,currentPage, setcurrentPage ,paginationnumber, setPagintionNumber,selectedOptions, setSelectedOptions,selectedOptionsClientName, multiSelectFields, setMultiSelectFields,activeFieldsObj, setActiveFieldsObj,setSelectedOptionsClientName,pay, setPay,
      data, setData,rowsPerPage, setRowsPerPage,currentPageNew,currentUrl,setCurrentUrl, setCurrentPage,lookUpType, setlookUpType,route,itemAdvSearch,setItemAdvSearch, setRoute,prevRouteRef,usePrevious,sortedColumn, setSortedColumn,sortDirection, setSortDirection,setShowSessionPopupup,showSessionPopupup,searchedFlag,ActivePageName, setActivePageName, setSearchedFlag,itemsearch, setItemSearch,bidsSearch, setBidsSearch, bidsAdvSearch, setBidsAdvSearch,GetTimeActivity,workshopsearch, setWorkshopSearch,productsearch, setProductSearch,selctionOrder, setSelectionOrder,setRetailSearch,retailsData, setRetailsData}}>
      {props.children}
    </contentContext.Provider>
  )
}

export default ChangeContentProvider;