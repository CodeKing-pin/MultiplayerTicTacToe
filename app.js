let boxes=document.querySelectorAll(".box")
let msg=document.querySelector("#msg")
let msg_container=document.querySelector(".msg-container")
let reset_game=document.querySelector("#reset-btn")
let newbtn=document.querySelector("#new-btn")

let count=0;
let turn0=true;
boxes.forEach((box) => {
    box.addEventListener("click",()=>{
        if(turn0){
            box.innerText="O"
            turn0=false;
        }
        else{
            box.innerText="X"
            turn0=true;
        }
        checkWinner();
        box.disabled=true
        count++;

        let isWinner=checkWinner()
        if(count===9 && !isWinner){
            gameDraw();
        }
    });
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
  turn0=true;
  enableBoxes();
  msg_container.classList.add("hide")
  count=0;
}

newbtn.addEventListener("click",resetGame);
reset_game.addEventListener("click",resetGame);


