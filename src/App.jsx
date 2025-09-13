import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Menu, Plus, ChevronDown } from "lucide-react";

const categorias = [
  "Limpeza",
  "Alimento",
  "Eletrodomésticos",
  "Rosana",
  "Gabriel",
];

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Navbar/Sidebar state
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Modal states
  const [modalAberto, setModalAberto] = useState(false);
  const [modalModo, setModalModo] = useState("adicionar");
  const [produtoAtual, setProdutoAtual] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    imagem: "",
    categoria: categorias[0],
  });

  const [filtro, setFiltro] = useState("Todos");
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
  const [produtoVisualizar, setProdutoVisualizar] = useState(null);

  // ---------------- Lógica Navbar ----------------
  const open = () => {
    setShowSidebar(true);
    setTimeout(() => setOpenSidebar(true), 10);
  };
  const close = () => {
    setOpenSidebar(false);
    setTimeout(() => setShowSidebar(false), 300);
  };

  // ---------------- Carregar produtos ----------------
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

  // ---------------- Dropdown click outside ----------------
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------- Modais ----------------
  const abrirModalAdicionar = () => {
    setModalModo("adicionar");
    setForm({ nome: "", descricao: "", imagem: "", categoria: categorias[0] });
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
      alert(`Produto excluído: ${produto.nome}.`);
      carregarProdutos();
    } catch (err) {
      alert("Erro ao excluir produto");
      console.error(err);
    }
  };

  const abrirModalVisualizar = (produto) => {
    setProdutoVisualizar(produto);
    setModalVisualizarAberto(true);
  };

  const fecharModalVisualizar = () => {
    setModalVisualizarAberto(false);
    setProdutoVisualizar(null);
  };

  // ---------------- Produtos filtrados ----------------
  const [searchTerm, setSearchTerm] = useState("");

  // Filtragem combinada por categoria e search
  const produtosFiltrados = produtos
    .filter((p) =>
      filtro === "Todos"
        ? true
        : p.categoria?.toLowerCase() === filtro.toLowerCase()
    )
    .filter((p) => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className="bg-[#E59866] min-h-screen p-6">
      {/* ---------------- Navbar ---------------- */}
      <div className="w-full h-16 bg-secundary justify-between flex items-center px-4 rounded-[6px] mb-[36px] max-w-[1215px] m-auto bg-white/50">
        {/* Logo */}
        <h1 className="text-[26px] text-white">Nosso Sistema</h1>

        {/* Desktop */}
        <div className="hidden lg:flex gap-2 items-center">
          <div className="flex min-w-[600px] justify-evenly items-center">
            {/* Search */}
            <div className="relative w-[170px]">
              <input
                type="text"
                placeholder="Pesquisar por nome ou marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full p-2 pr-10 pl-3 text-black outline-none border-2 border-primary"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </div>

            {/* Botões */}
            <div className="flex gap-6">
              <button
                onClick={abrirModalAdicionar}
                className="bg-primary p-2 px-3 border-2 border-white text-white rounded-full flex w-[160px] justify-evenly items-center"
              >
                Novo Produto <Plus size={20} />
              </button>

              <div className="relative w-[175px]">
                <button
                  onClick={() => setMostrarDropdown((v) => !v)}
                  className="bg-primary p-2 px-3 border-2 border-white text-white rounded-full flex justify-between items-center w-full"
                >
                  Filtrar Categoria <ChevronDown size={20} />
                </button>
                {mostrarDropdown && (
                  <ul className="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg text-black font-semibold z-50">
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => setFiltro("Todos")}
                    >
                      Todos
                    </li>
                    {categorias.map((cat) => (
                      <li
                        key={cat}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => setFiltro(cat)}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Avatar */}
          <img
            src="https://i.pinimg.com/736x/b1/b3/8d/b1b38d3a6d168fb170365e9106be9c9f.jpg"
            alt="imagem do usuário"
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Mobile Menu */}
        <button onClick={open} className="lg:hidden p-2 rounded-md text-white ">
          <Menu size={28} />
        </button>

        {/* Sidebar Mobile */}
        {showSidebar && (
          <div
            className={`fixed inset-0 z-50 flex bg-black/50 transition-opacity duration-300 ${
              openSidebar ? "opacity-100" : "opacity-0"
            }`}
          >
            <aside
              className={`bg-white w-[250px] h-full p-6 flex flex-col justify-between transform transition-transform duration-300 ${
                openSidebar ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex flex-col gap-4">
                <button
                  onClick={close}
                  className="self-end text-gray-600 hover:text-primary"
                >
                  ✕
                </button>

                <img
                  src="https://i.pinimg.com/736x/b1/b3/8d/b1b38d3a6d168fb170365e9106be9c9f.jpg"
                  alt="imagem do usuário"
                  className="w-32 h-32 mx-auto border-2 border-primary rounded-full mt-4"
                />
              </div>

              <div className="flex flex-col gap-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar por nome ou marca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-full p-2 pr-10 pl-3 text-black outline-none border-2 border-primary"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-search absolute right-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none"
                  >
                    <path d="m21 21-4.34-4.34" />
                    <circle cx="11" cy="11" r="8" />
                  </svg>
                </div>

                <button
                  onClick={abrirModalAdicionar}
                  className="bg-primary p-2 px-3 text-white rounded-full flex justify-between items-center"
                >
                  Novo Produto <Plus size={20} />
                </button>

                <button
                  onClick={() => setMostrarDropdown((v) => !v)}
                  className="bg-primary p-2 px-3 border-2 border-white text-white rounded-full flex justify-between items-center w-full"
                >
                  Filtrar Categoria <ChevronDown size={20} />
                </button>

                {mostrarDropdown && (
                  <ul className="flex flex-col mt-2 w-full bg-white rounded-md shadow-lg text-black font-semibold z-50">
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => setFiltro("Todos")}
                    >
                      Todos
                    </li>
                    {categorias.map((cat) => (
                      <li
                        key={cat}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => setFiltro(cat)}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="text-black/30 mt-4 text-center">
                <i>
                  11/08/2024 <br />
                  "Tu te tornas eternamente responsável por aquilo que cativas"
                </i>
              </p>
            </aside>
          </div>
        )}
      </div>

      {/* ---------------- Main Grid ---------------- */}
      <main className="flex gap-4 flex-wrap max-w-[1215px] m-auto">
        {loading ? (
          <div className="col-span-full text-center text-gray-700">
            Carregando...
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            Nenhum produto encontrado.
          </div>
        ) : (
          produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              className="bg-white w-[270px] min-h-[455px] justify-between p-4 rounded-2xl flex flex-col gap-3 shadow-md border border-gray-200 m-auto"
            >
              <div className="w-full h-[180px] bg-[#eda865] rounded-lg flex items-center justify-center">
                {produto.imagem ? (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 italic">Sem imagem</span>
                )}
              </div>
              <h2 className="text-[18px] font-bold">{produto.nome}</h2>
              <p className="text-gray-600">
                {produto.descricao || "Sem descrição"}
              </p>
              <p className="text-purple-600">
                {produto.categoria || "Sem categoria"}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => abrirModalEditar(produto)}
                  className="flex-grow bg-green-600 hover:bg-green-700 text-white rounded-md py-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluirProduto(produto)}
                  className="flex-grow bg-red-600 hover:bg-red-700 text-white rounded-md py-2"
                >
                  Excluir
                </button>
                <button
                  onClick={() => abrirModalVisualizar(produto)}
                  className="flex-grow bg-[#eda865] hover:bg-[#e39346] text-white rounded-md py-2"
                >
                  Visualizar
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* ---------------- Modais ---------------- */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-xl">
            <h2 className="text-2xl font-bold mb-4">
              {modalModo === "adicionar"
                ? "Adicionar Produto"
                : "Editar Produto"}
            </h2>
            <input
              name="nome"
              placeholder="Nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-2"
            />
            <textarea
              name="descricao"
              placeholder="Descrição"
              value={form.descricao}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-2"
              rows={3}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setForm((prev) => ({ ...prev, imagem: reader.result }));
                  };
                  reader.readAsDataURL(file); // converte para Base64
                }
              }}
              className="w-full border p-2 rounded mb-2"
            />

            {/* <input
              name="imagem"
              placeholder="URL da Imagem"
              value={form.imagem}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-2"
            /> */}

            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            >
              {categorias.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex justify-between sm:justify-end gap-2 w-full ">
              <button
                onClick={fecharModal}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={salvarProduto}
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {modalModo === "adicionar" ? "Adicionar" : "Salvar"}
              </button>
            </div>
            <button
              onClick={fecharModal}
              className="absolute top-3 right-3 text-2xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}

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
              <div className="text-gray-400 text-center italic mb-4">
                Sem imagem disponível
              </div>
            )}
            <p>
              <span className="font-semibold">Descrição: </span>
              {produtoVisualizar.descricao || "Sem descrição"}
            </p>
            <p>
              <span className="font-semibold">Categoria: </span>
              {produtoVisualizar.categoria || "Sem categoria"}
            </p>
            <p className="text-sm text-gray-500">
              Criado em:{" "}
              {new Date(produtoVisualizar.criadoEm).toLocaleDateString()}
            </p>
            <button
              onClick={fecharModalVisualizar}
              className="absolute top-3 right-3 text-3xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
