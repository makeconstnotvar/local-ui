import {action, observable} from "mobx";
import {provider} from "./provider";
import _ from "underscore";
import {detectMode} from "./detect";



class Store {
  @observable locals = [];
  @observable file = {};
  @observable currentFileName = '';

  @action
  async getLocals() {
    const locals = await provider.getLocals();
    this.locals = locals;
  }

  @action
  async getFile(name) {
    const response = await provider.getFile(name);
    let file = Object.keys(response).reduce((fields, fieldKey) => {
      let field = response[fieldKey];
      fields[fieldKey] = Object.keys(field).reduce((langs, langKey) => {
        let value = field[langKey];
        langs[langKey] = {
          field: fieldKey,
          language: langKey,
          mode: detectMode(value),
          value
        };
        return langs;
      }, {});
      return fields;
    }, {});
    this.file = file;
  }

  @action
  async upload(files) {
    let formData = new FormData();
    formData.append("csv", files[0]);
    await provider.upload(formData);
    console.log(2)
  }

  @action
  setSelectedLocal() {
    this.locals = this.locals.map(local => {
      local.selected = local.name === this.currentFileName;
      return local;
    });
  }

  @action
  setCurrentFileName(name) {
    this.currentFileName = name;
  }
}

export {Store};
