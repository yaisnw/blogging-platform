import { useEffect, useState } from "react";
import "../../styles/lexicalImage.css"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { $isImageNode, } from "@/lexicalCustom/ImageNode";
import { useDeleteImageMutation } from "@/services/picturesApi";
import LeftArrow from "./LeftArrow";
import CenterArrow from "./CenterArrow";
import RightArrow from "./RightArrow";
import CrossButton from "./CrossButton";
import ResizeButton from "./ResizeButton";
import AppLoader from "./AppLoader";


export default function LexicalImage({
  src,
  altText,
  nodeKey,
  alignment,
}: {
  src: string;
  altText: string;
  nodeKey: string;
  alignment: 'left' | 'center' | 'right';
}) {
  const [editor] = useLexicalComposerContext();
  const readOnly = !editor.isEditable();
  const [isSelected, setIsSelected] = useState(false);
  const [width, setWidth] = useState(300);
  const [currentAlignment, setCurrentAlignment] = useState(alignment);
  const [deleteImage] = useDeleteImageMutation();

  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          setCurrentAlignment(node.__alignment);
        }
      });
    });
  }, [editor, nodeKey]);
  useEffect(() => {
    setIsLoaded(false); 
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true); 
    img.src = src;

    if (img.complete) {
        setIsLoaded(true);
    }
  }, [src]);
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) node.remove();
    });

    await deleteImage(src)
  };

  const handleAlignmentChange = (newAlignment: 'left' | 'center' | 'right') => {
    setCurrentAlignment(newAlignment);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setAlignment(newAlignment);
      }
    });
  };

  return (
    <div
      contentEditable={false}
      className={`lexical-image-container align-${currentAlignment}`}
    >
      <div
        className={`image-wrapper ${isSelected ? ' selected' : ''}`}
        style={{ width }} onClick={() => readOnly ? undefined : setIsSelected(s => !s)}
      >
        {!isLoaded && (
          <div
            className="lexical-image-skeleton"
          >
            <AppLoader mode="normal" /> 
          </div>
        )}
        <img onLoad={handleImageLoad} loading="lazy" src={src} alt={altText} className="lexical-image" style={{
          display: isLoaded ? 'block' : 'none',
        }} />
        {isSelected && (
          <div >
            <div className="delete-handle" onClick={handleDelete}><CrossButton /></div>
            <div
              className="resize-handle"
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startWidth = width;

                const onMouseMove = (e: MouseEvent) => {
                  const deltaX = e.clientX - startX;
                  setWidth(Math.min(550, Math.max(100, startWidth + deltaX)));
                };

                const onMouseUp = () => {
                  window.removeEventListener("mousemove", onMouseMove);
                  window.removeEventListener("mouseup", onMouseUp);
                };

                window.addEventListener("mousemove", onMouseMove);
                window.addEventListener("mouseup", onMouseUp);
              }}
            >
              <ResizeButton />
            </div>
            <div className="alignment-buttons">
              <button onClick={() => handleAlignmentChange('left')}><LeftArrow /></button>
              <button onClick={() => handleAlignmentChange('center')}><CenterArrow /></button>
              <button onClick={() => handleAlignmentChange('right')}><RightArrow /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

