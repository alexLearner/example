// imports from vendors
import React, { PropTypes as toBe } from 'react';

// imports from styles

class App extends React.Component {

  render() {
    return React.Children.only(this.props.children);
  }

}

export default App;
