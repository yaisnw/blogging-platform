import React from 'react';


type AppHeadingTwoProps = React.HTMLProps<HTMLHeadingElement>;

const AppHeadingTwo: React.FC<AppHeadingTwoProps> = ({ children, ...props}) => {
    return <h2 {...props}>{children}</h2>
};

export default AppHeadingTwo;