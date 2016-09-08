var https = require('https');
//https://www.att.com/global-search/search.jsp?App_ID=HOME&autoSuggest=FALSE&tabPressed=FALSE&q=iPhone&%3Acq_csrf_token=undefined#!/All/
//https://services.att.com/kmservices/v2/search?app-id=test&q=wireless
var host = 'services.att.com';
var path = '/kmservices/v2/search?app-id=test&q=wireless';
var method = 'GET';
var headers = {'Accept': 'application/json'};

getSearchResult();

function getSearchResult(){
var options = {
    host: host,
    path: path,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      //var responseObject = JSON.parse(responseString);
      console.log(responseString);
    });
  });

  req.end();
}