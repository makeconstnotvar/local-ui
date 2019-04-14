import React ,{Fragment} from "react";

const RawCell = props=> <Fragment>{JSON.stringify(props)}</Fragment>;
export {RawCell}