import React, {Fragment} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route} from "react-router-dom";
import {Header} from "app/header";
import {Menu} from "app/menu";
import {File} from "app/file";
import {Provider} from "mobx-react";
import {Store} from "app/store";

const store = new Store();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Fragment>
        <Header/>
        <div className="wrap">
          <div className="left">
            <Route path="/" component={Menu}/>
          </div>
          <div className="right">
            <Route path="/:file" component={File}/>
          </div>
        </div>
      </Fragment>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root"));
