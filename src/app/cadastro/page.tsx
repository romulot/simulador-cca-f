/** Cadastro público encerrado. A rota permanece apenas para que favoritos
 * e links antigos terminem de forma previsível na tela de login. */
import { redirect } from "next/navigation";

export default function CadastroPage() {
  redirect("/login");
}
