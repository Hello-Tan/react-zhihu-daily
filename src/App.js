import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps} from './store/mapProps';
import { Router, Route } from 'react-router'
import Homepage from './components/homepage/homepage.jsx';

const HomePage = connect(
    mapStateToProps,
    mapDispatchToProps
)(Homepage)

class App  extends Component{

    render() {
        return (
          <div>
              <HomePage></HomePage>
          </div>
        );
     }
}

export default App;
