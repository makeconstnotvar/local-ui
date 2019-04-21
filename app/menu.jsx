import React, {Component, Fragment} from "react";
import {inject, observer} from "mobx-react";

@inject("$store")
@observer
class Menu extends Component {

  componentDidMount() {
    let {$store} = this.props;
    $store.getLocals().then(() => {
      $store.setSelectedLocal()
    });
  }

  navigate = name => {
    this.props.history.push(name)
  };

  render() {
    const {locals} = this.props.$store;
    return <Fragment>
      {
        locals.map((local, i) => <div key={i} className={`menu ${local.selected ? ' active' : ''}`} onClick={() => this.navigate(local.name)}>
            {local.name}
          </div>
        )
      }
    </Fragment>
  }
}

export {Menu}
