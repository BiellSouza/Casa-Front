import React, { useEffect, useState } from "react";
import axios from "axios";

const categorias = ["Todos", "Alimento", "Limpeza", "Eletrodomésticos"];

export default function ProdutoManager() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [excluindoId, setExcluindoId] = useState(null);

  const carregarProdutos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/produtos");
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao carregar produtos", err);
    }
  };

  const adicionarProduto = async () => {
    const nome = prompt("Nome do produto:");
    const descricao = prompt("Descrição:");
    const imagem = prompt("URL da imagem:");
    const categoria = prompt(
      "Categoria (Alimento, Limpeza, Eletrodomésticos):"
    );

    if (!nome || !categoria) return;

    try {
      await axios.post("http://localhost:3000/produtos", {
        nome,
        descricao,
        imagem,
        categoria: categoria || null,
      });
      carregarProdutos();
    } catch (err) {
      console.error("Erro ao adicionar produto", err);
    }
  };

  const editarProduto = async (produto) => {
    const nome = prompt("Novo nome do produto:", produto.nome);
    const descricao = prompt("Nova descrição:", produto.descricao);
    const imagem = prompt("Nova URL da imagem:", produto.imagem);
    const categoria = prompt(
      "Nova categoria (Alimento, Limpeza, Eletrodomésticos):",
      produto.categoria
    );

    if (!nome || !categoria) return;

    try {
      if (!produto.id) {
        alert("ID do produto inválido");
        return;
      }
      await axios.put(`http://localhost:3000/produtos/${produto.id}`, {
        nome,
        descricao,
        imagem,
        categoria: categoria || null,
      });
      carregarProdutos();
    } catch (err) {
      alert(
        "Erro ao editar produto:\n" +
          JSON.stringify(err.response?.data || err.message, null, 2)
      );
      console.error("Erro ao editar produto:", err);
    }
  };

  const excluirProduto = async (produto) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    setExcluindoId(produto.id);

    try {
      await axios.delete(`http://localhost:3000/produtos/${produto.id}`);
      alert(
        `Produto excluído:\n\n` +
          `ID: ${produto.id}\n` +
          `Nome: ${produto.nome}\n` +
          `Descrição: ${produto.descricao || "N/A"}\n` +
          `Categoria: ${produto.categoria || "N/A"}\n` +
          `Criado em: ${new Date(produto.criadoEm).toLocaleString()}`
      );
      carregarProdutos();
    } catch (err) {
      console.error("Erro ao excluir produto", err);
    } finally {
      setExcluindoId(null);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const produtosFiltrados =
    filtro === "Todos"
      ? produtos
      : produtos.filter((p) => p.categoria === filtro);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciador de Produtos</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={carregarProdutos}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ver Produtos Listados
        </button>
        <button
          onClick={adicionarProduto}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Adicionar Produto
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`px-4 py-2 rounded border ${
              filtro === cat
                ? "bg-gray-800 text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <table className="min-w-full border rounded shadow text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nome</th>
            <th className="p-2">Descrição</th>
            <th className="p-2">Imagem</th>
            <th className="p-2">Criado Em</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                Nenhum produto encontrado.
              </td>
            </tr>
          )}
          {produtosFiltrados.map((produto) => (
            <tr key={produto.id} className="border-t">
              <td className="p-2">{produto.id}</td>
              <td className="p-2">{produto.nome}</td>
              <td className="p-2">{produto.descricao || "-"}</td>
              <td className="p-2">
                {produto.imagem ? (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="p-2">
                {new Date(produto.criadoEm).toLocaleDateString()}
              </td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => editarProduto(produto)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluirProduto(produto)}
                  disabled={excluindoId === produto.id}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {excluindoId === produto.id ? "Carregando..." : "Excluir"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
