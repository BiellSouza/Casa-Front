import React from "react";

function Cards() {
  return (
    <div className="bg-white max-w-[300px] lg:max-w-[350px] p-4 rounded-2xl flex flex-col gap-3 shadow-md border border-gray-200 m-auto">
      <div className="w-full h-[180px] bg-[#eda865] rounded-lg" />

      <div className="p-1 text-start flex flex-col gap-2">
        <h1 className="text-[18px] font-bold text-black">Titulo do card</h1>
        <p className="text-[14px] text-gray-600 leading-snug">
          Subtitulo/ou Descrição explicando o produto ou o que quer que esteja
          salvo
        </p>
        <p className="text-purple-600 text-[14px] font-medium cursor-pointer">
          Categoria
        </p>
      </div>

      {/* Desktop */}
      <div className=" justify-between items-center gap-2 mt-2 hidden lg:flex">
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-full">
          Editar{" "}
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-pencil-icon lucide-pencil"
            >
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              <path d="m15 5 4 4" />
            </svg>
          </span>
        </button>

        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-full">
          Deletar{" "}
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-delete-icon lucide-delete"
            >
              <path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
              <path d="m12 9 6 6" />
              <path d="m18 9-6 6" />
            </svg>
          </span>
        </button>

        <button className="flex items-center gap-2 bg-[#eda865] hover:bg-[#e39346] text-white text-sm font-medium py-2 px-4 rounded-full">
          Visualizar
        </button>
      </div>

      {/* Mobile */}
      <div className="flex flex-col lg:hidden justify-between items-center gap-2 mt-2">
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-full w-full justify-center">
          Editar{" "}
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-pencil-icon lucide-pencil"
            >
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              <path d="m15 5 4 4" />
            </svg>
          </span>
        </button>

        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-full w-full justify-center">
          Deletar{" "}
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-delete-icon lucide-delete"
            >
              <path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
              <path d="m12 9 6 6" />
              <path d="m18 9-6 6" />
            </svg>
          </span>
        </button>

        <button className="flex items-center gap-2 bg-[#eda865] hover:bg-[#e39346] text-white text-sm font-medium py-2 px-4 rounded-full w-full justify-center">
          Visualizar
        </button>
      </div>
    </div>
  );
}

export default Cards;
