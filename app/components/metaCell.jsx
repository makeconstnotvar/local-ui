import React, {Fragment} from "react";

const MetaCell = data => <Fragment>
  <div className={data.value.meta && data.value.meta.length ? 'mb6' : null}>
    <b>title: </b>{data.value.title}
  </div>
  {
    data.value.meta &&
    data.value.meta.map((m, i) => <div className="mb6" key={i}><b>{m.name}: </b>{m.content}</div>)
  }
</Fragment>;

export {MetaCell}