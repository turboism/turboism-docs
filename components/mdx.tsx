import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ReactElement } from "react";
import {
  CollapsibleCodeBlock,
  CollapsiblePre,
} from "@/components/collapsible-code-block";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    pre: (props) => {
      const codeProps = props as typeof props & {
        "data-code-language"?: string;
        "data-code-lines"?: number | string;
      };
      const code = props.children as ReactElement<{ className?: string }>;
      const classLanguage = code.props?.className?.match(
        /(?:^|\s)language-([^\s]+)/,
      )?.[1];
      const sourceLanguage = codeProps["data-code-language"] ?? classLanguage;
      const sourceLineCount = codeProps["data-code-lines"];

      return (
        <CollapsibleCodeBlock
          {...props}
          data-code-language={sourceLanguage}
          data-code-lines={sourceLineCount}
        >
          <CollapsiblePre>{props.children}</CollapsiblePre>
        </CollapsibleCodeBlock>
      );
    },
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
