import React, { useEffect, useState } from "react";
import axios from "axios";

const categorias = ["Alimento", "Limpeza", "Eletrodomésticos"];

export default function ProdutoManagerElegant() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalModo, setModalModo] = useState("adicionar"); // 'adicionar' ou 'editar'
  const [produtoAtual, setProdutoAtual] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    imagem: "",
    categoria: categorias[0],
  });

  // NOVO: Estado para modal de visualização
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
  const [produtoVisualizar, setProdutoVisualizar] = useState(null);

  const carregarProdutos = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/produtos");
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao carregar produtos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const abrirModalAdicionar = () => {
    setModalModo("adicionar");
    setForm({
      nome: "",
      descricao: "",
      imagem: "",
      categoria: categorias[0],
    });
    setModalAberto(true);
  };

  const abrirModalEditar = (produto) => {
    setModalModo("editar");
    setProdutoAtual(produto);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao || "",
      imagem: produto.imagem || "",
      categoria: produto.categoria || categorias[0],
    });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setProdutoAtual(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const salvarProduto = async () => {
    if (!form.nome.trim()) {
      alert("Nome é obrigatório");
      return;
    }

    try {
      if (modalModo === "adicionar") {
        await axios.post("http://localhost:3000/produtos", form);
      } else if (modalModo === "editar" && produtoAtual) {
        await axios.put(
          `http://localhost:3000/produtos/${produtoAtual.id}`,
          form
        );
      }
      fecharModal();
      carregarProdutos();
    } catch (err) {
      alert("Erro ao salvar produto");
      console.error(err);
    }
  };

  const excluirProduto = async (produto) => {
    if (!window.confirm(`Excluir produto "${produto.nome}"?`)) return;
    try {
      await axios.delete(`http://localhost:3000/produtos/${produto.id}`);
      carregarProdutos();
    } catch (err) {
      alert("Erro ao excluir produto");
      console.error(err);
    }
  };

  // NOVO: abrir modal visualizar
  const abrirModalVisualizar = (produto) => {
    setProdutoVisualizar(produto);
    setModalVisualizarAberto(true);
  };
  const fecharModalVisualizar = () => {
    setModalVisualizarAberto(false);
    setProdutoVisualizar(null);
  };

  return (
    <div className="bg-black min-h-screen text-black">
      <header className="bg-gradient-to-r from-red-800 via-red-900 to-black text-white p-6 sticky top-0 z-50 shadow-md">
        <h1 className="text-3xl font-extrabold tracking-wide">
          Gerenciador de Produtos
        </h1>
        <button
          onClick={abrirModalAdicionar}
          className="mt-4 px-6 py-2 bg-black hover:bg-red-700 rounded-lg shadow-lg font-semibold transition"
        >
          + Novo Produto
        </button>
      </header>

      <main className="p-6 max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        {loading ? (
          <div className="col-span-full text-center text-gray-600">
            Carregando produtos...
          </div>
        ) : produtos.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            Nenhum produto encontrado.
          </div>
        ) : (
          produtos.map((produto) => (
            <div
              key={produto.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {produto.imagem ? (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-gray-400 text-lg italic">Sem imagem</div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-bold mb-1 truncate">
                  {produto.nome}
                </h2>
                <p className="text-gray-600 flex-grow mb-2">
                  {produto.descricao || "Sem descrição"}
                </p>
                <p className="text-sm font-semibold uppercase text-indigo-600 mb-2">
                  {produto.categoria || "Sem categoria"}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Criado em: {new Date(produto.criadoEm).toLocaleDateString()}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => abrirModalEditar(produto)}
                    className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 font-semibold transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluirProduto(produto)}
                    className="flex-grow bg-red-600 hover:bg-red-700 text-white rounded-md py-2 font-semibold transition"
                  >
                    Excluir
                  </button>
                  {/* NOVO: botão visualizar */}
                  <button
                    onClick={() => abrirModalVisualizar(produto)}
                    className="flex-grow bg-green-600 hover:bg-green-700 text-white rounded-md py-2 font-semibold transition"
                  >
                    Visualizar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Modal adicionar/editar */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-xl">
            <h2 className="text-2xl font-bold mb-4">
              {modalModo === "adicionar"
                ? "Adicionar Produto"
                : "Editar Produto"}
            </h2>

            <label className="block mb-2 font-semibold">
              Nome<span className="text-red-500">*</span>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nome do produto"
              />
            </label>

            <label className="block mb-2 font-semibold">
              Descrição
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Descrição do produto"
                rows={3}
              />
            </label>

            <label className="block mb-2 font-semibold">
              URL da Imagem
              <input
                type="url"
                name="imagem"
                value={form.imagem}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </label>

            <label className="block mb-4 font-semibold">
              Categoria
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={fecharModal}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={salvarProduto}
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                {modalModo === "adicionar" ? "Adicionar" : "Salvar"}
              </button>
            </div>

            <button
              onClick={fecharModal}
              aria-label="Fechar modal"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Modal visualizar produto */}
      {modalVisualizarAberto && produtoVisualizar && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-2xl flex flex-col md:flex-row gap-4 overflow-auto max-h-[90vh]">
            {produtoVisualizar.imagem ? (
              <img
                src={produtoVisualizar.imagem}
                alt={produtoVisualizar.nome}
                className="max-w-[50%] max-h-96 object-contain rounded-lg self-center md:self-start flex-shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="text-gray-500 italic text-center">
                Sem imagem disponível
              </div>
            )}
            <div className="flex flex-col flex-grow break-words">
              <h2 className="text-3xl font-bold mb-4 break-words">
                {produtoVisualizar.nome}
              </h2>
              <p className="text-gray-700 mb-4 break-words whitespace-pre-wrap">
                {produtoVisualizar.descricao || "Sem descrição disponível."}
              </p>
              <p className="text-indigo-600 uppercase font-semibold mb-2 break-words">
                Categoria: {produtoVisualizar.categoria || "Sem categoria"}
              </p>
              <p className="text-sm text-gray-400 break-words">
                Criado em:{" "}
                {new Date(produtoVisualizar.criadoEm).toLocaleDateString()}
              </p>

              <button
                onClick={fecharModalVisualizar}
                className=" self-start mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
