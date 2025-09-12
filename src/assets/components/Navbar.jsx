import { useState } from "react";
import { Menu, Plus, ChevronDown } from "lucide-react";

function Navbar({ onNovoProduto, onFiltrar, onSearch }) {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const open = () => {
    setShowSidebar(true);
    setTimeout(() => setOpenSidebar(true), 10);
  };

  const close = () => {
    setOpenSidebar(false);
    setTimeout(() => setShowSidebar(false), 300);
  };

  // quando digita ou aperta Enter dispara a busca
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="w-full h-16 bg-secundary justify-between flex items-center px-4 rounded-[6px] mb-[36px] max-w-[1215px] m-auto bg-white/50">
      {/* Logo */}
      <h1 className="text-[26px] text-white">Nosso Sistema</h1>

      {/* Desktop */}
      <div className="hidden lg:flex gap-2">
        <div className="flex min-w-[600px] justify-evenly items-center">
          {/* Search */}
          <div className="relative w-[170px]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full rounded-full p-1 px-3 pr-8 text-black outline-none border-2 border-primary"
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

          {/* Ações */}
          <div className="flex gap-6">
            <button
              onClick={onNovoProduto}
              className="bg-primary p-1 px-3 text-white rounded-full flex w-[160px] justify-evenly items-center"
            >
              Novo Produto <Plus size={20} />
            </button>
            <button
              onClick={onFiltrar}
              className="bg-primary p-1 px-3 text-white rounded-full flex w-[175px] justify-evenly items-center"
            >
              Filtrar Categoria <ChevronDown size={20} />
            </button>
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
      <button
        onClick={open}
        className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200"
      >
        <Menu size={28} />
      </button>

      {/* Sidebar */}
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
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
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
                onClick={onNovoProduto}
                className="bg-primary p-2 px-3 text-white rounded-full flex justify-between items-center"
              >
                Novo Produto <Plus size={20} />
              </button>
              <button
                onClick={onFiltrar}
                className="bg-primary p-2 px-3 text-white rounded-full flex justify-between items-center"
              >
                Filtrar Categoria <ChevronDown size={20} />
              </button>
            </div>

            <p className="text-black/30">
              <i>
                11/08/2024 <br /> "Tu te tornas eternamente responsável por
                aquilo que cativas"
              </i>
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Navbar;
