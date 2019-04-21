import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {MetaCell} from "app/components/metaCell";
import {MiniList} from "app/components/minilist";
import {RawCell} from "app/components/rawcell";
import {ModeEnum} from "./detect";

@inject("$store")
@observer
class File extends Component {

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.file !== this.props.match.params.file) {
      this.fetch();
    }
  }

  fetch = () => {
    let {match, $store} = this.props;
    $store.getFile(match.params.file);
    $store.setCurrentFileName(match.params.file);
    $store.setSelectedLocal();
  };

  getRow = (lang, data) => {
    let item = data[lang] || {};
    switch (item.mode) {
      case ModeEnum.object:
        return <td className="alert-data"><RawCell {...item}/></td>;
      case ModeEnum.string:
        return <td>{item.value}</td>;
      case ModeEnum.metas:
        return <td><MetaCell {...item}/></td>;
      case ModeEnum.array:
        return <td className="nopd"><MiniList {...item}/></td>;
      default:
        return <td className="no-data">-</td>;
    }
  };


  render() {
    const {file} = this.props.$store;
    return <table className="table-simple">
      <thead>
      <tr>
        <th>key</th>
        <th>ru</th>
        <th>en</th>
        <th>fr</th>
        <th>de</th>
        <th>es</th>
      </tr>
      </thead>
      <tbody>
      {
        Object.keys(file).map((field, i) => (
          <tr key={i}>
            <td className="key-name">{field}</td>
            {this.getRow("ru", file[field])}
            {this.getRow("en", file[field])}
            {this.getRow("fr", file[field])}
            {this.getRow("de", file[field])}
            {this.getRow("es", file[field])}
          </tr>
        ))
      }
      </tbody>
    </table>

  }
}

export {File}
