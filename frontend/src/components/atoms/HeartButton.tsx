import styles from '@/styles/ui.module.css'

type HeartButtonProps = {
    editable?: boolean,
    liked: boolean,
    OnLike?: () => void
}

const HeartButton: React.FC<HeartButtonProps> = ({ editable, liked, OnLike }) => {



    return (
        <svg
            onClick={editable ? OnLike : undefined}
            className={editable ? styles.heartButton : ''}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 64 64"
            width="32"
            height="32"
        >
            <path
                d="M58.714,29.977c0,0-0.612,0.75-1.823,1.961S33.414,55.414,33.414,55.414C33.023,55.805,32.512,56,32,56 
             s-1.023-0.195-1.414-0.586c0,0-22.266-22.266-23.477-23.477s-1.823-1.961-1.823-1.961C3.245,27.545,2,24.424,2,21 
             C2,13.268,8.268,7,16,7c3.866,0,7.366,1.566,9.899,4.101l4.678,4.677c0.781,0.781,2.047,0.781,2.828,0l4.678-4.677 
             C40.634,8.566,44.134,7,48,7c7.732,0,14,6.268,14,14C62,24.424,60.755,27.545,58.714,29.977z"
                fill={liked ? "#F76D57" : "none"}
                stroke="#000000ff"
                strokeWidth="2"
            />
        </svg>
    );
}
export default HeartButton