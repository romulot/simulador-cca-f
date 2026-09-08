import { Fragment } from "react";

type Token =
  | { type: "text"; content: string }
  | { type: "strong"; content: string }
  | { type: "em"; content: string }
  | { type: "code"; content: string };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  const addText = (s: string) => {
    if (!s) return;
    const last = tokens[tokens.length - 1];
    if (last?.type === "text") {
      last.content += s;
    } else {
      tokens.push({ type: "text", content: s });
    }
  };

  while (pos < text.length) {
    const ch = text[pos];

    // Backtick: precedência máxima — conteúdo interno não é interpretado
    if (ch === "`") {
      const close = text.indexOf("`", pos + 1);
      if (close !== -1) {
        tokens.push({ type: "code", content: text.slice(pos + 1, close) });
        pos = close + 1;
        continue;
      }
      addText("`");
      pos++;
      continue;
    }

    // Asterisco duplo → strong
    if (ch === "*" && text[pos + 1] === "*") {
      const close = text.indexOf("**", pos + 2);
      if (close !== -1) {
        tokens.push({ type: "strong", content: text.slice(pos + 2, close) });
        pos = close + 2;
        continue;
      }
      addText("**");
      pos += 2;
      continue;
    }

    // Asterisco simples → em; ignora ** ao procurar o fechamento
    if (ch === "*") {
      let closePos = -1;
      let i = pos + 1;
      while (i < text.length) {
        if (text[i] === "*") {
          if (text[i + 1] !== "*") {
            closePos = i;
            break;
          }
          i += 2;
          continue;
        }
        i++;
      }
      if (closePos !== -1) {
        tokens.push({ type: "em", content: text.slice(pos + 1, closePos) });
        pos = closePos + 1;
        continue;
      }
      addText("*");
      pos++;
      continue;
    }

    addText(ch);
    pos++;
  }

  return tokens;
}

interface Props {
  texto: string;
}

export function TextoMarkdownInline({ texto }: Props) {
  const tokens = tokenize(texto);
  return (
    <>
      {tokens.map((token, i) => {
        if (token.type === "strong") return <strong key={i}>{token.content}</strong>;
        if (token.type === "em") return <em key={i}>{token.content}</em>;
        if (token.type === "code") return <code key={i}>{token.content}</code>;
        return <Fragment key={i}>{token.content}</Fragment>;
      })}
    </>
  );
}
