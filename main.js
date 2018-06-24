/**  @type { HTMLCanvasElement } */
const canvas = document.getElementById('astroids-canvas')
const context = canvas.getContext('2d')

const FPS = 30
const shipSize = 30
const rotationSpeed = 360
const enginePower = 5
const friction = 1

let frame = 0

const spaceship = {
  xPosition: canvas.width / 2,
  yPosition: canvas.height / 2,
  xVelocity: 0,
  yVelocity: 0,
  radius: shipSize / 2,
  direction: 90 / 180 * Math.PI,
  rotation: 0,
  enginesThrusting: false
}

const updateCanvas = () => {
  if (frame < FPS) {
    frame++
  } else {
    frame = 0
  }
  //draw background
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)

  //rotate spaceship
  spaceship.direction += spaceship.rotation

  //update spaceship velocity
  if (spaceship.enginesThrusting) {
    spaceship.xVelocity += enginePower * Math.cos(spaceship.direction) / FPS
    spaceship.yVelocity += enginePower * Math.sin(spaceship.direction) / FPS
    //draw engine flames
    if (frame % 2 == 0) { //make flames flicker
      context.fillStyle = 'white'
      context.strokeStyle = 'orange'
    } else {
      context.fillStyle = 'orange'
      context.strokeStyle = 'yellow'
    }
    context.lineWidth = shipSize / 15
    context.beginPath()
    context.moveTo( //back left of ship
      spaceship.xPosition - spaceship.radius * (2 / 3 * Math.cos(spaceship.direction) + 1 / 2 * Math.sin(spaceship.direction)),
      spaceship.yPosition + spaceship.radius * (2 / 3 * Math.sin(spaceship.direction) - 1 / 2 * Math.cos(spaceship.direction))
    )
    context.lineTo( //behind center of ship
      spaceship.xPosition - spaceship.radius * 5 / 3 * Math.cos(spaceship.direction),
      spaceship.yPosition + spaceship.radius * 5 / 3 * Math.sin(spaceship.direction)
    )
    context.lineTo( //back right of ship
      spaceship.xPosition - spaceship.radius * (2 / 3 * Math.cos(spaceship.direction) - 1 / 2 * Math.sin(spaceship.direction)),
      spaceship.yPosition + spaceship.radius * (2 / 3 * Math.sin(spaceship.direction) + 1 / 2 * Math.cos(spaceship.direction))
    )
    context.closePath() // back to nose
    context.fill()
    context.stroke()
  } else {
    if (spaceship.xVelocity > 0) {
      spaceship.xVelocity -= friction / FPS
    } else if (spaceship.xVelocity < 0) {
      spaceship.xVelocity += friction / FPS
    }
    if (spaceship.yVelocity > 0) {
      spaceship.yVelocity -= friction / FPS
    } else if (spaceship.yVelocity < 0) {
      spaceship.yVelocity += friction / FPS
    }
  }

  //draw spaceship
  context.strokeStyle = 'white'
  context.lineWidth = shipSize / 15
  context.beginPath()
  context.moveTo( //nose of ship
    spaceship.xPosition + 4 / 3 * spaceship.radius * Math.cos(spaceship.direction),
    spaceship.yPosition - 4 / 3 * spaceship.radius * Math.sin(spaceship.direction)
  )
  context.lineTo( //back left of ship
    spaceship.xPosition - spaceship.radius * (2 / 3 * Math.cos(spaceship.direction) + Math.sin(spaceship.direction)),
    spaceship.yPosition + spaceship.radius * (2 / 3 * Math.sin(spaceship.direction) - Math.cos(spaceship.direction))
  )
  context.lineTo( //back right of ship
    spaceship.xPosition - spaceship.radius * (2 / 3 * Math.cos(spaceship.direction) - Math.sin(spaceship.direction)),
    spaceship.yPosition + spaceship.radius * (2 / 3 * Math.sin(spaceship.direction) + Math.cos(spaceship.direction))
  )
  context.closePath() // back to nose
  context.stroke()

  //update spaceship position
  spaceship.xPosition += spaceship.xVelocity
  spaceship.yPosition -= spaceship.yVelocity

  //handle spaceship going off screen
  if (spaceship.xPosition < 0 - spaceship.radius) {
    spaceship.xPosition = canvas.width + spaceship.radius
  } else if (spaceship.xPosition > canvas.width + spaceship.radius) {
    spaceship.xPosition = 0 - spaceship.radius
  }
  if (spaceship.yPosition < 0 - spaceship.radius) {
    spaceship.yPosition = canvas.height + spaceship.radius
  } else if (spaceship.yPosition > canvas.height + spaceship.radius) {
    spaceship.yPosition = 0 - spaceship.radius
  }
}

document.addEventListener('keydown', e => {
  console.log(e.keyCode)
  console.log(spaceship.direction)
  switch(e.keyCode) {
    case 37: //left arrow
      spaceship.rotation = rotationSpeed / 180 * Math.PI / FPS
      break
    case 38: //up arrow
      spaceship.enginesThrusting = true
      break
    case 39: //right arrow
      spaceship.rotation = -rotationSpeed / 180 * Math.PI / FPS
  }
})

document.addEventListener('keyup', e => {
  switch(e.keyCode) {
    case 37: //left arrow
      spaceship.rotation = 0
      break
    case 38: //up arrow
      spaceship.enginesThrusting = false
      break
    case 39: //right arrow
      spaceship.rotation = 0
  }
})

setInterval(updateCanvas, 1000 / FPS)