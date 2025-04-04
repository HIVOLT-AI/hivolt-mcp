import { z } from "zod";

export type SessionAuth = Record<string, unknown> | undefined;

export type ToolParameters = z.ZodTypeAny;

export type Progress = {
  /**
   * The progress thus far. This should increase every time progress is made, even if the total is unknown.
   */
  progress: number;
  /**
   * Total number of items to process (or total progress required), if known.
   */
  total?: number;
};

export type Literal = boolean | null | number | string | undefined;

export type SerializableValue =
  | Literal
  | SerializableValue[]
  | { [key: string]: SerializableValue };

export type Context<T extends SessionAuth> = {
  session: T | undefined;
  reportProgress: (progress: Progress) => Promise<void>;
  log: {
    debug: (message: string, data?: SerializableValue) => void;
    error: (message: string, data?: SerializableValue) => void;
    info: (message: string, data?: SerializableValue) => void;
    warn: (message: string, data?: SerializableValue) => void;
  };
};

export type TextContent = {
  type: "text";
  text: string;
};

export type Content = TextContent;

export type ContentResult = {
  content: Content[];
  isError?: boolean;
};

export type Tool<
  T extends SessionAuth,
  Params extends ToolParameters = ToolParameters
> = {
  name: string;
  description?: string;
  parameters?: Params;
  execute: (
    args: z.infer<Params>,
    context: Context<T>
  ) => Promise<string | ContentResult | TextContent>;
};
