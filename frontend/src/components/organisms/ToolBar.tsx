import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getSelection, $isParagraphNode, $isRangeSelection, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from 'lexical';
import { mergeRegister } from "@lexical/utils"
import { useCallback, useEffect, useState } from 'react';
import { $setBlocksType } from '@lexical/selection'
import "../../styles/editor.css"
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';

function Divider() {
    return <div className="divider" />;
}

function ToolBar({ ...props }) {
    const [editor] = useLexicalComposerContext();
    const [activeBlockType, setActiveBlockType] = useState('paragraph');
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes();
            let blockType;
            for (const node of nodes) {
                const parent = node.getTopLevelElementOrThrow();
                if ($isHeadingNode(parent)) {
                    blockType = parent.getTag();
                } else if ($isParagraphNode(parent)) {
                    blockType = 'paragraph';
                }
                setActiveBlockType(blockType ?? 'paragraph');
                break;
            }
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
        }
        else {
            setIsBold(false);
            setIsItalic(false);
            setIsUnderline(false);
            setIsStrikethrough(false);
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    $updateToolbar();
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [$updateToolbar, editor]);



    const applyFormat = (formatType: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
        editor.focus();
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
    };
    const applyAlign = (alignType: 'left' | 'center' | 'right' | 'justify') => {
        editor.focus();
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignType)
    }
    const applyUndoRedo = (command: 'undo' | 'redo') => {
        editor.focus();
        if (command === 'undo') {
            editor.dispatchCommand(UNDO_COMMAND, undefined)
        }
        else if (command === 'redo') {
            editor.dispatchCommand(REDO_COMMAND, undefined)
        }
    }
    const applyBlockType = (blockType: 'h1' | 'h2' | 'h3' | 'paragraph') => {
        editor.focus();
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                if (blockType === 'paragraph') {
                    $setBlocksType(selection, () => $createParagraphNode())
                }
                else {
                    $setBlocksType(selection, () => $createHeadingNode(blockType))
                }
            }
        })
    }

    return (
        <div {...props}>
            <button className={`toolbar-button ${isBold ? 'active' : ''}`} onClick={() => applyFormat('bold')}>
                Bold
            </button>
            <button className={`toolbar-button ${isItalic ? 'active' : ''}`} onClick={() => applyFormat('italic')}>
                Italic
            </button>
            <button className={`toolbar-button ${isUnderline ? 'active' : ''}`} onClick={() => applyFormat('underline')}>
                Underline
            </button>
            <button className={`toolbar-button ${isStrikethrough ? 'active' : ''}`} onClick={() => applyFormat('strikethrough')}>
                Strikethrough
            </button>

            <Divider />
            <button className={'toolbar-button'} onClick={() => applyAlign('left')}>left</button>
            <button className={'toolbar-button'} onClick={() => applyAlign('center')}>center</button>
            <button className={'toolbar-button'} onClick={() => applyAlign('right')}>right</button>
            <button className={'toolbar-button'} onClick={() => applyAlign('justify')}>justify</button>
            <Divider />
            <button className={'toolbar-button'} disabled={!canUndo} onClick={() => applyUndoRedo('undo')}>undo</button>
            <button className={'toolbar-button'} disabled={!canRedo} onClick={() => applyUndoRedo('redo')} >redo</button>
            <Divider />
            <button className={`toolbar-button ${activeBlockType === 'h1' ? 'active' : ''}`} onClick={() => applyBlockType('h1')}>H1</button>
            <button className={`toolbar-button ${activeBlockType === 'h2' ? 'active' : ''}`} onClick={() => applyBlockType('h2')}>H2</button>
            <button className={`toolbar-button ${activeBlockType === 'h3' ? 'active' : ''}`} onClick={() => applyBlockType('h3')}>H3</button>
            <button className={`toolbar-button ${activeBlockType === 'paragraph' ? 'active' : ''}`} onClick={() => applyBlockType('paragraph')} >Paragraph</button>
        </div>
    );
}
export default ToolBar