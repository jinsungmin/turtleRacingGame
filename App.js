import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import Constants from './Constants';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import Turtle from './Turtle';
import Physics, { resetSharks } from './Physics';
import Images from './assets/Images';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

let customFonts = {
  'score_font': require('./assets/fonts/score_font.ttf'),
};

export default class App extends Component {

  constructor(props) {
    super(props);
    this.gameEngine = null;
    this.entities = this.setupWorld();

    this.state = {
      running: true,
      score: 0,
      fontsLoaded: false,
    }
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }


  setupWorld = () => {
    let engine = Matter.Engine.create({ enableSleeping: false });
    let world = engine.world;
    world.gravity.y = 0.0;

    let turtle = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT / 1.3, Constants.TURTLE_WIDTH, Constants.TURTLE_HEIGHT);
    
    Matter.World.add(world, [turtle]);

    Matter.Events.on(engine, "collisionStart", (event) => {
      let pairs = event.pairs;

      this.gameEngine.dispatch({ type: "game-over" });
    });


    return {
      physics: { engine: engine, world: world },
      turtle: { body: turtle, size: [40, 40], renderer: Turtle },
    }
  }

  onEvent = (e) => {
    if (e.type === "game-over") {
      this.setState({
        running: false
      })
    } else if (e.type === "score") {
      this.setState({
        score: this.state.score + 1
      })
    }
  }
  reset = () => {
    resetSharks();
    this.gameEngine.swap(this.setupWorld());
    this.setState({
      running: true,
      score: 0
    });
  }

  render() {
    if (this.state.fontsLoaded) {
    return (
      
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <GameEngine
          ref={(ref) => { this.gameEngine = ref; }}
          style={styles.gameContainer}
          systems={[Physics]}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities}>
          <StatusBar hidden={true} />
        </GameEngine>
          <Text style={styles.score}>{this.state.score}</Text>
          {!this.state.running && <TouchableOpacity onPress={this.reset} style={styles.fullScreenButton}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <Text style={styles.gameOverSubText}>Try Again</Text>
            </View>
          </TouchableOpacity>}
          <TouchableOpacity onPress={() => { this.gameEngine.dispatch({type: "move-left"})} } >
          <Image source={Images.left} style={styles.controlLeft} resizeMode="stretch" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { this.gameEngine.dispatch({type: "move-right"})} } >
          <Image source={Images.right} style={styles.controlRight} resizeMode="stretch" />
          </TouchableOpacity>
        
      </View>
    );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT,
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  controlLeft: {
    position: 'absolute',
    top: Constants.MAX_HEIGHT - 125,
    bottom: Constants.MAX_HEIGHT - 75,
    left: Constants.MAX_WIDTH / 2 - 120,
    right: Constants.MAX_WIDTH / 2 - 70,
    width: 100,
    height: 80,
    //backgroundColor: '#00aaff',
    opacity: 0.5,
  },
  controlRight: {
    position: 'absolute',
    top: Constants.MAX_HEIGHT - 125,
    bottom: Constants.MAX_HEIGHT - 75,
    left: Constants.MAX_WIDTH / 2 + 20,
    right: Constants.MAX_WIDTH / 2 + 70,
    width: 100,
    height: 80,
    //backgroundColor: '#00aaff',
    opacity: 0.5,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    position: 'absolute',
    color: 'white',
    fontSize: 72,
    top: 50,
    left: Constants.MAX_WIDTH / 2 - 30,
    textShadowColor: '#444444',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    fontFamily: 'score_font'
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  gameOverText: {
    color: 'white',
    fontSize: 48,
    fontFamily: 'score_font'
  },
  gameOverSubText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'score_font'
  }

});
