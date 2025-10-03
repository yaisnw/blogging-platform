import { createCommand } from "lexical";

export type InsertImagePayload = {
  file?: File;       
  src?: string;      
  alt?: string;
  alignment?: "left" | "center" | "right";
};

export const INSERT_IMAGE_COMMAND = createCommand<InsertImagePayload>();
