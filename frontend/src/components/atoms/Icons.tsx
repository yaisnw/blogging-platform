import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const BoldSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M2 1H8.625C11.0412 1 13 2.95875 13 5.375C13 6.08661 12.8301 6.75853 12.5287 7.35243C13.4313 8.15386 14 9.32301 14 10.625C14 13.0412 12.0412 15 9.625 15H2V1ZM5.5 9.75V11.5H9.625C10.1082 11.5 10.5 11.1082 10.5 10.625C10.5 10.1418 10.1082 9.75 9.625 9.75H5.5ZM5.5 6.25H8.625C9.10825 6.25 9.5 5.85825 9.5 5.375C9.5 4.89175 9.10825 4.5 8.625 4.5H5.5V6.25Z" />
    </svg>
);

export const ItalicSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
        <path d="M14 1H5V4H7.75219L5.08553 12H2V15H11V12H8.24781L10.9145 4H14V1Z" />
    </svg>
);

export const UnderlineSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3 1V7C3 9.76142 5.23858 12 8 12C10.7614 12 13 9.76142 13 7V1H10V7C10 8.10457 9.10457 9 8 9C6.89543 9 6 8.10457 6 7V1H3Z" />
        <path d="M14 16V14H2V16H14Z" />
    </svg>
);

export const StrikeSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(-2 -2)">
            <path d="M18 7.5A4.49 4.49 0 0 0 13.5 3H10.07A4.07 4.07 0 0 0 6 7.07H6a4.08 4.08 0 0 0 2.78 3.86l6.44 2.14A4.08 4.08 0 0 1 18 16.93h0A4.07 4.07 0 0 1 13.93 21H10.5A4.49 4.49 0 0 1 6 16.5" />
            <line x2="18" transform="translate(3 12)" />
        </g>
    </svg>
);

export const AlignLeftSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 3h20v1H2zm0 7h12V9H2zm0 6h20v-1H2zm0 6h12v-1H2z" fillRule="evenodd" />
    </svg>
);

export const AlignCenterSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 3h20v1H2zm4 7h12V9H6zm-4 6h20v-1H2zm4 6h12v-1H6z" fillRule="evenodd" />
    </svg>
);

export const AlignRightSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 3h20v1H2zm8 7h12V9H10zm-8 6h20v-1H2zm8 6h12v-1H10z" fillRule="evenodd" />
    </svg>
);

export const AlignJustifySVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M2 3h20v1H2zm0 6h20V9H2zm0 6h20v-1H2zm0 6h20v-1H2z" />
    </svg>
);

export const H1SVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 5h4V2a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V7H3v3a1 1 0 1 1-2 0V2a1 1 0 1 1 2 0v3zm9.52.779H11V4h3.36v7h-1.84V5.779z" />
    </svg>
);

export const H2SVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 5h4V2a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V7H3v3a1 1 0 1 1-2 0V2a1 1 0 1 1 2 0v3zm12.88 4.352V11H11V9.986l.1-.246 1.785-1.913c.43-.435.793-.77.923-1.011.124-.23.182-.427.182-.587 0-.14-.04-.242-.127-.327a.469.469 0 0 0-.351-.127.443.443 0 0 0-.355.158c-.105.117-.165.288-.173.525l-.012.338h-1.824l.016-.366c.034-.735.272-1.33.718-1.77.446-.44 1.02-.66 1.703-.66.424 0 .805.091 1.14.275.336.186.606.455.806.8.198.343.3.7.3 1.063 0 .416-.23.849-.456 1.307-.222.45-.534.876-1.064 1.555l-.116.123-.254.229h1.938z" />
    </svg>
);

export const H3SVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 5h4V2a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V7H3v3a1 1 0 1 1-2 0V2a1 1 0 1 1 2 0v3zm12.453 2.513l.043.055c.254.334.38.728.38 1.172 0 .637-.239 1.187-.707 1.628-.466.439-1.06.658-1.763.658-.671 0-1.235-.209-1.671-.627-.436-.418-.673-.983-.713-1.676L11 8.353h1.803l.047.295c.038.238.112.397.215.49.1.091.23.137.402.137a.566.566 0 0 0 .422-.159.5.5 0 0 0 .158-.38c0-.163-.067-.295-.224-.419-.17-.134-.438-.21-.815-.215l-.345-.004v-1.17l.345-.004c.377-.004.646-.08.815-.215.157-.124.224-.255.224-.418a.5.5 0 0 0-.158-.381.566.566 0 0 0-.422-.159.568.568 0 0 0-.402.138c-.103.092-.177.251-.215.489l-.047.295H11l.022-.37c.04-.693.277-1.258.713-1.675.436-.419 1-.628 1.67-.628.704 0 1.298.22 1.764.658.468.441.708.991.708 1.629a1.892 1.892 0 0 1-.424 1.226z" />
    </svg>
);

export const ParagraphSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 4H9c-2.209 0-4 1.791-4 4s1.791 4 4 4h3m0-8v14m4-14v14" />
    </svg>
);

export const QuoteSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.017 21L14.017 18C14.017 14.686 16.703 12 20.017 12L20.017 11C20.017 6.029 16.014 2 11.017 2C6.019 2 2.017 6.029 2.017 11C2.017 15.971 6.019 20 11.017 20L11.017 21H14.017ZM11.017 18C7.151 18 4.017 14.866 4.017 11C4.017 7.134 7.151 4 11.017 4C14.883 4 18.017 7.134 18.017 11C18.017 11.276 18.001 11.548 17.97 11.817C16.204 12.449 14.615 13.564 13.383 15.021C12.503 16.061 12.017 17.004 12.017 18H11.017Z" opacity="0" />
        <path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z" />
    </svg>
);

export const TrashSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12l4 4m0-4l-4 4M18 6l-.8 12c-.1 1.1-.1 1.6-.3 2-.2.4-.5.7-.9 1-.4.2-.9.2-2 .2H10c-1.1 0-1.6 0-2-.2-.4-.2-.7-.5-.9-1-.2-.4-.2-.9-.3-2L6 6M4 6h16M16 6l-.3-.8c-.3-.8-.4-1.2-.7-1.5-.2-.3-.5-.5-.8-.6-.3-.1-.7-.1-1.5-.1h-1.4c-.8 0-1.2 0-1.5.1-.3.1-.6.3-.8.6-.3.3-.4.7-.7 1.5L8 6" /></svg>
);

export const ViewSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z" /></svg>
);

export const PlusSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 32 32" fill="currentColor"><path d="M16 30C8.268 30 2 23.73 2 16 2 8.27 8.268 2 16 2s14 6.27 14 14-6.268 14-14 14zm0-30C7.163 0 0 7.16 0 16s7.163 16 16 16 16-7.16 16-16S24.837 0 16 0zm6 15h-5V10c0-.55-.447-1-1-1s-1 .45-1 1v5h-5c-.553 0-1 .45-1 1s.447 1 1 1h5v5c0 .55.447 1 1 1s1-.45 1-1v-5h5c.553 0 1-.45 1-1s-.447-1-1-1z" /></svg>
);

export const EditSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 21 21" fill="currentColor"><path d="M0 19.5h20.66v-1.96H0v1.96zm7.23-6.86v-2.63l8.85-7.87 1.89 2L9.88 12.64H7.23zM21 4.14l-4.86-4.64L5.16 9.18v5.42h5.6L21 4.14z" /></svg>
);

export const LeftArrowSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 512 512" fill="currentColor"><polygon points="513,216.6 158.5,216.6 316.1,59.1 197.9,59.1 1,256 197.9,452.9 316.1,452.9 158.5,295.4 513,295.4 " /></svg>
);

export const RightArrowSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 512 512" fill="currentColor"><polygon points="315.1,48.6 196.9,48.6 354.5,206.1 0,206.1 0,284.9 354.5,284.9 196.9,442.4 315.1,442.4 512,245.5 " /></svg>
);

export const CenterArrowSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M 3 1 L 3 2 L 17 2 L 17 1 L 3 1 z M 6 5 L 6 6 L 14 6 L 14 5 L 6 5 z M 1 9 L 1 10 L 19 10 L 19 9 L 1 9 z M 5 14 L 7 16 L 0 16 L 0 17 L 7 17 L 5 19 L 6.5 19 L 9 16.5 L 6.5 14 L 5 14 z M 13.5 14 L 11 16.5 L 13.5 19 L 15 19 L 13 17 L 20 17 L 20 16 L 13 16 L 15 14 L 13.5 14 z" /></svg>
);

export const CrossSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 32 32" fill="currentColor"><path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z" /></svg>
);

export const ResizeSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="32px" strokeLinecap="round" strokeLinejoin="round"><polyline points="304 96 416 96 416 208" /><line x1="405.77" y1="106.2" x2="111.98" y2="400.02" /><polyline points="208 416 96 416 96 304" /></svg>
);

export const CommentSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 2C8.268 2 2 7.373 2 14c0 2.766 1.085 5.313 2.922 7.31L3 27l6.315-1.922C11.313 25.754 13.585 26 16 26c7.732 0 14-5.373 14-12S23.732 2 16 2z" fill="currentColor" /></svg>
);

export const GithubSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10c0-5.523-4.477-10-10-10z" /></svg>
);

export const GoogleSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /><path fill="none" d="M0 0h48v48H0z" /></svg>
);

export const LinkedInSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zM.02 21h4.96V7H.02v14zm17.11-14c-2.47 0-4.19 1.356-4.83 2.56V7H7.44v14h4.96v-7.84c0-2.1 1.05-3.41 2.87-3.41 1.71 0 2.54 1.16 2.54 3.01V21H22.77v-8.49c0-4.11-2.22-5.51-5.64-5.51z" fill="currentColor" /></svg>
);

export const SearchSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 1920 1920" role="img" aria-hidden="true">
        <path fill="currentColor" fillRule="evenodd" d="M1458.948 1305.626c104.637-136.95 167.527-307.187 167.527-492.388C1626.475 364.764 1261.711 0 813.238 0 364.764 0 0 364.764 0 813.238c0 448.473 364.764 813.237 813.238 813.237 185.201 0 355.547-62.89 492.496-167.527L1766.678 1920 1920 1766.678l-461.052-461.052Zm-645.71 103.986c-328.874 0-596.375-267.61-596.375-596.374 0-328.765 267.501-596.375 596.375-596.375 328.873 0 596.374 267.61 596.374 596.375s-267.501 596.374-596.374 596.374Z" />
    </svg>
);
export const ImageSVG: React.FC<IconProps> = (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M1 1H15V15H1V1ZM6 9L8 11L13 6V13H3V12L6 9ZM6.5 7C7.32843 7 8 6.32843 8 5.5C8 4.67157 7.32843 4 6.5 4C5.67157 4 5 4.67157 5 5.5C5 6.32843 5.67157 7 6.5 7Z" 
            fill="currentColor"
        />
    </svg>
);
export interface HeartSVGProps extends IconProps {
    liked: boolean;
    editable?: boolean;
    OnLike?: () => void;
}

export const HeartSVG: React.FC<HeartSVGProps> = ({ liked, editable, OnLike, ...p }) => (
    <svg
        {...p}
        viewBox="0 0 64 64"
        onClick={editable ? OnLike : undefined}
        style={{
            cursor: editable ? 'pointer' : 'default',
            ...p.style
        }}
    >
        <path
            d="M58.714,29.977c0,0-0.612,0.75-1.823,1.961S33.414,55.414,33.414,55.414C33.023,55.805,32.512,56,32,56 s-1.023-0.195-1.414-0.586c0,0-22.266-22.266-23.477-23.477s-1.823-1.961-1.823-1.961C3.245,27.545,2,24.424,2,21 C2,13.268,8.268,7,16,7c3.866,0,7.366,1.566,9.899,4.101l4.678,4.677c0.781,0.781,2.047,0.781,2.828,0l4.678-4.677 C40.634,8.566,44.134,7,48,7c7.732,0,14,6.268,14,14C62,24.424,60.755,27.545,58.714,29.977z"
            stroke="currentColor"
            fill={liked ? "#F76D57" : "none"}
            strokeWidth="2"
        />
    </svg>
);