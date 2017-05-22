// NodeRESTHost.js
// A simple REST host in Node.js with using Express.js framework.
//
// All data stored in memory, requests are handled in particular routes.
// 
// Created in 2014 by Radek Tomasek / SeaCat Ltd. 

// Include external modules - Express.js and BodyParser.
var express = require('express');
var bodyParser = require('body-parser');


var serverPort = "13080";
var apiPath = "/webapi/reg_health";

var apiKey = "1120C63B5073B0141D2CA15D14C2964D42458FA186DFB29D6B3BE5BA0D283E01"

var count = 0;

// Initialize app by using Express framework.
var app = express();

// Use Body Parser (Helps to process incoming requests).
//app.use(bodyParser.urlencoded({extended: true}));

// Fix Error: request entity too large
//app.use(bodyParser.json());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Set default port 1337 or custom if defined by user externally.
app.set('port', process.env.PORT || serverPort);

// Initialization of healthInfos array.
var healthInfos = [
  {
    id: 1,
    name: "Forrest Gump",
    director: "Robert Zemeckis",
    release: 1994
  }
]; 


app.post("/webapi/reg_healthok", function(req, res) { 
	/* some server side logic */
	res.statusMessage = "OK1";
	res.status(200);
	res.set("Message","OK")
	res.send();
});
  
// A simulation of creating new IDs. Basically get the last element and increase the value of an ID. 
function getNewId(){
  return healthInfos[healthInfos.length -1].id + 1;
}

// Function findIndexOfElement helps to identify the array index according to specified key/value pair. 
function findIndexOfElement(inputArray, key, value){
  for (var i = 0; i < inputArray.length; i++){
    if (inputArray[i][key] === value){
      return i;
    }
  }
  return -1;
}


// GET - list of all records.
app.get(apiPath, function(request, response){
  response.json(healthInfos.map(function(healthInfo){
    return {
      id: healthInfo.id,
	  ID: healthInfo.ID,
	  Key: healthInfo.Key,
	  //pathRestApi : healthInfo.pathRestApi,
	  heartRateInfo: healthInfo.heartRateInfo,
	  walkingInfo : healthInfo.walkingInfo,
	  //sex : healthInfo.sex,
	 // bodyTemperature:healthInfo.bodyTemperature,
	 // bloodType : healthInfo.bloodType,
	 // bloodDiastolic : healthInfo.bloodDiastolic,
	  //bloodSystolic : healthInfo.bloodSystolic,
	  //respiratory : healthInfo.respiratory
    }
  }));
});

// GET - list of a record with particular id. If not found, forward the request to 404 - not found. 
app.get('/api/uploadData/:id', function(request, response, next){  
  // Get an integer interpretation of URL parameter. 
  var urlIntParam = parseInt(request.params.id);
  // Check whether the element is a valid positive number. If not (following case, redirect the request to 404).
  if (urlIntParam < 0 || isNaN(urlIntParam)){
    // Use following middleware - matched 404.
    next();
  }
  else {
    // Find array index in our healthInfo array based on the input parameter (converted to integer). 
    var elementIndex = findIndexOfElement(healthInfos, 'id', urlIntParam);
    // If element exists, get the response, otherwise redirect to 404.
    if (elementIndex >= 0){
      // Get an object from healthInfo array.
      var selectedhealthInfo = healthInfos[elementIndex];
      // Return JSON response with selected attributes.
      response.json({
        id: selectedhealthInfo.id,
        name: selectedhealthInfo.name,
        director: selectedhealthInfo.director,
        release: selectedhealthInfo.release
      });
    }
    else
    {
      // redirection to 404.
      next();      
    }
  }
});

// POST - create a new element.
app.post(apiPath, function(request, response){
  // Complete request body.
  var requestBody = request.body;
  console.log(request.body);      // your JSON
  console.log('Client URL: '+request.url);
  response.send(request.body);
  /*
  healthInfos.push({
    id: getNewId(),
	ID: requestBody.ID,
	Key: requestBody.Key,
	heartRateInfo: requestBody.heartRateInfo,
	walkingInfo : requestBody.walkingInfo,
	//sex : requestBody.sex,
	//bloodType : requestBody.bloodType,
	//bodyTemperature: requestBody.bodyTemperature,
	//bloodDiastolic : requestBody.bloodDiastolic,
	//bloodSystolic : requestBody.bloodSystolic,
	//respiratory : requestBody.respiratory
  });
  */
  
  response.status(200).end();
});
app.post(apiPath+"a", function(request, response, next){
  // Complete request body.
  var requestBody = request.body;
  
  var key  = request.body.AplKey;

  console.log('Client URL: '+request.url);
  console.log('key: '+key);
  // For test response error after success
  count = count + 1
  console.log("Count = " + count); 
  if(apiKey != key){
	    console.log("404"); 
		response.statusCode =404;
		response.statusMessage = 'Not found';
		response.send({result :'ng', message :'Key is not valid'});
		response.end();  
  }else{
	if (count >= 16) {
		console.log("404"); 
		response.statusCode =404;
		response.statusMessage = 'Not found';
		response.send({result :'ng', message :'Error happen test'});
		 response.end();
	  } else {
		console.log("200"); 
		console.log(request.body);      // your JSON
		 response.send({result :'ok', message :'Sent Successfully test!'});
		response.status(200).end();
	 }
  }
  
});
app.post(apiPath+"b", function(request, response){
  // Complete request body.
  var requestBody = request.body;
  console.log(request.body);      // your JSON
  console.log('Client URL: '+request.url);
  response.statusCode =404;
  response.statusMessage = 'Not found';
  
  response.send(request.body);

  response.end();
});
// PUT - update existing element.
app.put('/api/uploadData/:id', function(request, response, next){
  // Get an integer interpretation of URL parameter. 
  var urlIntParam = parseInt(request.params.id);
  // Check whether the element is a valid positive number. If not (following case, redirect the request to 404).
  if (urlIntParam < 0 || isNaN(urlIntParam)){
    // Use following middleware - matched 404.
    next();
  }
  else {
    // Find array index in our healthInfo array based on the input parameter (converted to integer).
    var elementIndex = findIndexOfElement(healthInfos, 'id', urlIntParam);
    // If element exists, get the response, otherwise redirect to 404.
    if (elementIndex >= 0){
      // Update element accordingly.
      healthInfos[elementIndex] = {
        id: urlIntParam,
        name: request.body.name,
        director: request.body.director,
        release: request.body.release
      };
      // Element successfuly updated.
      response.status(200).end();
    }
    else {
      // redirection to 404.
      next();
    }
  }
});

// DELETE - remove particular record from array.
app.delete('/api/uploadData/:id', function(request, response, next){
  // Get an integer interpretation of URL parameter. 
  var urlIntParam = parseInt(request.params.id);
  // Check whether the element exists or not (or it is not a number). If not (following case, redirect the request to 404).
  if (urlIntParam < 0 || isNaN(urlIntParam)){
    // Use following middleware - matched 404.
    next();
  }
  else {
    // Find array index in our healthInfo array based on the input parameter (converted to integer).
    var elementIndex = findIndexOfElement(healthInfos, 'id', urlIntParam);
    // If element exists, get the response, otherwise redirect to 404.
    if (elementIndex >= 0){
      // Delete element according to index parameter.
      healthInfos.splice(elementIndex, 1);
      // Element successfuly deleted.
      response.status(200).end();
    }
    else {
      // redirection to 404.
      next();
    }
  }
}); 

// Use Express midleware to handle 404 and 500 error states.
app.use(function(request, response){
   // Set status 404 if none of above routes processed incoming request. 
   response.status(404); 
   // Generate the output.
   response.send('404 - not found');
});

// 500 error handling. This will be handled in case of any internal issue on the host side.
app.use(function(err, request, response){
  // Set response type to application/json.
  response.type('application/json');
  // Set response status to 500 (error code for internal server error).
  response.status(500);
  // Generate the output - an Internal server error message. 
  response.send('500 - internal server error');
});

// Start listening on defined port, this keep running the application until hit Ctrl + C key combination.  
app.listen(app.get('port'), function(){
  console.log("Host is running and listening on http://localhost:" + app.get('port') + '; press Ctrl-C to terminate.');  
});