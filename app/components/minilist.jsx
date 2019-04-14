import React from "react";
import {MiniCell} from "./minicell";

const MiniList = data => <ul className="mini-list mb6">
  {
    data.map((item, i) => <li className="mb6" key={i}>
      {(typeof item === 'string') ? item : <MiniCell {...item} />}
    </li>)
  }
</ul>;

export {MiniList}