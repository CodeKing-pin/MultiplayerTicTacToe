from flask import Flask,url_for,render_template,request
from flask_socketio import SocketIO,emit,send
from game import gameManger
bothPlayerReady=False
app = Flask(__name__)
socketio=SocketIO(app)
players={'x_user':None,'o_user':None}
pendingPlayers=[]
gameHandler=gameManger()

def startGame():
    assignRole()
    gameHandler.setPlayersId(players['x_user'],players['o_user'])
    playerToMove,otherPlayer=gameHandler.startGame()
    emit('move',to=playerToMove)
    emit('message',{'message':'Your Turn'},to=playerToMove)
    emit('message',{'message':'Wait For other Player Turn'},to=otherPlayer)
    
def assignRole():
    emit('assignClientRole',{'clientRole':"X",'isItPlayerTurn':True},to=players['x_user'])
    emit('assignClientRole',{'clientRole':"O",'isItPlayerTurn':False},to=players['o_user'])
    print('New game',players)
    pendingPlayers.clear()


@app.route("/")
def game():
    return render_template('index.html')



@socketio.on('user_disconnected')
def disconnectUser(data):
    print("disconnect")

@socketio.on('user_start_game')
def assignUserASymbol(data):
    if request.sid not in pendingPlayers:
        pendingPlayers.append(request.sid)
        if len(pendingPlayers)==2:
            players['o_user']=request.sid
            startGame()
        else:
            emit('waitForOtherPerson')
            players['x_user']=request.sid
    
@socketio.on('playerMove')
def handlePlayerMove(playerMove):
    output=gameHandler.markBox(playerMove['boxClicked'],fromWhichPlayer=request.sid)
    print(output)
    if output==True:
        playerToMove,playerToRcvMove=gameHandler.whichPlayerToMove()
        emit('otherPlayerMove',{'boxMarked':playerMove['boxClicked']},to=playerToMove)
        if gameHandler.checkWinnner():
            print(gameHandler.playerTurn,'Won')
            emit('win',to=request.sid)
            emit('lose',to=playerToMove)
            emit('enableReset',to=[playerToMove,request.sid])
                
        elif gameHandler.checkDraw(): 
            emit('draw',to=[playerToMove,request.sid])
        else:
            emit('move',to=playerToMove)
            emit('message',{'message':'Your Turn'},to=playerToMove)
            emit('message',{'message':'Wait For other Player Turn'},to=playerToRcvMove)
    else:
        emit('message',{'message':'Your Turn\nInvaid Move'},to=request.sid)
if __name__=='__main__':
    socketio.run(app,debug=True)