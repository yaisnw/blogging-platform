type PlusSVGProps = React.SVGProps<SVGSVGElement>;

const PlusSVG: React.FC<PlusSVGProps> = ({ ...props }) => {
    return (
        <svg {...props} width="35px" height="35px" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M16,30 C8.268,30 2,23.73 2,16 C2,8.27 8.268,2 16,2 C23.732,2 30,8.27 30,16 C30,23.73 23.732,30 16,30 L16,30 Z M16,0 C7.163,0 0,7.16 0,16 C0,24.84 7.163,32 16,32 C24.837,32 32,24.84 32,16 C32,7.16 24.837,0 16,0 L16,0 Z M22,15 L17,15 L17,10 C17,9.45 16.553,9 16,9 C15.447,9 15,9.45 15,10 L15,15 L10,15 C9.447,15 9,15.45 9,16 C9,16.55 9.447,17 10,17 L15,17 L15,22 C15,22.55 15.447,23 16,23 C16.553,23 17,22.55 17,22 L17,17 L22,17 C22.553,17 23,16.55 23,16 C23,15.45 22.553,15 22,15 L22,15 Z" 
                fill="currentColor" 
            />
        </svg>
    );
};

export default PlusSVG;