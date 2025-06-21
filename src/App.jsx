import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const categorias = ["Limpeza", "Alimento", "Eletrodomésticos"];

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
  const [filtro, setFiltro] = useState("Todos");
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
  const [produtoVisualizar, setProdutoVisualizar] = useState(null);

  const dropdownRef = useRef(null);

  const carregarProdutos = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://casa-back-1.onrender.com/produtos");
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
        await axios.post("https://casa-back-1.onrender.com/produtos", form);
      } else if (modalModo === "editar" && produtoAtual) {
        await axios.put(
          `https://casa-back-1.onrender.com/produtos/${produtoAtual.id}`,
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
      await axios.delete(
        `https://casa-back-1.onrender.com/produtos/${produto.id}`
      );
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
      alert("Erro ao excluir produto");
      console.error(err);
    }
  };

  // Abrir modal visualizar produto
  const abrirModalVisualizar = (produto) => {
    setProdutoVisualizar(produto);
    setModalVisualizarAberto(true);
  };

  const fecharModalVisualizar = () => {
    setModalVisualizarAberto(false);
    setProdutoVisualizar(null);
  };

  const produtosFiltrados =
    filtro === "Todos"
      ? produtos
      : produtos.filter(
          (p) =>
            p.categoria && p.categoria.toLowerCase() === filtro.toLowerCase()
        );

  return (
    <div className="bg-black min-h-screen">
      <header className="bg-gradient-to-r from-red-800 via-red-900 to-red-800 text-white p-6 sticky top-0 z-50 shadow-md flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-wide flex-grow">
          Produtos para nossa casa
        </h1>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={abrirModalAdicionar}
            className="px-6 py-2 bg-black hover:bg-gray-700 rounded-lg shadow-lg font-semibold transition"
          >
            + Novo Produto
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMostrarDropdown((v) => !v)}
              className="px-6 py-2 bg-black hover:bg-gray-700 rounded-lg shadow font-semibold transition flex items-center gap-1"
            >
              Filtrar: {filtro}
              <svg
                className={`w-4 h-4 transition-transform ${
                  mostrarDropdown ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            {mostrarDropdown && (
              <ul className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg text-black font-semibold z-50">
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setFiltro("Todos");
                    setMostrarDropdown(false);
                  }}
                >
                  Todos
                </li>
                {categorias.map((cat) => (
                  <li
                    key={cat}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setFiltro(cat);
                      setMostrarDropdown(false);
                    }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full text-center text-gray-600">
            Carregando produtos...
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            Nenhum produto encontrado.
          </div>
        ) : (
          produtosFiltrados.map((produto) => (
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
                <h2
                  className="text-xl font-bold mb-1 truncate"
                  title={produto.nome}
                >
                  {produto.nome}
                </h2>
                <p className="text-gray-600 flex-grow mb-2 break-words">
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
                  <button
                    onClick={() => abrirModalVisualizar(produto)}
                    className="flex-grow bg-gray-700 hover:bg-gray-800 text-white rounded-md py-2 font-semibold transition"
                  >
                    Visualizar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Modal Adicionar/Editar */}
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

      {/* Modal Visualizar Produto */}
      {modalVisualizarAberto && produtoVisualizar && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-auto">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-xl max-h-full overflow-auto">
            <h2 className="text-2xl font-bold mb-4">
              {produtoVisualizar.nome}
            </h2>

            {produtoVisualizar.imagem ? (
              <img
                src={produtoVisualizar.imagem}
                alt={produtoVisualizar.nome}
                className="w-full max-h-96 object-contain mb-4 rounded"
              />
            ) : (
              <div className="text-gray-400 text-center mb-4 italic">
                Sem imagem disponível
              </div>
            )}

            <p className="mb-2">
              <span className="font-semibold">Descrição: </span>
              {produtoVisualizar.descricao || "Sem descrição"}
            </p>

            <p className="mb-2">
              <span className="font-semibold">Categoria: </span>
              {produtoVisualizar.categoria || "Sem categoria"}
            </p>

            <p className="mb-2 text-sm text-gray-500">
              Criado em:{" "}
              {new Date(produtoVisualizar.criadoEm).toLocaleDateString()}
            </p>

            <button
              onClick={fecharModalVisualizar}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-3xl font-bold"
              aria-label="Fechar visualização"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
