import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import imagemWlp from "./assets/imgs/momi.jpeg";

function Main() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula tempo de carregamento (ex: fetch de produtos)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // 2 segundos
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary">
        <img
          src={imagemWlp} // Coloque sua imagem na pasta public
          alt="Carregando..."
          className="rounded-md w-[300px] animate-pulse border-2 border-white"
        />
      </div>
    );
  }

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
