import Login from './Compoment/Login_Registor/Login';
import Home from './Compoment/Home/Home';
import Navbar from './Compoment/Home/Navbar'
import ApiDocument from './Compoment/Api';
import Poster from './Compoment/Post/Post';
import Author from './Compoment/Author/Author';
import HomePost from './Compoment/Info_post/Info_post';
import React from 'react'
import './asset/css/bootstrap.min.css';
import './App.css'
import User from './Compoment/User/User'


import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact={true} path="/login" render={() => <Login status_login={false}></Login>}></Route>
        <Route exact={true} path="/register" render={() => <Login status_login={true}></Login>}></Route>

        <Route exact>
          <Navbar>
            <Route path='/' exact >
              <Home />
            </Route>
            <Route path='/view' exact render={() => <p>thong tin the view</p>} exact />
            <Route path='/post' exact component={Poster} exact />
            <Route path='/author/:author_id' component={Author}></Route>
            <Route path='/home/:post_id' component={HomePost}></Route>
            <Route path='/user/:user_id' component={User}></Route>
          </Navbar>
        </Route>
        <Route exact path="/document">
          <ApiDocument />
        </Route>
        <Route paht='*' render={() => <p>404 not found</p>} />
      </Switch>
    </Router >

  );
}


export default App;