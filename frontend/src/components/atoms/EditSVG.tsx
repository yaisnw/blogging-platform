type EditSVGProps = React.SVGProps<SVGSVGElement>;

const EditSVG: React.FC<EditSVGProps> = ({ ...props }) => {
    return (
        <svg {...props} width="35px" height="35px" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M0,20 L20.66,20 L20.66,18.04 L0,18.04 L0,20 Z M7.23,13.14 L7.23,10.51 L16.08,2.64 L17.97,4.64 L9.88,13.14 L7.23,13.14 Z M21,4.64 L16.14,0 L5.16,9.68 L5.16,15.1 L10.76,15.1 L21,4.64 Z" 
                transform="translate(0, -0.5)"
                fill="currentColor" 
            />
        </svg>
    );
};

export default EditSVG;