import { useEffect, useState } from "react";
import "../../styles/lexicalImage.css"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { $isImageNode, } from "@/lexicalCustom/ImageNode";



export default function LexicalImage({
  src,
  altText,
  nodeKey,
  alignment
}: {
  src: string;
  altText: string;
  nodeKey: string;
  alignment: 'left' | 'center' | 'right'
}) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setIsSelected] = useState(false);
  const [width, setWidth] = useState(300);
  const [currentAlignment, setCurrentAlignment] = useState(alignment);

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

  const handleDelete = (e: React.MouseEvent) => {
    console.log('clicked')
    e.preventDefault();
    e.stopPropagation();
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) node.remove();
    });
  };

  const handleAlignmentChange = (newAlignment: 'left' | 'center' | 'right') => {
    setCurrentAlignment(newAlignment);
    console.log('apply alignment', newAlignment);
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
      onClick={() => setIsSelected(s => !s)}
    >
      <div
        className={`image-wrapper ${isSelected ? ' selected' : ''}`} 
        style={{ width }}
      >
        <img src={src} alt={altText} className="lexical-image" />
        {isSelected && (
          <div >
            <div className="delete-handle" onClick={handleDelete}>X</div>
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
              ↔
            </div>
            <div className="alignment-buttons">
              <button onClick={() => handleAlignmentChange('left')}>left</button>
              <button onClick={() => handleAlignmentChange('center')}>center</button>
              <button onClick={() => handleAlignmentChange('right')}>right</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

