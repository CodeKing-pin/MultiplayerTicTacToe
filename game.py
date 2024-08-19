
class gameManger:
    def  __init__(self) -> None:
        pass
    def whichPlayerToMove(self):
        if self.playerTurn=='o_user':
            return self.o_user,self.x_user
        else:
            return self.x_user,self.o_user
    
    def returnPlayerTurnSymbol(self):
        if self.playerTurn=='x_user':
            return 'X'
        return 'O'            

    def setPlayersId(self,x_user_requestId,o_user_requestId):
        self.x_user=x_user_requestId
        self.o_user=o_user_requestId
        self.gameBoard=['','','','','','','','','']
        self.winningPatterns=[[0,1,2],[1,4,7],[3,4,5],[6,7,8],[0,3,6],[2,5,8],[0,4,8]]
        self.playerTurn='x_user'

    def startGame(self):
        return self.x_user,self.o_user
    def playerSymboltoId(self,symbol):
        if symbol=='x_user':
            return self.x_user
        else:
            return self.o_user
    def checkWinnner(self):
        gameBoard=self.gameBoard
        for pattern in self.winningPatterns:
            box1=gameBoard[pattern[0]]
            box2=gameBoard[pattern[1]]
            box3=gameBoard[pattern[2]]
            if box1=='' or box2=='' or box3=='':
                continue
            elif box1==box2 and box2==box3:
                return True
        return False
    def checkDraw(self):
        for box in self.gameBoard:
            if box=='':
                return False
        return True
    def markBox(self,boxId,fromWhichPlayer):
        if fromWhichPlayer!=self.playerSymboltoId(self.playerTurn):
            return False
        elif self.gameBoard[boxId]!='':
            return False
        
        self.gameBoard[boxId]=self.returnPlayerTurnSymbol()
        self.changePlayerTurn()
        return True
    def changePlayerTurn(self):
        if self.playerTurn=='x_user':
            self.playerTurn='o_user'
        else:
            self.playerTurn='x_user'
