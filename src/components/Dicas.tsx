/** Rodapé de atalhos — equivalente ao rodapé de teclas da TUI original. */
export interface Dica {
  tecla: string;
  glosa: string;
}

export function Dicas({ itens }: { itens: Dica[] }) {
  return (
    <p className="dicas">
      {itens.map((item, i) => (
        <span key={i}>
          <kbd>{item.tecla}</kbd> {item.glosa}
        </span>
      ))}
    </p>
  );
}
