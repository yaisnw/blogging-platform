import { $applyNodeReplacement, DecoratorNode } from "lexical";
import type { ReactNode } from "react";

interface SerializedImageNode {
    type: 'image';
    version: 1;
    src: string;
    altText: string;
}

export class ImageNode extends DecoratorNode<ReactNode> {
    __src: string;
    __altText: string;

    static getType(): string {
        return "image";
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(node.__src, node.__altText, node.__key);
    }

    constructor(src: string, altText = "", key?: string) {
        super(key);
        this.__src = src;
        this.__altText = altText;
    }

    createDOM(): HTMLElement {
        return document.createElement("span");
    }

    updateDOM(): false {
        return false;
    }

    decorate(): ReactNode {
        return <img src={this.__src} alt={this.__altText} style={{ maxWidth: "100%" }} />;
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        return new ImageNode(serializedNode.src, serializedNode.altText);
    }

    exportJSON() {
        return {
            type: "image",
            version: 1,
            src: this.__src,
            altText: this.__altText,
        };
    }
}
export function $createImageNode(src: string, altText: string): ImageNode {
    return $applyNodeReplacement(new ImageNode(src, altText));
}