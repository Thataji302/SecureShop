

export const formatPhoneNumber = (value) => {
    if (!value) return value;
    

    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  export const formatCurrency = (number) => {
    return number?.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
  };

  export const location = (name) => {
    let results = new RegExp(name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
      results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
    }
    if (results == null) {
      return null;
    }
    return decodeURI(results[1]) || 0;
  }
  
  export const removeSpecialCharecters = (filename) => {
    let timeStamp = new Date().getTime();
    let tmpFile = filename
      .substring(0, filename.lastIndexOf("."))
      .replace(/[^a-zA-Z 0-9]/g, "");
    tmpFile = tmpFile.replaceAll(" ", "");
    let tmpExtension = filename.substring(filename.lastIndexOf("."));
    let tmpNewFileName = tmpFile + timeStamp + tmpExtension;
    // console.log("tmpNewFileName", tmpNewFileName)
    // return encodeURIComponent(tmpNewFileName);
    return tmpNewFileName;
  };
