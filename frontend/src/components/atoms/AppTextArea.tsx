import React from 'react';

type AppTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const AppTextArea: React.FC<AppTextAreaProps> = ({ ...props}) => {
    return (
        <textarea {...props}/>
    )
}

export default AppTextArea;