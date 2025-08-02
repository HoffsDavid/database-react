import { useState, useEffect } from "react";
import { addUsuario, getUsuarios, deleteUsuario, updateUsuario } from "./db";
import { TiPencil, TiDeleteOutline } from "react-icons/ti";

function App() {
  const [start, setStart] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [nomeEditado, setNomeEditado] = useState("");

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    const lista = await getUsuarios();
    setUsuarios(lista);
  };

  function capitalizarInicial(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const salvar = async () => {
    if (nome.trim() === "") return;
    await addUsuario({ nome: capitalizarInicial(nome) });
    setNome("");
    carregarUsuarios();
  };

  const remover = async (id) => {
    await deleteUsuario(id);
    carregarUsuarios();
  };

  const iniciarEdicao = (usuario) => {
    setEditandoId(usuario.id);
    setNomeEditado(usuario.nome);
  };

  const salvarEdicao = async () => {
    if (nomeEditado.trim() === "") {
      alert("O nome não pode ser vazio.");
      return;
    }
    await updateUsuario({
      id: editandoId,
      nome: capitalizarInicial(nomeEditado),
    });
    setEditandoId(null);
    setNomeEditado("");
    carregarUsuarios();
  };

  return (
    <>
      {start ? (
        <div className="w-full h-[100dvh] bg-[rgba(0,0,0,0.8)] flex  justify-center pt-50">
          <div className="p-4 w-[400px]  bg-slate-300 rounded shadow text-center h-70">
            <p className="text-lg mb-4">
              A página a seguir demonstra o uso do IndexedDB com React. O banco de dados criado armazena informações de usuários sem utilizar uma nuvem, permitindo operações de CRUD (criação, leitura, atualização e exclusão), mesmo em modo offline.
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 mt-4 hover:bg-blue-500 hover:cursor-pointer"
              onClick={() => setStart(false)}
            >
              Iniciar
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 w-[400px] mx-auto bg-slate-300 rounded shadow mt-10 text-center">
          <h1 className="text-2xl font-bold mb-5">Gerenciamento de Usuários</h1>

          <input
            className="border p-1 mr-2 pl-2"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Novo nome"
          />
          <button className="bg-blue-600 text-white px-2 py-1 hover:bg-blue-500" onClick={salvar}>
            Salvar
          </button>

          <ul className="mt-4">
            {usuarios.map((u) => (
              <li
                key={u.id}
                className="flex justify-between items-center w-80 mb-1"
              >
                {editandoId === u.id ? (
                  <>
                    <input
                      className="border p-1 mr-2"
                      value={nomeEditado}
                      onChange={(e) => setNomeEditado(e.target.value)}
                    />
                    <button
                      onClick={salvarEdicao}
                      className="bg-green-500 text-white px-2 py-1 mr-2"
                    >
                      Salvar
                    </button>
                  </>
                ) : (
                  <>
                    <span>{u.nome}</span>
                    <div>
                      <button
                        onClick={() => iniciarEdicao(u)}
                        className="text-blue-500 mr-2 text-2xl hover:text-blue-700 hover:cursor-pointer"
                      >
                        <TiPencil />
                      </button>
                      <button
                        onClick={() => remover(u.id)}
                        className="text-red-700 text-2xl hover:text-red-500 hover:cursor-pointer"
                      >
                        <TiDeleteOutline />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
