//Game specific server code;

var io;
var gameSocket;
var thisGameId;
var numberOfPlayers = 0;
var totalNumberOfPlayers = 6;

console.log('The number of players are:'+numberOfPlayers);
exports.initGame = function(listener, socket,thisGameId){
    
    io = listener; 
    gameSocket = socket;
    thisGameId = thisGameId;
    gameSocket.emit('connected', { message: "You are connected!"}); 
    gameSocket.on('joinNewGame', joinNewGame);
    gameSocket.on('changeHackerPosition',changeHackerPosition);
    gameSocket.on('joinedNewGame',onPlayerJoinedNewGame);
    gameSocket.on('send:message',onSendMessage);
    console.log("Emitted the message");
    
}


/* *******************************
   *                             *
   *       HOST FUNCTIONS        *
   *                             *
   ******************************* */

/**
 * The 'START' button was clicked and 'hostCreateNewGame' event occurred.
 */
function joinNewGame(callback) {
    // Create a unique Socket.IO Room
    //var thisGameId = ( Math.random() * 100000 ) | 0;
    numberOfPlayers = numberOfPlayers+1;
    console.log("The number of players are:"+numberOfPlayers);
   
     var index = (numberOfPlayers-1)%6;
     var position = hackerTypes[index].position
     console.log("The position for next player is:"+position);
     callback({gameId: thisGameId, mySocketId: this.id,role:arrayOfTypes[numberOfPlayers-1],rules:hackerTypes[numberOfPlayers-1],position:position});   
   
    
};


function onPlayerJoinedNewGame(){

    console.log('The value of this is:'+this.id);
    console.log('The value of gameSocket is:'+gameSocket.id);
    console.log('The number of players are:'+numberOfPlayers);
    var sock = this;
    var message,data; 
    if(numberOfPlayers == totalNumberOfPlayers){
       
       message1 = "New Player Joined. Total "+numberOfPlayers+" players. Start the Game!!";
       message2 = "Successfully  Joined. Total "+numberOfPlayers+" players. Start the Game!!";
       data1 = {numberOfPlayers:numberOfPlayers,message:message1,canStartPlaying:1};
       data2 = {numberOfPlayers:numberOfPlayers,message:message2,canStartPlaying:1};
    
    }
    else{
    
      message1 = "New Player Joined. Total "+numberOfPlayers+" players. Require "+(totalNumberOfPlayers-numberOfPlayers)+" more players. Wait...";
      message2 = "Successfully Joined. Total "+numberOfPlayers+" players. Require "+(totalNumberOfPlayers-numberOfPlayers)+" more players. Wait...";
      data1 = {numberOfPlayers:numberOfPlayers,message:message1,canStartPlaying:0};
      data2 = {numberOfPlayers:numberOfPlayers,message:message2,canStartPlaying:0};
    
    }
    sock.broadcast.emit('log',data1);
    sock.emit('log',data2);
    
};


function onSendMessage(message){

   var sock = this; 
   sock.broadcast.emit('receive:message',message);

};
 
 
/* *****************************
   *                           *
   *     Game Logic            *
   *                           *
   ***************************** */


var arrayOfTypes = ['black-hat','script-kiddie','hacktivist','state-sponsored','cyber-terrorist','spy'];

var hackerTypes = [
{
id:0
,typeName:"black-hat"
,Description:"Can access products and install malware diagonally"
,accessMove:{
   diagonal:1
  ,anywhere:0
   
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
,position:0   
}
,{
  id:1
,typeName:"script-kiddie"
,Description:"Can move through one or more secured and missing positions"
,accessMove:{
    diagonal:1
   ,anywhere:{
         numberOfActions:4
       }
   
 }
,canCrossMissingProduct:1
,canMoveOtherHackers:null
,canShareObjCardAnyWhere:null
,canInstallMalwareAnyWhere:null
,position:8
}
,{
   id:2
,typeName:"hacktivist"
,Description:"Give objectives to Hackers anywhere"
,accessMove:null
,canCrossMissingProduct:null
,canMoveOtherHackers:null
,canShareObjCardAnyWhere:1
,canInstallMalwareAnywhere:null
,position:19 
}
,{
   id:3
,typeName:"state-sponsored"
,Description:"Can access any product for one action and once per turn"
,accessMove:{
   diagonal:1
  ,anywhere:{
         numberOfActions:1
       }
   
 }
,canCrossMissingProduct:null
,canMoveOtherHackers:null
,canShareObjCardAnyWhere:null
,canInstallMalwareAnywhere:null
,position:11 

}
,{
  id:4
,typeName:"cyber-terrorist"
,Description:"Can move other hackers upto two adjacent positions for one action"
,accessMove:null
,canCrossMissingProduct:null
,canMoveOtherHackers:{
       maxNumberOfAdjacentProducts:2

   }
,canShareObjCardAnywhere:null
,canInstallMalwareAnywhere:null
,position: 24
}
,{
 id:5
,typeName:"spy"
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
,position:20    
  
}];

var changeHackerPosition = function(data){
 
   console.log("The id is:"+this.id);
   console.log("The gameSocket is:",gameSocket.id);
   var sock = this;
   console.log("The sock is:",sock.id);
   sock.broadcast.emit('hackerPositionChanged',data);
   
}

//Min included and max excluded;
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}