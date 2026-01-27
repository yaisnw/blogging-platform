import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getSelection, $isParagraphNode, $isRangeSelection, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from 'lexical';
import { mergeRegister } from "@lexical/utils"
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { $setBlocksType } from '@lexical/selection'
import "../../styles/editor.css"
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import ImageInsertButton from '../atoms/ImageInsertButton';
import AppButton from '../atoms/AppButton';
import AppLink from '../atoms/AppLink';

const DropDown = ({ label, children, active }: { label: string; children: ReactNode; active?: boolean }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="dropdown-container" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button className={`dropdown-button ${active ? 'active' : ''}`}>
                {label} <span className="chevron">▼</span>
            </button>
            {open && <div className="dropdown-menu">{children}</div>}
        </div>
    );
};

function ToolBar() {
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
                } else if ($isQuoteNode(parent)) {
                    blockType = 'quote';
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
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => { $updateToolbar(); });
            }),
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
                $updateToolbar();
                return false;
            }, COMMAND_PRIORITY_LOW),
            editor.registerCommand(CAN_UNDO_COMMAND, (payload) => {
                setCanUndo(payload);
                return false;
            }, COMMAND_PRIORITY_LOW),
            editor.registerCommand(CAN_REDO_COMMAND, (payload) => {
                setCanRedo(payload);
                return false;
            }, COMMAND_PRIORITY_LOW)
        );
    }, [$updateToolbar, editor]);

    const applyFormat = (type: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
    };

    const applyBlockType = (type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'quote') => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                if (type === 'paragraph') $setBlocksType(selection, () => $createParagraphNode());
                else if (type === 'quote') $setBlocksType(selection, () => $createQuoteNode());
                else $setBlocksType(selection, () => $createHeadingNode(type));
            }
        });
    };

    return (
        <div className='toolBar-container'>
            <div className='toolBar-main-row'>
                <nav className="toolbar-nav-group">
                    <AppLink to='/home' className="nav-link">Home</AppLink>
                    <AppLink to='/home/dashboard' className="nav-link">Dashboard</AppLink>
                </nav>

                <div className='toolbar-actions'>
                    <DropDown label="Format" active={isBold || isItalic || isUnderline}>
                        <AppButton onClick={() => applyFormat('bold')} className={isBold ? 'active' : ''}>Bold</AppButton>
                        <AppButton onClick={() => applyFormat('italic')} className={isItalic ? 'active' : ''}>Italic</AppButton>
                        <AppButton onClick={() => applyFormat('underline')} className={isUnderline ? 'active' : ''}>Underline</AppButton>
                        <AppButton onClick={() => applyFormat('strikethrough')} className={isStrikethrough ? 'active' : ''}>Strike</AppButton>
                    </DropDown>

                    <DropDown label="Layout">
                        <AppButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}>Left</AppButton>
                        <AppButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}>Center</AppButton>
                        <AppButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}>Right</AppButton>
                    </DropDown>

                    <DropDown label="Blocks" active={activeBlockType !== 'paragraph'}>
                        <AppButton onClick={() => applyBlockType('h1')}>Heading 1</AppButton>
                        <AppButton onClick={() => applyBlockType('h2')}>Heading 2</AppButton>
                        <AppButton onClick={() => applyBlockType('paragraph')}>Paragraph</AppButton>
                        <AppButton onClick={() => applyBlockType('quote')}>Quote</AppButton>
                    </DropDown>

                    <div className="button-group-mini">
                        <ImageInsertButton />
                        <AppButton disabled={!canUndo} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>⟲</AppButton>
                        <AppButton disabled={!canRedo} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>⟳</AppButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ToolBar;