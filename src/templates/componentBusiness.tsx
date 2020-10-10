import React from "react";
import './{{fileName}}.less'

interface Bu{{fileName}}Props {
  children?: React.ReactNode;
}

export const Bu{{fileName}} = (props: Bu{{fileName}}Props) => {
  return (
    <div className="Bu{{fileName}}">
      {props.children}
    </div>
  );
};

Bu{{fileName}}.defaultProps = {};
