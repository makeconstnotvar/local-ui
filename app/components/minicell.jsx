import React, {Fragment} from "react";

const MiniCell = props => <Fragment>
  {
    Object.keys(props).map((key, i) => <div className="mb3" key={i}>
      <b>{key}: </b>
      <span>{props[key]}</span>
    </div>)
  }
</Fragment>;


export {MiniCell}