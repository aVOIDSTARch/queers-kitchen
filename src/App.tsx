// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav } from "./components/nav/Nav";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import { HomePage } from "./pages/HomePage";
import { RecipesPage } from "./pages/RecipesPage";
import { RecipeDetailPage, AddRecipePage } from "./pages/RecipeDetailPage";
import "./styles/global.css";

// Inject Google Fonts
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Kaisei+Decol:wght@400;700&family=Shippori+Mincho:wght@400;500;600&family=JetBrains+Mono:wght@300;400&display=swap";
if (!document.querySelector(`link[href="${FONT_LINK}"]`)) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = FONT_LINK;
  document.head.appendChild(link);
}

// Set initial theme before first paint
(function () {
  const t = localStorage.getItem("qkc-theme") ?? "dark";
  document.documentElement.setAttribute("data-theme", t);
})();

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="page-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
          <Route path="/add" element={<AddRecipePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <ThemeToggle />
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div style={{ padding: "4rem 3.5rem" }}>
      <span className="eyebrow">404</span>
      <h1 className="section-heading">Page not found</h1>
    </div>
  );
}
