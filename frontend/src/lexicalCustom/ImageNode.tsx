import { $applyNodeReplacement, DecoratorNode } from "lexical";
import type { LexicalNode, NodeKey } from 'lexical'
import type { ReactNode } from "react";
import LexicalImage from "@/components/atoms/LexicalImage";

export interface SerializedImageNode {
    type: 'image';
    version: 1;
    src: string;
    altText: string;
    width?: number;
    alignment: 'left' | 'center' | 'right';
}

export class ImageNode extends DecoratorNode<ReactNode> {
    __src: string;
    __altText: string;
    __width: number | undefined;
    __alignment: 'left' | 'center' | 'right';
    static getType(): string {
        return "image";
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(
            node.__src,
            node.__altText,
            node.__key,
            node.__alignment,
            node.__width,
        );
    }

    constructor(
        src: string,
        altText = "",
        key?: NodeKey,
        alignment: 'left' | 'center' | 'right' = 'center',
        width?: number,
    ) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__alignment = alignment;
        this.__width = width;
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

    getWidth(): number | undefined {
        return this.__width;
    }



    setWidth(width: number): void {
        const writable = this.getWritable();
        writable.__width = width;
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

    decorate(): ReactNode {
        return (
            <LexicalImage
                src={this.__src}
                altText={this.__altText}
                width={this.__width}
                nodeKey={this.getKey()}
                alignment={this.__alignment}
            />
        );
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        const { src, altText, alignment, width} = serializedNode;
        return new ImageNode(
            src,
            altText,
            undefined,
            alignment || 'center',
            width,
        );
    }

    exportJSON(): SerializedImageNode {
        return {
            type: "image",
            version: 1,
            src: this.getSrc(),
            altText: this.getAltText(),
            alignment: this.getAlignment(),
            width: this.getWidth(),
        };
    }
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}

export function $createImageNode(src: string, altText: string, width?: number,): ImageNode {
    return $applyNodeReplacement(new ImageNode(src, altText, undefined, 'center', width));
}