import React, { Component } from "react";
import "./App.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Login from "./components/login";
import Register from "./components/register";
import LogOut from "./components/logout";
import MainPage from "./components/MainPage";
import Room from "./components/room";
import http from "./services/httpService";
class App extends Component {
  state = {};
  async componentDidMount() {
    try {
      const jwt = localStorage.getItem("token");
      const user_jwt = jwtDecode(jwt);
      const user = await http.get(`http://localhost:4000/users/${user_jwt._id}`);
      this.setState({ user: user.data });
      console.log(user.data);
    } catch (ex) {}
  }
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/room" component={Room}></Route>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/logout" component={LogOut} />
          <Route path="/" component={MainPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
