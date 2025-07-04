import React from 'react';


type AppHeaderProps = React.HTMLProps<HTMLHeadingElement>;

const AppHeader: React.FC<AppHeaderProps> = ({ children, ...props}) => {
    return <h1 {...props}>{children}</h1>
};

export default AppHeader;