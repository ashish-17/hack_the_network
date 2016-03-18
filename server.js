var http            = require('http');
var express         = require('express');
var app         = express();
//var app          = require('./service/rest.serv');
var server          = http.createServer(app);
var io              = require('socket.io');
var url = require('url');
var fs = require('fs');
var path = require('path');
var bodyParser =require('body-parser');
var methodOverride = require('method-override');
var util = require('util');
var game = require('./game');
app.use(express.static(__dirname + '/www'));
process.env.NODE_PATH = __dirname;
console.log("Directory name is:"+__dirname);

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST,PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT



//var server_port = process.env.port || 2222
var server_port =  2001
var server_ip_address = 'localhost';

server.listen( server_port,server_ip_address, function(){
  var addr = server.address();
   console.info("APP server listening at", addr.address + ":" + addr.port);
});

var listener = io.listen(server);

//The basic structure of different types of hackers
/*
id:
,typeName:
,Description:
,accessMove:{
   diagonal:
  ,any:{
         numberOfActions:
       }
   
 }
,canCrossMissingProduct:
,canMoveOtherHackers:{
       numberOfAdjacentProducts:

   }
,canShareObjCard:{}
,canInstallMalwareAnywhere:{
         diagonal:
        ,numberOfActionsAndProducts:{
             actions:
             products:
        }

   }
*/

var hackerTypes = [
{
id:0
,typeName:"Black Hat Hacker"
,Description:"Can access products and install malware diagonally"
,accessMove:{
   diagonal:1
  ,any:null
   
 }
,canCrossMissingProduct:null
,canMoveOtherHackers:null
,canShareObjCardAnyWhere:null
,canInstallMalware:{
         diagonal:1
        ,numberOfActionsAndProducts:{
             actions:4
             ,products:1
        }

   }
}
,{
  id:1
,typeName:"Script Kiddie"
,Description:"Can move through one or more secured and missing positions"
,accessMove:{
   diagonal:1
  ,any:{
         numberOfActions:4
       }
   
 }
,canCrossMissingProduct:1
,canMoveOtherHackers:null
,canShareObjCardAnyWhere:null
,canInstallMalwareAnyWhere:null

}
,{
   id:2
,typeName:"Hacktivist"
,Description:"Give objectives to Hackers anywhere"
,accessMove:null
,canCrossMissingProduct:null
,canMoveOtherHackers:null
,canShareObjCardAnyWhere:1
,canInstallMalwareAnywhere:null
}
,{
   id:3
,typeName:"State Sponsored Hacker"
,Description:"Can access any product for one action and once per turn"
,accessMove:{
   diagonal:null
  ,any:{
         numberOfActions:1
       }
   
 }
,canCrossMissingProduct:null
,canMoveOtherHackers:null
,canShareObjCardAnyWhere:null
,canInstallMalwareAnywhere:null

}
,{
  id:4
,typeName:"Cyber Terrorist"
,Description:"Can move other hackers upto two adjacent positions for one action"
,accessMove:null
,canCrossMissingProduct:null
,canMoveOtherHackers:{
       maxNumberOfAdjacentProducts:2

   }
,canShareObjCardAnywhere:null
,canInstallMalwareAnywhere:null
}
,{
 id:5
,typeName:"Spy Hacker"
,Description:"Install Malware on 2 products in one action"
,accessMove:null
,canCrossMissingProduct:null
,canMoveOtherHackers:null
,canShareObjCard:null
,canInstallMalwareAnywhere:{
         diagonal:1
        ,numberOfActionsAndProducts:{
             actions:4
             ,products:2
        }

   }
  
}];

var availableHackerIDs = [0,1,2,3,4,5];
var positionOfHackers = [0,8,10,15,24,18];



var pathName = __dirname+'/www/index.html'
app.get('/', function (req, res) {
  
  console.log("Got a request!!");
  res.sendFile(pathName);
 
  
});

app.get('/hackerTypes*',function(req,res){
   
   console.log("Got a request to choose hackers");
   res.jsonp(hackerTypes);

});

app.get('/availableHackers*',function(req,res){

   console.log("Got a request to return available hackers");
   res.jsonp(availableHackerIDs);

});

listener.sockets.on('connection',function(socket){
     
      console.log("Socket.io is GO");
      game.initGame(listener,socket);

});






