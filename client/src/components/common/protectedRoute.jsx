import React from "react";
import { Route, Redirect } from "react-router-dom";

function protectedRoute({ path, component: Component, render, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!localStorage.getItem("token"))
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
}

export default LogOutAdmin;