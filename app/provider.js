import  axios from "axios";

const provider = {
  async getLocals(){
    let response = await axios.get('api/locals');
    return response.data;
  },
  async getFile(name){
    let response = await axios.get(`api/file/${name}`);
    return response.data;
  },
  async upload(data){
    let response = await axios.post(`api/upload`, data);
    return response.data;
  }
};


export {provider}
