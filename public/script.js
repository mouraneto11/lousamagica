document.addEventListener('DOMContentLoaded', ()=>{

    const socket = io.connect()
  
    const pincel = {
      active: false,
      move: false,
      posCurrent: {x: 0, y: 0},
      posAfter: null
    }
  
    const canvas = document.querySelector('#lousa')
    canvas.width = 800
    canvas.height = 600
  
    const context = canvas.getContext('2d')
    context.lineWidth = 4
    context.strokeStyle = 'yellow'
  
    const drawLine = (line) => {
      if(line){
        context.beginPath()
        context.moveTo(line.posAfter.x, line.posAfter.y)
        context.lineTo(line.posCurrent.x, line.posCurrent.y)
        context.stroke()
      }
      else {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    
    canvas.onmousedown = () => { pincel.active = true }
    canvas.onmouseup = () => { pincel.active = false }
    canvas.onmousemove = event => { 
      pincel.posCurrent.x = event.clientX
      pincel.posCurrent.y = event.clientY
      pincel.move = true
    }
  
    socket.on('draw', line => {
      drawLine(line)
    })
  
    const cycle = () => {
      if (pincel.active && pincel.move && pincel.posAfter){
        socket.emit('draw', {posCurrent: pincel.posCurrent, posAfter: pincel.posAfter})
        // drawLine({posCurrent: pincel.posCurrent, posAfter: pincel.posAfter})
        pincel.move = false
      }
      pincel.posAfter = { x: pincel.posCurrent.x, y: pincel.posCurrent.y}
  
      setTimeout(cycle, 10)
    }
  
    cycle()
  
    document.body.addEventListener('keyup', e => {
      if(e.keyCode === 32){
        socket.emit('clear')
      }
    })
  
  })