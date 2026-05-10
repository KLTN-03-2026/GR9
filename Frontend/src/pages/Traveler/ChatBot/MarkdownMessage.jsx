import { cn } from "@/lib/utils";

const renderInlineMarkdown = (text, isUser) => {
  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("**")) {
      parts.push(
        <strong key={`${token}-${match.index}`} className="font-bold">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={`${token}-${match.index}`}
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[0.82em] font-semibold",
            isUser ? "bg-white/15 text-white" : "bg-slate-100 text-teal-700",
          )}
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      parts.push(
        <a
          key={`${token}-${match.index}`}
          href={linkMatch?.[2] || "#"}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "font-semibold underline underline-offset-2",
            isUser ? "text-white" : "text-teal-700",
          )}
        >
          {linkMatch?.[1] || token}
        </a>,
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

export default function MarkdownMessage({ content, isUser }) {
  const lines = String(content || "").split("\n");
  const blocks = [];
  let listItems = [];
  let orderedItems = [];
  let codeLines = [];
  let inCodeBlock = false;

  const flushLists = () => {
    if (listItems.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="my-2 list-disc space-y-1 pl-5">
          {listItems.map((item, index) => (
            <li key={`${item}-${index}`}>{renderInlineMarkdown(item, isUser)}</li>
          ))}
        </ul>,
      );
      listItems = [];
    }

    if (orderedItems.length) {
      blocks.push(
        <ol
          key={`ol-${blocks.length}`}
          className="my-2 list-decimal space-y-1 pl-5"
        >
          {orderedItems.map((item, index) => (
            <li key={`${item}-${index}`}>{renderInlineMarkdown(item, isUser)}</li>
          ))}
        </ol>,
      );
      orderedItems = [];
    }
  };

  const flushCode = () => {
    if (!codeLines.length) return;

    blocks.push(
      <pre
        key={`code-${blocks.length}`}
        className={cn(
          "my-2 overflow-x-auto rounded-xl p-3 text-xs leading-5",
          isUser ? "bg-white/15 text-white" : "bg-slate-950 text-slate-100",
        )}
      >
        <code>{codeLines.join("\n")}</code>
      </pre>,
    );
    codeLines = [];
  };

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        flushCode();
      } else {
        flushLists();
      }

      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    const unorderedMatch = line.match(/^\s*[-*]\s+(.+)$/);
    const orderedMatch = line.match(/^\s*\d+\.\s+(.+)$/);

    if (unorderedMatch) {
      orderedItems = [];
      listItems.push(unorderedMatch[1]);
      return;
    }

    if (orderedMatch) {
      listItems = [];
      orderedItems.push(orderedMatch[1]);
      return;
    }

    flushLists();

    if (!line.trim()) {
      return;
    }

    blocks.push(
      <p key={`p-${blocks.length}`} className="my-1">
        {renderInlineMarkdown(line, isUser)}
      </p>,
    );
  });

  flushLists();
  flushCode();

  return (
    <div className="space-y-1 whitespace-normal break-words">
      {blocks.length ? blocks : null}
    </div>
  );
}
