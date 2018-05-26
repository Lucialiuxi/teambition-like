//路由信息
import React, { Component } from 'react';
import { routes } from './router.js'
import { Route } from 'react-router-dom';

class LoginOrProject extends Component {
    constructor(props) {
      super(props);
      this.state = {  }
    }
    render() {
      return ( 
        <div className="LoginOrProject">
          {
            routes.map((item) => {
              return (
                  <Route key={item.path}
                    exact
                    path={item.path}
                    component={item.component}
                    dispatch={this.props.dispatch}
                  ></Route>
              )
            })
          }
        </div>
      )
    }
  }
   
  export default LoginOrProject;