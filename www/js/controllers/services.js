var app = angular.module('hackerAppClientManager',[]);

/*Services to call the node server*/



app.factory('GetHackersFactory',function($http){
  
     var getHackerTypes = function(){
     
         var httpPromise =  $http.jsonp("/hackerTypes?callback=JSON_CALLBACK");        
         var thenPromise = httpPromise.then(function(response){
               console.debug("The response is:"+response);
               return response.data;
         
         },function(response){
         
           console.debug("Error!! while retrieving list of Hackers"+response.data);
         
         });
         return thenPromise;
     };
     
     var getAvailableHackers = function(){
     
          var httpPromise = $http.jsonp("/availableHackers?callback=JSON_CALLBACK");
          var thenPromise = httpPromise.then(function(response){
             return response.data;
          
          },function(response){
          
             console.debug("Error!! while getting available Hackers"+response.data);
          
          });
          
          return thenPromise;
     };
     
     return {
       getHackerTypes:getHackerTypes
       ,getAvailableHackers:getAvailableHackers
     
     };
     
     
});

app.factory('SocketFactory',function($q){

  console.log("In the Socket Factory");
   var socket = io.connect();
   var mySocketId;
   var gameId;
   var App = {};
  
   var bindEvents = function(){
  
      socket.on('connected', onConnected);
      //socket.on('hackerPositionChanged', onHackerPositionChanged);

   }
   bindEvents();

   function onConnected(data){
    
       mySocketId = socket.id;
    

   }
   var on = function(event,callback){
  
      console.log("Binding the event:"+event);
      socket.on(event,callback);
  
  };
  
  var emit = function(event,data,callback){
    
         if(typeof callback == 'function'){
         
         
         }else{
         
            socket.emit(event,data);
         
         } 
     
  }  
    
   
   
 /* var gameInit = function (data) {

                App.gameId = data.gameId;
                App.mySocketId = data.mySocketId;
                App.myRole = data.role;
                App.details = data.details;
                console.log("In socket service, app is:"+App.myRole);                
                
            }*/
            
            
  var getPlayerId = function(){
   
     return mySocketId;  
   
   };
  
  var getGameDetails = function(){
  
    return App;
  
  }; 
  
  var changeHackerPosition = function(hackerRole,currentPosition,nextPosition){
      
      var data = {
          hackerRole:hackerRole
          ,currentPosition:currentPosition
          ,nextPosition:nextPosition
      };
      console.log("Emiting the changeHackerPosition");
      socket.emit('changeHackerPosition',data);
      
      
  };
  
  
  var createNewGame = function(){
  
     
     var deferred = $q.defer();
     socket.emit('joinNewGame',function(data){
     
           App.gameId = data.gameId;
           App.mySocketId = data.mySocketId;
           App.myRole = data.role;
           App.rules = data.rules;
           App.position = data.position;
           deferred.resolve(App);
     });
  
     return deferred.promise;
      
  };
  
  
           

  return {
  
      getPlayerId:getPlayerId
     ,getGameDetails:getGameDetails
     ,changeHackerPosition:changeHackerPosition
     ,on:on
     ,emit:emit 
     ,createNewGame :createNewGame
  };  
  
  
});