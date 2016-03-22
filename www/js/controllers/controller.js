var app = angular.module('hackerAppClientManager');


app.controller('chooseHackerController',function($scope, $route, $routeParams, $location,GetHackersFactory){


  console.debug("Hello Please choose your hacker!!");
  var promise1 = GetHackersFactory.getHackerTypes();
  var successCB1 = function(data){
     console.log('List of hacker types:');
      console.debug("The data is:"+data);
      console.log(JSON.stringify(data));
      $scope.hackerTypes = data;
      $scope.hackerName = data[0].typeName;
      $scope.messages = [];
  
  };
  var failureCB1 = function(data){
     
      console.debug("Error!!"+data);
  
  };
  
     promise1.then(successCB1,failureCB1);
  
     var promise2 = GetHackersFactory.getAvailableHackers();
     var successCB2 = function(data){
         
         console.debug("The available hackers are:");
         console.log(JSON.stringify(data));
         $scope.availableHackerIDs = data;
     
     };
     var failureCB2 = function(data){
     
         console.debug("Error!!"+data);
     }
     promise2.then(successCB2,failureCB2);
     
     
     
   $scope.onSelection = function(index){
     
      var selectedHackerType = $scope.hackerTypes[index];
      
   
   }  
  

});

app.controller('GameController',function($scope,$route,$routeParams,$location,SocketFactory){
      
      console.log("Loaded the GameController");
      var currentPosition;
      $scope.canMoveDiagonal=0;
      $scope.canMoveAnywhere=0;
      var gridSize = 5;
      var listOfMoves = [];
      $scope.playerDetails = {};
      $scope.playerClass = "";
      $scope.canStartGame = false;
      $scope.coverClass = "cover";
      $scope.messages = [];
	  $scope.chatMessage = "";
	
	var doughnutData = [ {
		value : 1,
		color : "#46BFBD",
		highlight : "#5AD3D1",
		label : "Security Updates"
	}, {
		value : 2,
		color : "#46BFBD",
		highlight : "#FFC870",
		label : "Security Updates"
	}, {
		value : 3,
		color : "#46BFBD",
		highlight : "#6d96d2",
		label : "Security Updates"
	}, {
		value : 4,
		color : "#46BFBD",
		highlight : "#d26db8",
		label : "Security Updates"
	}, {
		value : 5,
		color : "#46BFBD",
		highlight : "#bb6dd4",
		label : "Security Updates"
	}, {
		value : 6,
		color : "#46BFBD",
		highlight : "#FF5A5E",
		label : "Security Updates"
	}
	];
	
	
	var chartOptions = {
	  
	    responsive : true
	};
      
      /*******************************************/
      /*           Creation of Chart             */
      /******************************************/
      
      var ctx = document.getElementById("security-level").getContext("2d");
      var myChart = new Chart(ctx).Doughnut(doughnutData,chartOptions);
      console.log("The chart object is:"+JSON.stringify(myChart));
     
     
     /*******************************************/
      /*           Creation of New Game          */
      /******************************************/
      
      var promise = SocketFactory.createNewGame();
      promise.then(function(data){
      
        $scope.playerDetails = data;
        $scope.playerClass = "hacker-"+data.myRole;
        currentPosition = data.position;
        var move = $scope.playerDetails.rules.accessMove;
        if(move){
           $scope.canMoveDiagonal = move.diagonal;
           $scope.canMoveAnywhere = move.anywhere.numberOfActions;
        }
        console.log("Can move Diagonal:"+$scope.canMoveDiagonal);
        SocketFactory.emit('joinedNewGame',null);
        
      },function(data){
      
        console.log("Error!! while resolving the promise");
      
      });
      
      
       /*******************************************/
      /*   Listeners for Socket emitters          */
      /******************************************/
      
      
      SocketFactory.on('hackerPositionChanged', function (data) {
                   console.log("The changed data is:"+JSON.stringify(data));
                   hackerMove(data.hackerRole,data.nextPosition);      
            });
            
      SocketFactory.on('log',function(data){
      
             console.debug("Received the log event!!");
             $scope.logMessage = data.message;
             console.log("The log messages are:"+$scope.logMessage);
             $scope.currentNumberOfPlayers = data.numberOfPlayers;
             $scope.canStartGame = data.canStartPlaying;
             $scope.coverClass =  $scope.canStartGame?null:'cover';
             $scope.$apply();
      
      });      
      
      SocketFactory.on('receive:message',function(data){
      
             console.debug('Received the message');
             $scope.messages.push(data);                     
             $scope.$apply();
      
      });
            
     /*******************************************/
      /*           Handlers for Buttons          */
      /******************************************/
       
     $scope.leftClick = function(){
     

        var nextPosition = currentPosition-1;
        if(currentPosition%gridSize !=0){
           SocketFactory.changeHackerPosition ($scope.playerDetails.myRole,currentPosition,nextPosition);
           hackerMove($scope.playerDetails.myRole,nextPosition);
           listOfMoves.push(currentPosition);
           currentPosition =  nextPosition;
            
        }
        else{
          
          console.debug("Illegal Move");
        
        }
         
     };
     
     $scope.rightClick = function(){
     
         console.log("The play details in right click:"+JSON.stringify($scope.playerDetails));
        
          var nextPosition = currentPosition+1;
         if(nextPosition%gridSize !=0)
         {
           SocketFactory.changeHackerPosition ($scope.playerDetails.myRole,currentPosition,nextPosition);
          hackerMove($scope.playerDetails.myRole,nextPosition);
           listOfMoves.push(currentPosition);
           currentPosition =  nextPosition;
         }
         else{
          
           console.debug("Illegal Move!!");
         
         }
        
         
     };
     
     $scope.upClick = function(){
     
          var nextPosition = currentPosition - gridSize;
          if(nextPosition > -1){
          
             SocketFactory.changeHackerPosition ($scope.playerDetails.myRole,currentPosition,nextPosition);
             hackerMove($scope.playerDetails.myRole,nextPosition);
             listOfMoves.push(currentPosition);
             currentPosition =  nextPosition;
          }
          else{
             
             console.debug("Illegal Move!!");
          
          }
        
     };
     
     $scope.downClick = function(){
     
        var nextPosition = currentPosition + gridSize;
        if(nextPosition < gridSize*gridSize){
            SocketFactory.changeHackerPosition ($scope.playerDetails.myRole,currentPosition,nextPosition);
           hackerMove($scope.playerDetails.myRole,nextPosition);
            listOfMoves.push(currentPosition);
            currentPosition =  nextPosition;
        }
        else{
        
           console.debug("Illegal Move");
        }
     
     };
     
     $scope.upLeft = function(){
     
         if($scope.canMoveDiagonal){
            var nextPosition = currentPosition - (gridSize+1);
            if((currentPosition%gridSize != 0)&&(nextPosition>-1)){
              SocketFactory.changeHackerPosition ($scope.playerDetails.myRole,currentPosition,nextPosition);
              hackerMove($scope.playerDetails.myRole,nextPosition);
              listOfMoves.push(currentPosition);
              currentPosition =  nextPosition;
              
              
            }
            else{
            
             console.debug("Illegal Move!!");
            
            }
         
         }
         else{
         
          console.debug("Cannot Move Diagonally!!");
         
         }
     };
     
     $scope.upRight = function(){
     
          if($scope.canMoveDiagonal){
            var nextPosition = currentPosition - (gridSize-1);
            if(((currentPosition+1)%gridSize != 0)&&(nextPosition>-1)){
              SocketFactory.changeHackerPosition ($scope.playerDetails.myRole,currentPosition,nextPosition);
              hackerMove($scope.playerDetails.myRole,nextPosition);
              listOfMoves.push(currentPosition);
              currentPosition =  nextPosition;
            
            }
            else{
            
             console.debug("Illegal Move!!");
            
            }
         
         }
         else{
         
          console.debug("Cannot Move Diagonally!!");
         
         }
     };
     
     $scope.downLeft = function(){
     
        if($scope.canMoveDiagonal){
            var nextPosition = currentPosition + (gridSize-1);
            if((currentPosition%5 != 0)&&(nextPosition < gridSize*gridSize)){
            
              SocketFactory.changeHackerPosition ($scope.playerDetails.myRole,currentPosition,nextPosition);
             hackerMove($scope.playerDetails.myRole,nextPosition);
              listOfMoves.push(currentPosition);
              currentPosition =  nextPosition;
            
            }
            else{
            
             console.debug("Illegal Move!!");
            
            }
         
         }
         else{
         
          console.debug("Cannot Move Diagonally!!");
         
         }
    
     };
     
     
     $scope.downRight = function(){
     
           if($scope.canMoveDiagonal){
            var nextPosition = currentPosition + (gridSize+1);
            if(((currentPosition+1)%5 != 0)&&(nextPosition < gridSize*gridSize)){
              SocketFactory.changeHackerPosition ($scope.playerDetails.myRole,currentPosition,nextPosition);
              hackerMove($scope.playerDetails.myRole,nextPosition);
              listOfMoves.push(currentPosition);
              currentPosition =  nextPosition;
            
            }
            else{
            
             console.debug("Illegal Move!!");
            
            }
         
         }
         else{
         
          console.debug("Cannot Move Diagonally!!");
         
         }
         
     };
     
     $scope.undo = function(){
     
        if(listOfMoves.length>0){
           
         var prevPos = listOfMoves.pop(); //This gives the previous position;
         console.log("Previous position is:"+prevPos);
         SocketFactory.changeHackerPosition ($scope.playerDetails.myRole,currentPosition,prevPos);
         hackerMove($scope.playerDetails.myRole,prevPos); 
         currentPosition = prevPos; 
        
        }
        
     };
     
     $scope.sendMessage = function(){
     
        console.log('Hit the chat message');
        var chatObject = {
          user:$scope.playerClass
          ,text:$scope.chatMessage
        
        };
        SocketFactory.emit('send:message',chatObject);
         
       //Add the message to our model locally
       $scope.messages.push(chatObject);
       $scope.chatMessage="";
            
     };
     
        
     var hackerMove = function(hackerType,nextPosition){
     
            console.log("The hackertype is:"+hackerType);
            var className = "hack-hacker hacker-"+hackerType;
            console.log("The class name is:"+className);
            var elementToBeRemoved = document.getElementsByClassName(className)[0];
            elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
            
            var nextCardElement = document.getElementById("#"+nextPosition);
            var newParentElement = nextCardElement.getElementsByTagName("h4")[0];
            newParentElement.appendChild(elementToBeRemoved);
            
            console.debug(newParentElement);
            console.debug(elementToBeRemoved);
          
     };
     
     var changeSecurityLevel = function(indexOfSegment,color){
     
          myChart.segments[indexOfSegment].fillColor = color;
          myChart.update();
    
     };
   /*  var placeThePlayerOnTheCard(position,playerType){
     
        var tag = '<span class="hack-hacker hacker-'+playerType+'"><i class="fa fa-2x fa-user-secret"></i>'+'</span>';
        console.log("The tag to be inserted is:"+tag);
        
        var cardElement = document.getElementById("#"+position);
        var newParentElement = cardElement.getElementsByTagName("h4")[0];
        newParentElement.appendChild();  
     
     };*/
     
   
});