import AppLoader from "@/components/atoms/AppLoader";
import {
    DecoratorNode,
    type NodeKey,
} from "lexical";
import type { ReactNode } from "react";



export class LoaderNode extends DecoratorNode<ReactNode> {
    static getType(): string {
        return "loader";
    }

    static clone(node: LoaderNode): LoaderNode {
        return new LoaderNode(node.__key);
    }

    static importJSON(): LoaderNode {
        return new LoaderNode();
    }

    exportJSON(): { type: string; version: number } {
        return {
            type: "loader",
            version: 1,
        };
    }

    constructor(key?: NodeKey) {
        super(key);
    }

    createDOM(): HTMLElement {
        return document.createElement("div");
    }

    updateDOM(): false {
        return false;
    }

    decorate(): ReactNode {
        return <AppLoader mode="normal" />;
    }
}


export function $createLoaderNode(): LoaderNode {
    return new LoaderNode();
}

export function $isLoaderNode(
    node: unknown
): node is LoaderNode {
    return node instanceof LoaderNode;
}