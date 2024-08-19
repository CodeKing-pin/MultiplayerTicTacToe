let boxes=document.querySelectorAll(".box")
let msg=document.querySelector("#msg")
let msg_container=document.querySelector(".msg-container")
let reset_game=document.querySelector("#reset-btn")
let newbtn=document.querySelector("#new-btn")

let count=0;
let turn0=true;
var socket = io();
let currentPlayerRole = "";
let otherPlayerRole = "";
let playerTurn = false;


socket.on("connect", function () {
  socket.emit("new_user_connected", "new_user_connected");
});
socket.on("disconnect", function () {
  socket.emit("user_disconnected", "user_disconnected");
});

socket.on("message", function (data) {
  document.getElementsByClassName("title")[0].innerText =
    "\nYou are " + currentPlayerRole + "\n"+data['message'];
});
socket.on("waitForOtherPerson", function () {
  document.getElementsByClassName("title")[0].innerText =
    "\n Waiting for other player";
});

socket.on("assignClientRole", function (userRoleInfo) {
    console.log(userRoleInfo);
    currentPlayerRole = userRoleInfo["clientRole"];
    if (currentPlayerRole==='X'){
        otherPlayerRole='O'
    }
    else
        otherPlayerRole='X'

    document.getElementsByClassName("title")[0].innerText =
      "\nYou are " + currentPlayerRole;
}); 
socket.on('move',function(moveInfo){
    playerTurn=true;
});
socket.on('enableReset',function(moveInfo){
    reset_game.addEventListener("click", resetGame);

});
socket.on('win',function(){
    document.getElementsByClassName("title")[0].innerText ="You Win";
    
});
socket.on('lose',function(){
    document.getElementsByClassName("title")[0].innerText ="You Lose";
    
});
socket.on('draw',function(){
    document.getElementsByClassName("title")[0].innerText ="Its draw";
});

function move(boxIndex) {
    if(playerTurn){
        let box=boxes[boxIndex]
        box.innerText = currentPlayerRole;
        box.disabled=true
        socket.emit("playerMove", { boxClicked: boxIndex });

        playerTurn=false;
    }

}


socket.on("otherPlayerMove", function (boxClickedData) {
  let box=boxes[boxClickedData["boxMarked"]];
  box.innerText = otherPlayerRole;
  box.disabled=true;
});
winPatterns=[
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

document.getElementById('start-btn').addEventListener('click', function () {
    socket.emit("user_start_game","start game");
});
const disableBoxes=()=>{
    for(let box of boxes){
        box.disabled=true;
    }
}
const showWinner=(winner)=>{
   msg.innerText=`Winner is ${winner}`
    msg_container.classList.remove("hide")
    disableBoxes();

}


const gameDraw=()=>{
            msg.innerText="the game was a draw"
            msg_container.classList.remove("hide")
            disableBoxes()
}
const checkWinner=()=>{
    for(let pattern of winPatterns){
     let pos1Val=boxes[pattern[0]].innerText
     let pos2Val=boxes[pattern[1]].innerText
     let pos3Val=boxes[pattern[2]].innerText

        if(pos1Val!=="" && pos2Val!=="" && pos3Val!==""){
            if(pos1Val===pos2Val && pos2Val===pos3Val){
                showWinner(pos1Val);
                return true;
            }
        }
    }
    return false;
}
const enableBoxes=()=>{
    for(let box of boxes){
        box.disabled=false;
        box.innerText=""
    }
}
const resetGame=()=>{

  enableBoxes();
  msg_container.classList.add("hide")
  count=0;
}

newbtn.addEventListener("click",resetGame);



