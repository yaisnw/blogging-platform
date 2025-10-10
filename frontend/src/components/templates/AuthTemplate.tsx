import React from "react";

type AuthTemplateProps = {
    children: React.ReactNode;
};

const AuthTemplate: React.FC<AuthTemplateProps> = ({ children, ...props }) => {
    return (
        <main {...props}>
            <section>{children}</section>
        </main>
    );
};

export default AuthTemplate;
