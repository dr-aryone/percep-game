var game = {};
var canvasSize = {width: 1000, height: 562};

game.init = function() {
  game.stage = new createjs.Stage('gameCanvas');
  game.stage.enableMouseOver(10);

  var startButton = new createjs.Shape();
  startButton.graphics.beginFill("#00FF00").drawRect(450, 300, 100, 50);
  startButton.on('mouseover', function(event) {
    event.target.alpha = 0.8;
  });

  startButton.on('mouseout', function(event) {
    event.target.alpha = 1;
  });

  startButton.on('click', function() {
    startButton.removeAllEventListeners();
    game.stage.enableMouseOver(0);
    game.stage.removeAllChildren();
    var countDown = new createjs.Text("3", "bold 70px Arial", "#000");
    countDown.x = 477;
    countDown.y = 330;
    countDown.textBaseline = "alphabetic";
    game.stage.addChild(countDown);
    var interval = setInterval(function() {
      countDown.text = parseInt(countDown.text)-1;
    } ,1000);
    setTimeout(function() {
      clearInterval(interval);
      startGame();
    }, 3000);
  });

  var startButtonText = new createjs.Text("Start", "bold 20px Arial", "#fff");
  startButtonText.x = 477;
  startButtonText.y = 330;
  startButtonText.textBaseline = "alphabetic";

  var welcomeText = new createjs.Text("                                  Click the purple circles!\nPlease note that the game is not designed for use with touchpad", "bold 20px Arial", "#000");
  welcomeText.x = 200;
  welcomeText.y = 230;
  welcomeText.textBaseline = "alphabetic";

  game.stage.addChild(startButton);
  game.stage.addChild(startButtonText);
  game.stage.addChild(welcomeText);

  createjs.Ticker.addEventListener("tick", game.render);

  function startGame() {
    game.stage.removeAllChildren();
    var numBackgroundObjects = 10;
    var numForegroundObjects = 10;
    game.foreGroundColor = "#FF00E0";
    game.backgroundColor = "#00FF00";
    game.clickTime = 3000;
    game.foregroundObjects = {};
    game.score = 0;
    game.targetsTotal = 0;
    game.targetsKilled = 0;
    game.targetsMissed = 0;
    game.time = 30;
    var hiddenObjectSpeed = Math.random() > 0.5 ? "fast" : "slow";
    var hiddenObjectIsForegroundColor = Math.random() > 0.5;
    createjs.Ticker.setFPS(60);

    game.hiddenObjectTemplate = {
      speed: hiddenObjectSpeed,
      isForegroundColor : hiddenObjectIsForegroundColor,
      color: hiddenObjectIsForegroundColor ? "#FF00E0" : "#00FF00"
    };

    var backgroundObjects = [];

    for (var i = 0 ; i < 30 ; i++) {
      backgroundObjects[i] = {};
      backgroundObjects[i].shape = new createjs.Shape();
      backgroundObjects[i].shape.graphics.beginFill(game.backgroundColor).drawCircle(0, 0, 30);
      game.stage.addChild(backgroundObjects[i].shape);
      backgroundObjects[i].xSpeed = -5 + Math.random()*10;
      backgroundObjects[i].ySpeed = -5 + Math.random()*10;
      backgroundObjects[i].shape.x = 50 + Math.random()*800;
      backgroundObjects[i].shape.y = 50 + Math.random()*400;
    }

    game.backgroundObjects = backgroundObjects;

    var gameLoopInterval = setInterval(game.gameLoop, 10);

    var gameTimeInterval = setInterval(function() {
      if (game.time <= 0) {
        clearInterval(gameLoopInterval);
        clearInterval(gameTimeInterval);
        $.get('/form.html', function(result) {
          $('.modal-body').append(result);
          $('#myModal').modal({backdrop: 'static'});
        });
      } else {
        game.time--;
        $('#time').html(game.time);
        if (game.time === 15) {
          game.spawnHiddenObject();
        }
      }
    }, 1000);

  }

}

game.render = function() {
  game.stage.update();
}
game.i = 0;

game.gameLoop = function() {
  moveBackground();
  reduceSizeOfForegroundObjects();

  game.i++;
  if (game.i % 50 === 0) {
    spawnForegroundObject();
  }

  function reduceSizeOfForegroundObjects() {
    Object.keys(game.foregroundObjects).forEach(reduceSize);

    function reduceSize(element) {
      element = game.foregroundObjects[element];
      element.scaleX -= 0.0025;
      element.scaleY -= 0.0025;
    }
  }

  function moveBackground() {
    game.backgroundObjects.forEach(moveBackgroundObject);
    moveHiddenObject();

    function moveBackgroundObject(backgroundObject) {
      backgroundObject.shape.x += backgroundObject.xSpeed;
      backgroundObject.shape.y += backgroundObject.ySpeed;
      if (backgroundObject.shape.x + 50 > canvasSize.width || backgroundObject.shape.x - 50 < 0) {
        backgroundObject.xSpeed *= -1;
      }
      if (backgroundObject.shape.y + 50 > canvasSize.height || backgroundObject.shape.y - 50 < 0) {
        backgroundObject.ySpeed *= -1;
      }
    }

    function moveHiddenObject() {
      if (!game.hiddenObject)
        return;

      game.hiddenObject.shape.x += game.hiddenObject.xSpeed;
      game.hiddenObject.shape.y += game.hiddenObject.ySpeed;
    }

  }

  function spawnForegroundObject() {
    game.targetsTotal++;
    var foregroundObject = new createjs.Shape();
    foregroundObject.graphics.beginFill(game.foreGroundColor).drawCircle(0, 0, 30);

    var to = setTimeout(function() {
      removeElement(foregroundObject);
      game.targetsMissed++;
      $('#targetsMissed').html(game.targetsMissed);
      clearInterval(interval);
    }, game.clickTime);

    foregroundObject.addEventListener('click', function(event) {
      clearTimeout(to);
      game.targetsKilled++;
      $('#targetsKilled').html(game.targetsKilled);
      removeElement(event.target);
    });

    var interval = setInterval(reduceTime, 1000);

    foregroundObject.x = 30 + Math.random()*920;
    foregroundObject.y = 30 + Math.random()*500;

    foregroundObject.text = new createjs.Text(game.clickTime/1000, "20px Arial", "#fff");
    foregroundObject.text.parentObject = foregroundObject;
    foregroundObject.text.x = foregroundObject.x-5;
    foregroundObject.text.y = foregroundObject.y+5;
    foregroundObject.text.textBaseline = "alphabetic";

    foregroundObject.text.addEventListener('click', function(event) {
      clearTimeout(to);
      game.targetsKilled++;
      $('#targetsKilled').html(game.targetsKilled);
      removeElement(event.target.parentObject);
    });

    game.foregroundObjects[foregroundObject.id] = foregroundObject;
    game.stage.addChild(foregroundObject);
    game.stage.addChild(foregroundObject.text);

    function reduceTime() {
      foregroundObject.text.text = parseInt(foregroundObject.text.text)-1;
    }

    function removeElement(element) {
      delete game.foregroundObjects[element.id];
      element.removeAllEventListeners();
      element.text.removeAllEventListeners();
      game.stage.removeChild(element);
      game.stage.removeChild(element.text);
    }
  }


}

game.spawnHiddenObject = function() {
  var hiddenObject = {};
  hiddenObject.shape = new createjs.Shape();
  hiddenObject.shape.graphics.beginFill(game.hiddenObjectTemplate.color).drawRect(0, 0, 30, 30);
  hiddenObject.shape.x = -30;
  hiddenObject.shape.y = 250;
  hiddenObject.xSpeed = game.hiddenObjectTemplate.speed === 'fast' ? 5 : 2;
  hiddenObject.ySpeed = 0;
  game.hiddenObject = hiddenObject;
  game.stage.addChildAt(hiddenObject.shape, 0);
}
