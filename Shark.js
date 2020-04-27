import React, { Component } from 'react';
import { Image } from 'react-native';
import Images from './assets/Images';

export default class Shark extends Component {
 
  render() {
    const width = 80;
    const height = 80;
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;

    let image = Images['shark'];

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