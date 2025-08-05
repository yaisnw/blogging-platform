import { createCommand } from "lexical";

type InsertImagePayload = {
    src: string;
    alt?: string;
};


export const INSERT_IMAGE_COMMAND = createCommand<InsertImagePayload>("INSERT_IMAGE_COMMAND");