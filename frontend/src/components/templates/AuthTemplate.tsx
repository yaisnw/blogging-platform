import React from "react";

type AuthTemplateProps = {
  children: React.ReactNode;
};

const AuthTemplate: React.FC<AuthTemplateProps> = ({children}) => {
    return (
        <div>
            <div>
                {children}
            </div>
        </div>
    )
}

export default AuthTemplate;