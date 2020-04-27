import Matter from 'matter-js';
import Constants from './Constants';
import Shark from './Shark';

let sharks = 0;
let start = false;
let count = 0;
let gapTop = 0;
let gapBottom = 0;
export const resetSharks = () => {
  sharks = 0;
  start = false;
}

export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const generateSharks = () => {
  let leftTopShark = randomBetween(50, Constants.MAX_WIDTH / 2 - 20);
  let rightTopShark = randomBetween(Constants.MAX_WIDTH / 2 + 50, Constants.MAX_WIDTH - 50);
  let leftBottomShark = randomBetween(50, Constants.MAX_WIDTH / 2);
  let rightBottomShark = randomBetween(Constants.MAX_WIDTH / 2 + 50, Constants.MAX_WIDTH - 50);

  let sizes = [leftTopShark, rightTopShark, leftBottomShark, rightBottomShark];
  if (Math.random() < 0.25) {
    sizes = sizes.reverse();
  }

  return sizes;
}

export const addSharksAtLocation = (y, world, entities) => {
  let [shark1Width, shark2Width, shark3Width, shark4Width] = generateSharks();

  gapTop = [shark1Width, shark2Width];
  gapBottom = [shark3Width, shark4Width];

  let yTop = y + randomBetween(-200, 0);
  let yBottom = y + randomBetween(-500, -300);
  let shark1 = Matter.Bodies.rectangle(
    shark1Width,
    yTop,
    40,
    50,
    { isStatic: true }
  );

  let shark2 = Matter.Bodies.rectangle(
    shark2Width,
    yTop,
    40,
    50,
    { isStatic: true }
  );

  let shark3 = Matter.Bodies.rectangle(
    shark3Width,
    yBottom,
    40,
    50,
    { isStatic: true }
  );

  let shark4 = Matter.Bodies.rectangle(
    shark4Width,
    yBottom,
    40,
    50,
    { isStatic: true }
  );

  Matter.World.add(world, [shark1, shark2, shark3, shark4]);

  entities["shark" + (sharks + 1)] = {
    body: shark1, renderer: Shark, scored: false,
  }

  entities["shark" + (sharks + 2)] = {
    body: shark2, renderer: Shark, scored: false,
  }

  entities["shark" + (sharks + 3)] = {
    body: shark3, renderer: Shark, scored: false,
  }

  entities["shark" + (sharks + 4)] = {
    body: shark4, renderer: Shark, scored: false,
  }

  sharks += 4;
}

const Physics = (entities, { touches, time, dispatch, events }) => {
  let engine = entities.physics.engine;
  let world = entities.physics.world;
  let turtle = entities.turtle.body;



  if (!start) {
    addSharksAtLocation(Constants.SHARK_HEIGHT, world, entities);
    start = true;
  }


  Object.keys(entities).forEach(key => {
    if (key.indexOf("shark") === 0 && entities.hasOwnProperty(key)) {
      let speed = +3 + sharks * 0.02;
      if (speed <= 6) {
        Matter.Body.translate(entities[key].body, { x: 0, y: +3 + sharks * 0.02 });
      } else {
        Matter.Body.translate(entities[key].body, { x: 0, y: +6 });
      }

      if (key.indexOf("shark") !== -1 && parseInt(key.replace("shark", "")) % 2 === 0) {

        if (entities[key].body.position.y >= turtle.position.y && !entities[key].scored) {
          entities[key].scored = true;
          dispatch({ type: "score" });

        }

        if (entities[key].body.position.y >= Constants.MAX_HEIGHT - 30) {
          if (count == 0) {
            if (turtle.position.x >= gapTop[0] && turtle.position.x <= gapTop[1]) {
              dispatch({ type: "score" });
            }
          }
          if (count == 1) {
            if (turtle.position.x >= gapBottom[0] && turtle.position.x <= gapBottom[1]) {
              dispatch({ type: "score" });
            }
          }

          let sharkIndex = parseInt(key.replace("shark", ""));
          delete (entities["shark" + (sharkIndex - 1)]);
          delete (entities["shark" + sharkIndex]);

          count++;
        }

        if (count == 2) {
          addSharksAtLocation(Constants.SHARK_HEIGHT, world, entities);
          count = 0;
        }

      }

    }
  });


  if (events.length) {
    for (let i = 0; i < events.length; i++) {
      
        if (events[i].type === "move-left") {
          turtle.position.x -= 1.5;
          if(turtle.position.x < 0) {
            turtle.position.x += 1.5;
          }
        }
        if (events[i].type === "move-right") {
          turtle.position.x += 1.5;
          if(turtle.position.x > Constants.MAX_WIDTH) {
            turtle.position.x -= 1.5;
          }
        }
    }
  }

  Matter.Engine.update(engine, time.delta); //시간마다 engine update

  return entities;
}

export default Physics;