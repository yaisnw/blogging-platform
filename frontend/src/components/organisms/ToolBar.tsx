import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getSelection, $isParagraphNode, $isRangeSelection, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from 'lexical';
import { mergeRegister } from "@lexical/utils"
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { $setBlocksType } from '@lexical/selection'
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import ImageInsertButton from '../atoms/ImageInsertButton';
import AppButton from '../atoms/AppButton';
import AppLink from '../atoms/AppLink';
import "../../styles/editor.css"
import { $isElementNode } from 'lexical';

import { 
    BoldSVG, ItalicSVG, UnderlineSVG, StrikeSVG,
    AlignLeftSVG, AlignCenterSVG, AlignRightSVG, AlignJustifySVG,
    H1SVG, H2SVG, H3SVG, ParagraphSVG, QuoteSVG
} from '../atoms/Icons';

const DropDown = ({ label, children, }: { label: string; children: ReactNode; }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="dropdown-container" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button className='dropdown-button '>
                {label} <span className="chevron">▼</span>
            </button>
            {open && <div className="dropdown-menu">{children}</div>}
        </div>
    );
};

function ToolBar() {
    const [editor] = useLexicalComposerContext();
    const [activeBlockType, setActiveBlockType] = useState('paragraph');
    const [activeAlign, setActiveAlign] = useState('left');
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
            for (const node of nodes) {
                const parent = node.getTopLevelElementOrThrow();

                let blockType;
                if ($isHeadingNode(parent)) {
                    blockType = parent.getTag();
                } else if ($isQuoteNode(parent)) {
                    blockType = 'quote';
                } else if ($isParagraphNode(parent)) {
                    blockType = 'paragraph';
                }

                setActiveBlockType(blockType ?? 'paragraph');
                if ($isElementNode(parent)) {
                    setActiveAlign(parent.getFormatType() || 'left');
                }
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
            <nav className="toolbar-nav-group">
                <AppLink to='/home' className="nav-link">Home</AppLink>
                <AppLink to='/home/dashboard' className="nav-link">Dashboard</AppLink>
            </nav>

            <div className='toolbar-actions'>
                <DropDown label="Format">
                    <AppButton onClick={() => applyFormat('bold')} className={isBold ? 'active' : ''}>
                        <BoldSVG /> <span>Bold</span>
                    </AppButton>
                    <AppButton onClick={() => applyFormat('italic')} className={isItalic ? 'active' : ''}>
                        <ItalicSVG /> <span>Italic</span>
                    </AppButton>
                    <AppButton onClick={() => applyFormat('underline')} className={isUnderline ? 'active' : ''}>
                        <UnderlineSVG /> <span>Underline</span>
                    </AppButton>
                    <AppButton onClick={() => applyFormat('strikethrough')} className={isStrikethrough ? 'active' : ''}>
                        <StrikeSVG /> <span>Strike</span>
                    </AppButton>
                </DropDown>

                <DropDown label="Layout">
                    <AppButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} className={activeAlign === 'left' ? 'active' : ''}>
                        <AlignLeftSVG /> <span>Left</span>
                    </AppButton>
                    <AppButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')} className={activeAlign === 'center' ? 'active' : ''}>
                        <AlignCenterSVG /> <span>Center</span>
                    </AppButton>
                    <AppButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')} className={activeAlign === 'right' ? 'active' : ''}>
                        <AlignRightSVG /> <span>Right</span>
                    </AppButton>
                    <AppButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')} className={activeAlign === 'justify' ? 'active' : ''}>
                        <AlignJustifySVG /> <span>Justify</span>
                    </AppButton>
                </DropDown>

                <DropDown label="Blocks">
                    <AppButton onClick={() => applyBlockType('h1')} className={activeBlockType === 'h1' ? 'active' : ''}>
                        <H1SVG /> <span>Heading 1</span>
                    </AppButton>
                    <AppButton onClick={() => applyBlockType('h2')} className={activeBlockType === 'h2' ? 'active' : ''}>
                        <H2SVG /> <span>Heading 2</span>
                    </AppButton>
                    <AppButton onClick={() => applyBlockType('h3')} className={activeBlockType === 'h3' ? 'active' : ''}>
                        <H3SVG /> <span>Heading 3</span>
                    </AppButton>
                    <AppButton onClick={() => applyBlockType('paragraph')} className={activeBlockType === 'paragraph' ? 'active' : ''}>
                        <ParagraphSVG /> <span>Paragraph</span>
                    </AppButton>
                    <AppButton onClick={() => applyBlockType('quote')} className={activeBlockType === 'quote' ? 'active' : ''}>
                        <QuoteSVG /> <span>Quote</span>
                    </AppButton>
                </DropDown>

                <div className="button-group-mini">
                    <ImageInsertButton />
                    <AppButton disabled={!canUndo} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>⟲</AppButton>
                    <AppButton disabled={!canRedo} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>⟳</AppButton>
                </div>
            </div>
        </div>
    );
}

export default ToolBar;