import React,{Component} from "react";
import {inject, observer} from "mobx-react";

@inject("store")
@observer
class Header extends Component {

  render() {
    return <header className="flex-row header">
      <div className="brand">Система локализации</div>
      <div className="flex-grow">
        <a className="btn" target="_blank" href="/api/csv/empty.csv">Без перевода</a>
        <input type="file" className="btn" onChange={(e) => this.props.store.upload(e.target.files)}/>
      </div>
    </header>
  }
};

export {Header}
