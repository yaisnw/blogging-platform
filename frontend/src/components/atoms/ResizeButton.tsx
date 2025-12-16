const ResizeButton = () => {
    const color = "var(--color-text)";
    return (
       <svg
            width="20px"
            height="20px"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>Resize Icon</title>
            
            <polyline
                points="304 96 416 96 416 208"
                fill="none" 
                stroke={color} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="32px" 
            />
            
            <line
                x1="405.77"
                y1="106.2"
                x2="111.98"
                y2="400.02"
                fill="none"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
            />
            
            <polyline
                points="208 416 96 416 96 304"
                fill="none"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
            />
        </svg>
    )
}
export default ResizeButton;