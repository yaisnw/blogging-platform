import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getSelection, $isParagraphNode, $isRangeSelection, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from 'lexical';
import { mergeRegister } from "@lexical/utils"
import { useCallback, useEffect, useState } from 'react';
import { $setBlocksType } from '@lexical/selection'
import "../../styles/editor.css"
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import ImageInsertButton from '../atoms/ImageInsertButton';
import AppButton from '../atoms/AppButton';
import AppLink from '../atoms/AppLink';
import UIstyles from "@/styles/ui.module.css"


function ToolBar() {
    const [editor] = useLexicalComposerContext();
    const [activeBlockType, setActiveBlockType] = useState('paragraph');
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [collapsed, setCollapsed] = useState(false);


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
                }
                else if ($isParagraphNode(parent)) {
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
    const applyBlockType = (blockType: 'h1' | 'h2' | 'h3' | 'paragraph' | 'quote') => {
        editor.focus();
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                if (blockType === 'paragraph') {
                    $setBlocksType(selection, () => $createParagraphNode())
                }
                else if (blockType === 'quote') {
                    $setBlocksType(selection, () => $createQuoteNode())
                }
                else {
                    $setBlocksType(selection, () => $createHeadingNode(blockType))
                }
            }
        })
    }

    return (
        <div className='toolBar-container' >
            <div className={`nav-container ${collapsed ? "collapsed" : ""}`}>
                <AppLink to='/home'>Home</AppLink>
                <AppLink to='/home/dashboard'>Dashboard</AppLink>
            </div>
            <div className='toolBar'>
                <div className='button-group' role="group" aria-label="Text formatting">
                    <AppButton type="button" aria-label="Bold" className={`toolbar-button ${isBold ? 'active' : ''}`} onClick={() => applyFormat('bold')}>Bold</AppButton>
                    <AppButton type="button" aria-label="Italic" className={`toolbar-button ${isItalic ? 'active' : ''}`} onClick={() => applyFormat('italic')}>Italic</AppButton>
                    <AppButton type="button" aria-label="Underline" className={`toolbar-button ${isUnderline ? 'active' : ''}`} onClick={() => applyFormat('underline')}>Underline</AppButton>
                    <AppButton type="button" aria-label="Strikethrough" className={`toolbar-button ${isStrikethrough ? 'active' : ''}`} onClick={() => applyFormat('strikethrough')}>Strikethrough</AppButton>

                    <AppButton type="button" aria-label="Align left" className={'toolbar-button'} onClick={() => applyAlign('left')}>Left</AppButton>
                    <AppButton type="button" aria-label="Align center" className={'toolbar-button'} onClick={() => applyAlign('center')}>Center</AppButton>
                    <AppButton type="button" aria-label="Align right" className={'toolbar-button'} onClick={() => applyAlign('right')}>Right</AppButton>
                    <AppButton type="button" aria-label="Justify text" className={'toolbar-button'} onClick={() => applyAlign('justify')}>Justify</AppButton>
                </div>
                <div className={`${UIstyles.divider } toolBar-divider`}><span></span></div>
                <div className='button-group' role="group" aria-label="Block types">
                    <AppButton type="button" aria-label="Heading 1" className={`toolbar-button ${activeBlockType === 'h1' ? 'active' : ''}`} onClick={() => applyBlockType('h1')}>H1</AppButton>
                    <AppButton type="button" aria-label="Heading 2" className={`toolbar-button ${activeBlockType === 'h2' ? 'active' : ''}`} onClick={() => applyBlockType('h2')}>H2</AppButton>
                    <AppButton type="button" aria-label="Heading 3" className={`toolbar-button ${activeBlockType === 'h3' ? 'active' : ''}`} onClick={() => applyBlockType('h3')}>H3</AppButton>
                    <AppButton type="button" aria-label="Paragraph" className={`toolbar-button ${activeBlockType === 'paragraph' ? 'active' : ''}`} onClick={() => applyBlockType('paragraph')}>Paragraph</AppButton>
                    <AppButton type="button" aria-label="Quote" className={`toolbar-button ${activeBlockType === 'quote' ? 'active' : ''}`} onClick={() => applyBlockType('quote')}>Quote</AppButton>
                    <ImageInsertButton />
                    <AppButton type="button" aria-label="Undo" className={'toolbar-button'} disabled={!canUndo} onClick={() => applyUndoRedo('undo')}>Undo</AppButton>
                    <AppButton type="button" aria-label="Redo" className={'toolbar-button'} disabled={!canRedo} onClick={() => applyUndoRedo('redo')}>Redo</AppButton>
                    <AppButton onClick={() => setCollapsed(!collapsed)} className={' nav-collapse-button'}>{collapsed ? "▼ Expand Navbar" : "▲ Collapse Navbar"}</AppButton>

                </div>
            </div>
        </div>
    );
}
export default ToolBar;
