import React from "react";
import './{{fileName}}.less'

interface Ba{{fileName}}Props {
  children?: React.ReactNode;
}

export const Ba{{fileName}} = (props: Ba{{fileName}}Props) => {
  return (
    <div className="Ba{{fileName}}">
      {props.children}
    </div>
  );
};

Ba{{fileName}}.defaultProps = {};
