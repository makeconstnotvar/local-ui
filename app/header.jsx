import React,{Component} from "react";
import {inject, observer} from "mobx-react";

@inject("store")
@observer
class Header extends Component {

  render() {
    return <header className="header">
      <div className="header-brand">Система локализации</div>
      <div className="header-list">
        <div className="header-item">
          <a className="btn" target="_blank" href="/api/csv/empty.csv">Без перевода</a>
        </div>
        <div className="header-item">
          <input type="file" className="btn" onChange={(e) => this.props.store.upload(e.target.files)}/>
        </div>
      </div>
    </header>
  }
};

export {Header}
