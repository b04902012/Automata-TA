function Automata(state,transition){
    var automata=this
    this.div=document.createElement('div')
    this.div.style.lineHeight=0
    this.div.width='100%'
    this.div.style.position='relative'
    this.state=state
    setCoordinate()

    for(let s in this.state){
        var stateDiv=this.state[s].div
        this.div.appendChild(stateDiv)
        this.state[s].div.style.position='absolute'
        this.state[s].position=automata.chessPosition[s]
        this.state[i].index=i
        this.state[i].div.style.left=this.state[s].position[0]-stateWidth/2+'px'
        this.state[i].div.style.top=this.state[s].position[1]-stateWidth/2+'px'
    }
    function positionToState(p){
        for(let s of automata.state){
            if( p[0]==s.position[0]&&p[1]==s.position[1])return c
        }
    }
    this.div.addEventListener('mousedown',mousedown)
    function mousedown(event){
        if(selfPlayer!==currentPlayer)return false
        var body=document.body
        var positionMouseInitial=[
            event.clientX+body.scrollLeft-game.div.offsetLeft,
            event.clientY+body.scrollTop-game.div.offsetTop
        ]
        var positionMouse=positionMouseInitial
        var chessChoosen=positionToChess(positionMouse)
        if(chessChoosen){
            if(chessChoosen.color!==selfPlayer)return false
            game.div.appendChild(chessChoosen.div)
            console.log(chessChoosen)
            var positionChoosen=coordinateToPosition(chessChoosen.coordinate)
            var distance=[positionChoosen[0]-positionMouse[0],positionChoosen[1]-positionMouse[1]]
            addEventListener('mousemove',mousemoveFunction)
            addEventListener('mouseup',mouseupFunction)
        }
        function mousemoveFunction(event){
            chessChoosen.div.style.left=event.clientX+body.scrollLeft-game.div.offsetLeft+distance[0]-chessWidth/2+'px'
            chessChoosen.div.style.top=event.clientY+body.scrollTop-game.div.offsetTop+distance[1]-chessWidth/2+'px'
        }
        function mouseupFunction(event){
            removeEventListener('mousemove',mousemoveFunction)
            removeEventListener('mouseup',mouseupFunction)
            var choosenPosition=[
                event.clientX+body.scrollLeft-game.div.offsetLeft+distance[0],
                event.clientY+body.scrollTop-game.div.offsetTop+distance[1]
            ]
            var coordinateDestination=positionToCoordinate(choosenPosition)
            if(legalMove(chessChoosen,chessChoosen.coordinate,coordinateDestination)){
               selfMove(chessChoosen,coordinateDestination)
            }
            else{
                moveBack(chessChoosen)
            }
        }
    }

    function eliminate(c){
        c.coordinate=[-100,-100]
        game.div.removeChild(c.div)
    }
    function move(c,cd){
        var chessDestination=coordinateToChess(cd)
        if(chessDestination)
            eliminate(chessDestination)
        c.coordinate=cd
        var pd=coordinateToPosition(cd)
        c.div.style.left=pd[0]-chessWidth/2+'px'
        c.div.style.top=pd[1]-chessWidth/2+'px'
    }
    function moveBack(c){
        var cc=coordinateToPosition(c.coordinate)
        c.div.style.left=cc[0]-chessWidth/2+'px'
        c.div.style.top=cc[1]-chessWidth/2+'px'
    }
    function selfMove(c,cd){
        socket.send(c.coordinate[0]+' '+c.coordinate[1]+' '+cd[0]+' '+cd[1])
        currentPlayer=1-selfPlayer
        move(c,cd)
    }
    
    this.opponent=function(event){
        var data=event.data.split(' ')
        var cs=data.slice(0,2)
        var cd=data.slice(2,4)
        cs[0]=8-cs[0]
        cs[1]=9-cs[1]
        cd[0]=8-cd[0]
        cd[1]=9-cd[1]
        var c=coordinateToChess(cs)
        move(c,cd)
        currentPlayer=selfPlayer
    }

    function legalMove(c,cs,cd){
        var chessDestination=coordinateToChess(cd)
        var checkEliminate=false
        if(chessDestination){
            var colorDestination=chessDestination.color
            if(colorDestination===c.color)return false
            checkEliminate=true
        }
        if(cd[0]<0||cd[0]>8||cd[1]<0||cd[1]>9)return false
        switch(c.type){
            case 0:
                if(!insidePalace())return false
                if(Math.abs(cd[0]-cs[0])+Math.abs(cd[1]-cs[1])>1)return false
                return true
                break
            case 1:
                if(!insidePalace())return false
                if(Math.abs(cd[0]-cs[0])!==1||Math.abs(cd[1]-cs[1])!==1)return false
                return true
                break
            case 2:
                if(!behindRiver())return false
                if(Math.abs(cd[0]-cs[0])!==2||Math.abs(cd[1]-cs[1])!==2)return false
                var eye=coordinateToChess([(cd[0]+cs[0])/2,(cd[1]+cs[1])/2])
                if(eye)return false
                return true
                break
            case 3:
                if(cd[0]!==cs[0]&&cd[1]!==cs[1])return false
                if(cd[0]===cs[0]){
                    for(let i=min(cd[1],cs[1])+1;i<max(cd[1],cs[1]);i++){
                        var barrier=coordinateToChess([cs[0],i])
                        if(barrier)return false
                    }
                }
                if(cd[1]===cs[1]){
                    for(let i=min(cd[0],cs[0])+1;i<max(cd[0],cs[0]);i++){
                        var barrier=coordinateToChess([i,cs[1]])
                        if(barrier)return false
                    }
                }
                return true
                break
            case 4:
                if(Math.abs(cd[0]-cs[0])*Math.abs(cd[1]-cs[1])!==2)return false
                var leg
                if(Math.abs(cd[0]-cs[0])===2){
                    console.log('0')
                    leg=coordinateToChess([(cd[0]+cs[0])/2,cs[1]])
                }
                if(Math.abs(cd[1]-cs[1])===2){
                    console.log('1')
                    leg=coordinateToChess([cs[0],(cd[1]+cs[1])/2])
                }
                console.log(leg)
                if(leg)return false
                return true
                break
            case 5:
                if(cd[0]!==cs[0]&&cd[1]!==cs[1])return false
                var numOfBarrier=0
                if(cd[0]===cs[0]){
                    for(let i=min(cd[1],cs[1])+1;i<max(cd[1],cs[1]);i++){
                        var barrier=coordinateToChess([cs[0],i])
                        if(barrier)numOfBarrier++
                    }
                }
                if(cd[1]===cs[1]){
                    for(let i=min(cd[0],cs[0])+1;i<max(cd[0],cs[0]);i++){
                        var barrier=coordinateToChess([i,cs[1]])
                        if(barrier)numOfBarrier++
                    }
                }
                if(checkEliminate)
                    if(numOfBarrier!==1)return false
                if(!checkEliminate)
                    if(numOfBarrier!==0)return false
                return true
                break
            case 6:
                if(Math.abs(cd[0]-cs[0])+Math.abs(cd[1]-cs[1])>1)return false
                if(cd[1]-cs[1]===1)return false
                if(behindRiver())
                    if(cd[0]!==cs[0])return false
                return true
        }

        function insidePalace(){
            if(cd[0]<3||cd[0]>5)return false
            if(cd[1]<7)return false
            return true
        }
        function behindRiver(){
            if(cd[1]<5)return false
            return true
        }
        return true
        function min(a,b){
            if(a<b)return a
            return b
        }
        function max(a,b){
            if(a>b)return a
            return b
        }
    }
}
