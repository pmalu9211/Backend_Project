class ApiResposne {
  constructor(statuscode, data, message = "Success") {
    this.statuscode = statuscode;
    this.message = message;
    this.success = statuscode < 400;
    this.data = data;
  }
}
//this is a custom api response to standardise it in our code

export default ApiResposne;
