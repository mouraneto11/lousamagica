document.addEventListener('DOMContentLoaded',()=>{

    const socket = io.connect();

    const pencil = {
        ativo: false,
        movendo: false,
        posAfter:{x:0,y:0},
        posCurrent: null
    }
    const lousa = document.querySelector('#lousa');
    const context = lousa.getContext('2d');

    lousa.width = 700;
    lousa.height = 500;


    context.lineWidth = 7;
    context.strokeStyle = 'red';
    const drawLine = (line) => {
        
          context.beginPath()
          context.moveTo(line.posAfter.x, line.posAfter.y)
          context.lineTo(line.posCurrent.x, line.posCurrent.y)
          context.stroke()
        
      }
    
    lousa.onmousedown = (evento) => {pencil.ativo = true};
    lousa.onmouseup = (evento) => {pencil.ativo = false};

    lousa.onmousemove = (evento) => {
        pencil.posAfter.x = evento.clientX
        pencil.posAfter.y = evento.clientY
        pencil.movendo = true;
    }

    socket.on('draw',(line)=>{
        drawLine(line);
    })

    const ciclo = () => {
        if(pencil.ativo && pencil.movendo && pencil.posCurrent){
            socket.emit('draw',{ posAfter: pencil.posAfter, posCurrent: pencil.posCurrent });
            //drawLine({ posAfter: pencil.posAfter, posCurrent: pencil.posCurrent})
            pencil.movendo = false;
        }
        pencil.posCurrent = { x: pencil.posAfter.x, y: pencil.posAfter.y};
        setTimeout(ciclo, 10);
    }

    ciclo();
        


})