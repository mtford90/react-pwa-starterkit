/* @flow */

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux'
import Button from '../components/Button'

@connect(
  state => {
    return {}
  },
  dispatch => {
    return {}
  }
)
export default class Home extends Component {
  render () {
    return (
      <div style={{backgroundColor: 'white'}}>
        sdfsdf!

        <Button
          visited={true}
          onClick={() => {
            console.log('yo!')
          }}
        >
          {"Click Me!"}
        </Button>
      </div>
    )
  }
}