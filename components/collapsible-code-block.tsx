"use client";

import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import type { ComponentProps, ReactNode } from "react";
import { Children, isValidElement, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

const languageNames: Record<string, string> = {
  bash: "Bash",
  java: "Java",
  javascript: "JavaScript",
  json: "JSON",
  kotlin: "Kotlin",
  markdown: "Markdown",
  plaintext: "Text",
  text: "Text",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  xml: "XML",
  yaml: "YAML",
};

function readText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (!isValidElement<{ children?: ReactNode }>(node)) return "";
  return Children.toArray(node.props.children).map(readText).join("");
}

type CodeMetadata = {
  language?: string;
  lineCount?: number;
};

function readCodeMetadata(node: ReactNode): CodeMetadata {
  if (!isValidElement<{
    className?: string;
    children?: ReactNode;
    "data-code-language"?: string;
    "data-code-lines"?: number | string;
  }>(node)) return {};

  const classLanguage = node.props.className?.match(/(?:^|\s)language-([^\s]+)/)?.[1];
  const lineCount = Number(node.props["data-code-lines"]);
  const ownMetadata: CodeMetadata = {
    language: node.props["data-code-language"] ?? classLanguage,
    lineCount: Number.isFinite(lineCount) ? lineCount : undefined,
  };

  if (ownMetadata.language && ownMetadata.lineCount !== undefined) return ownMetadata;

  for (const child of Children.toArray(node.props.children)) {
    const childMetadata = readCodeMetadata(child);
    ownMetadata.language ??= childMetadata.language;
    ownMetadata.lineCount ??= childMetadata.lineCount;
    if (ownMetadata.language && ownMetadata.lineCount !== undefined) break;
  }
  return ownMetadata;
}

function describeCode(
  title: ReactNode,
  language: string,
  code: string,
  descriptions: Record<string, string>,
  fallback: string,
): string {
  if (title) return readText(title).trim();

  const firstLine = code
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
  const comment = firstLine
    ?.match(/^\s*(?:\/\/|#|<!--|\/\*+|\*+)\s*(.*?)\s*(?:-->|\*\/)?$/)?.[1]
    ?.trim();

  if (comment) return comment.length > 72 ? `${comment.slice(0, 69)}…` : comment;
  return descriptions[language] ?? fallback;
}

type CollapsibleCodeBlockProps = ComponentProps<typeof CodeBlock> & {
  "data-code-language"?: string;
  "data-code-lines"?: number | string;
};

export function CollapsibleCodeBlock({
  title,
  children,
  "data-code-language": sourceLanguage,
  "data-code-lines": sourceLineCount,
  ...props
}: CollapsibleCodeBlockProps) {
  const { language: pageLanguage } = useLanguage();
  const [open, setOpen] = useState(true);
  const code = useMemo(() => readText(children).replace(/\n$/, ""), [children]);
  const metadata = useMemo(() => readCodeMetadata(children), [children]);
  const language = sourceLanguage ?? metadata.language ?? "text";
  const parsedSourceLineCount = Number(sourceLineCount);
  const lineCount = Number.isFinite(parsedSourceLineCount)
    ? parsedSourceLineCount
    : metadata.lineCount ?? (code.length === 0 ? 0 : code.split("\n").length);
  const labels = {
    en: {
      code: "Code",
      lines: "lines",
      line: "line",
      descriptions: {
        bash: "Shell command",
        java: "Java example",
        javascript: "JavaScript example",
        json: "JSON configuration",
        kotlin: "Kotlin configuration",
        markdown: "Markdown context",
        plaintext: "Text example",
        text: "Text example",
        typescript: "TypeScript example",
        xml: "XML configuration",
        yaml: "YAML configuration",
      },
    },
    zh: {
      code: "代码",
      lines: "行",
      line: "行",
      descriptions: {
        bash: "命令行示例",
        java: "Java 示例",
        javascript: "JavaScript 示例",
        json: "JSON 配置",
        kotlin: "Kotlin 配置",
        markdown: "Markdown 上下文",
        plaintext: "文本示例",
        text: "文本示例",
        typescript: "TypeScript 示例",
        xml: "XML 配置",
        yaml: "YAML 配置",
      },
    },
    ja: {
      code: "コード",
      lines: "行",
      line: "行",
      descriptions: {
        bash: "コマンド例",
        java: "Java の例",
        javascript: "JavaScript の例",
        json: "JSON 設定",
        kotlin: "Kotlin 設定",
        markdown: "Markdown コンテキスト",
        plaintext: "テキスト例",
        text: "テキスト例",
        typescript: "TypeScript の例",
        xml: "XML 設定",
        yaml: "YAML 設定",
      },
    },
  }[pageLanguage];
  const summary = useMemo(
    () => describeCode(title, language, code, labels.descriptions, labels.code),
    [code, labels.code, labels.descriptions, language, title],
  );
  const languageName = languageNames[language] ?? language.toUpperCase();
  const lineLabel = lineCount === 1 ? labels.line : labels.lines;

  return (
    <CodeBlock
      {...props}
      data-code-language={sourceLanguage}
      data-code-lines={sourceLineCount}
      title={undefined}
      data-collapsible-code=""
      data-state={open ? "open" : "closed"}
      Actions={({ className, children: copyButton }) => (
        <div className={`code-block-toolbar ${className ?? ""}`}>
          <button
            type="button"
            className="code-block-toggle"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <ChevronDown aria-hidden="true" />
            <span className="code-block-summary">{summary}</span>
            <span className="code-block-meta">
              <span>{lineCount} {lineLabel}</span>
              <span>{languageName}</span>
            </span>
          </button>
          {copyButton}
        </div>
      )}
      viewportProps={{
        ...props.viewportProps,
        hidden: !open,
        "aria-hidden": !open,
      }}
    >
      {children}
    </CodeBlock>
  );
}

export function CollapsiblePre(props: ComponentProps<"pre">) {
  return <Pre {...props} />;
}
