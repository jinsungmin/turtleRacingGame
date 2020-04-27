import React, { Component } from 'react';
import { View, Image} from 'react-native';
import Images from './assets/Images';

export default class Turtle extends Component {
  constructor(props) {
    super(props);    
  }

  render() {
    const width = 70;
    const height = 70;
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;

    let image = Images['turtle'];

    return (
      <Image
        style={{
          position: 'absolute',
          top: y,
          left: x,
          width: width,
          height: height,
        }}
        resizeMode="stretch"
        source={image} />
  
    )
  }
}