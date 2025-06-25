
import React from 'react';

type AppLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const AppLabel: React.FC<AppLabelProps> = ({ children, ...props }) => {
  return (
    <label {...props} >
      {children}
    </label>
  );
};

export default AppLabel;
