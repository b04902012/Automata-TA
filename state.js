function State(name,isFinal,stateTransition){
    var state=this
    var div=canvas()
    function canvas(){
        var canvas=document.createElement('canvas')
        var context=canvas.getContext('2d')
        var radius=lineWidth+stateWidth/2
        canvas.width=radius*2
        canvas.height=radius*2
        context.strokeStyle='black'
        context.lineWidth=lineWidth*2
        context.beginPath()
        context.arc(radius,radius,radius-lineWidth,0,Math.PI*2)
        context.fillStyle='white'
        context.fill()
        context.stroke()
        if(isFinal){
            context.lineWidth=lineWidth
            context.beginPath()
            context.arc(radius,radius,radius-lineWidth-gap,0,Math.PI*2)
        }
        context.fillStyle='black'
        context.font='bold '+chessFont+'px Ukai'
        context.textAlign='center'
        context.textBaseline='middle'
        context.fillText(
                name,
                radius,radius
        )
        context.stroke()
        return canvas
    }
    var transition=stateTransition
}
