import { $applyNodeReplacement, DecoratorNode } from "lexical";
import type { LexicalNode } from 'lexical'
import type { ReactNode } from "react";
import LexicalImage from "@/components/atoms/LexicalImage";

interface SerializedImageNode {
    type: 'image';
    version: 1;
    src: string;
    altText: string;
    alignment: 'left' | 'center' | 'right'
}

export class ImageNode extends DecoratorNode<ReactNode> {
    __src: string;
    __altText: string;
    __alignment: 'left' | 'center' | 'right';

    static getType(): string {
        return "image";
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(node.__src, node.__altText, node.__key, node.__alignment);
    }

    constructor(src: string, altText = "", key?: string, alignment: 'left' | 'center' | 'right' = 'center') {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__alignment = alignment
    }
    getSrc(): string {
        return this.__src;
    }

    getAltText(): string {
        return this.__altText;
    }

    getAlignment(): 'left' | 'center' | 'right' {
        return this.__alignment;
    }
    setAlignment(alignment: 'left' | 'center' | 'right') {
        const writable = this.getWritable();
        writable.__alignment = alignment;
    }

    createDOM(): HTMLElement {
        return document.createElement("span");
    }

    updateDOM(): false {
        return false;
    }

    isInline(): boolean {
        return false;
    }

    hasEditableContent(): boolean {
        return false;
    }

    isIsolated(): boolean {
        return true;
    }

    canInsertTextAfter(): boolean {
        return true;
    }

    canInsertTextBefore(): boolean {
        return true;
    }

    decorate(): ReactNode {
        const latestNode = this.getLatest() as ImageNode;
        return <LexicalImage src={latestNode.__src} altText={latestNode.__altText} nodeKey={latestNode.getKey()} alignment={latestNode.__alignment} />;
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        return new ImageNode(serializedNode.src, serializedNode.altText, undefined, serializedNode.alignment || 'center');
    }

    exportJSON(): SerializedImageNode {
        return {
            type: "image",
            version: 1,
            src: this.getSrc(),
            altText: this.getAltText(),
            alignment: this.getAlignment(),
        };
    }
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}

export function $createImageNode(src: string, altText: string): ImageNode {
    return $applyNodeReplacement(new ImageNode(src, altText));
}   