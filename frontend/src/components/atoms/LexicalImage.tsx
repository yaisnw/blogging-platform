import { useEffect, useState } from "react";
import "../../styles/lexicalImage.css"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { $isImageNode } from "@/lexicalCustom/ImageNode";
import { useDeleteImageMutation } from "@/services/picturesApi";
import LeftArrow from "./LeftArrow";
import CenterArrow from "./CenterArrow";
import RightArrow from "./RightArrow";
import CrossButton from "./CrossButton";
import ResizeButton from "./ResizeButton";
import AppLoader from "./AppLoader";
import { useUpdatePostMutation } from "@/services/postsApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export default function LexicalImage({
  src,
  altText,
  nodeKey,
  alignment,
  width: nodeWidth,
}: {
  src: string;
  altText: string;
  nodeKey: string;
  alignment: 'left' | 'center' | 'right';
  width: number | undefined;
}) {

  const [updatePost] = useUpdatePostMutation();
  const postId = useSelector((state: RootState) => state.ui.postId);
  const [editor] = useLexicalComposerContext();
  const readOnly = !editor.isEditable();
  const [isSelected, setIsSelected] = useState(false);
  const [width, setWidth] = useState(nodeWidth || 300);
  const [currentAlignment, setCurrentAlignment] = useState(alignment);
  const [deleteImage] = useDeleteImageMutation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (nodeWidth !== undefined && nodeWidth !== width) {
      setWidth(nodeWidth);
    }
  }, [nodeWidth]);//eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          setCurrentAlignment(node.getAlignment());
          const savedWidth = node.getWidth();
          if (savedWidth && savedWidth !== width) {
            setWidth(savedWidth);
          }
        }
      });
    });
  }, [editor, nodeKey, width]);

  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);

    const img = new Image();
    img.src = src;

    const handleLoad = () => {
      if (isMounted) setIsLoaded(true);
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.onload = handleLoad;
      img.onerror = handleLoad;
    }

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  const imageStyle = {
    width: `${width}px`,
    maxWidth: '100%',
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

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

  const handleResizeStart = (clientX: number) => {
    const startX = clientX;
    const startWidth = width;
    let finalWidth = startWidth;

    const onMove = (currentClientX: number) => {
  const deltaX = currentClientX - startX;
  
  const maxWidth = Math.min(800, window.innerWidth - 32); 

  const minWidth = 300; 
  
  // 3. Apply the constraints
  finalWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + deltaX));
  
  setWidth(finalWidth);
};

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX);

    const onStop = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onStop);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onStop);

      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.setWidth(finalWidth);
        }
      }, {
        onUpdate: () => {
          const currentContent = JSON.stringify(editor.getEditorState().toJSON());
          updatePost({
            postId: postId as number,
            content: currentContent,
          });
        }
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onStop);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onStop);
  };
  return (
    <div
      contentEditable={false}
      className={`lexical-image-container align-${currentAlignment}`}
    >
      <div
        className={`image-wrapper ${isSelected ? ' selected' : ''}`}
        style={imageStyle} onClick={() => readOnly ? undefined : setIsSelected(s => !s)}
      >
        {!isLoaded && (
          <div
            className="lexical-image-skeleton"
          >
            <AppLoader mode="normal" />
          </div>
        )}
        <img onLoad={handleImageLoad} src={src} alt={altText} className="lexical-image" style={{
          display: isLoaded ? 'block' : 'none',
          width: '100%',
          height: 'auto',
          objectFit: 'contain'
        }} />
        {isSelected && (
          <div >
            <div className="delete-handle" onClick={handleDelete}><CrossButton /></div>
            <div
              className="resize-handle"
              onMouseDown={(e) => handleResizeStart(e.clientX)}
              onTouchStart={(e) => handleResizeStart(e.touches[0].clientX)}
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