var game = {};
var canvasSize = {width: 1000, height: 562};

game.init = function() {
  var stage = new createjs.Stage('gameCanvas');

  var circles = [];

  for (var i = 0 ; i < 10 ; i++) {
    circles[i] = {};
    circles[i].shape = new createjs.Shape();
    circles[i].shape.graphics.beginFill("red").drawCircle(0, 0, 50);
    stage.addChild(circles[i].shape);
    circles[i].xSpeed = 0;
    circles[i].ySpeed = 0;
    circles[i].shape.x = 50+Math.random()*800;
    circles[i].shape.y = 50+Math.random()*400;
    circles[i].shape.addEventListener('click', function(event) {
      console.log(event);
      event.target.removeAllEventListeners();
      stage.removeChild(event.target);
    });
  }
  setInterval(moveCircles, 10);

  setInterval(render, 17);
  

  function render() {
    stage.update();
  }

  function moveCircles() {
    circles.forEach(moveCircle);

    function moveCircle(circle) {
      circle.shape.x += circle.xSpeed;
      circle.shape.y += circle.ySpeed;
      circle.xSpeed += -1 + Math.random()*2;
      circle.ySpeed += -1 + Math.random()*2;

      if (Math.abs(circle.xSpeed) > 10)
        circle.xSpeed *= 0.6;
      if (Math.abs(circle.ySpeed) > 10)
        circle.ySpeed *= 0.6;

      if (circle.shape.x + 50 > canvasSize.width || circle.shape.x - 50 < 0) {
        circle.xSpeed *= -1;
      }
      if (circle.shape.y + 50 > canvasSize.height || circle.shape.y - 50 < 0) {
        circle.ySpeed *= -1;
      }
    }
  }
}
