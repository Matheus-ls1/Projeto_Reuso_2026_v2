import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import ToastContainer from "./components/ui/Toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PDV from "./pages/PDV";
import Caixa from "./pages/Caixa";
import Produtos from "./pages/Produtos";
import Estoque from "./pages/Estoque";
import Fornecedores from "./pages/Fornecedores";
import PedidosCompra from "./pages/PedidosCompra";
import DashboardFinanceiro from "./pages/DashboardFinanceiro";
import ContasPagar from "./pages/ContasPagar";
import ContasReceber from "./pages/ContasReceber";
import Relatorios from "./pages/Relatorios";
import Avisos from "./pages/Avisos";
import Usuarios from "./pages/Usuarios";
import PermissoesModulos from "./pages/PermissoesModulos";
export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pdv" element={<PDV />} />
          <Route path="/caixa" element={<Caixa />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/pedidos" element={<PedidosCompra />} />
          <Route path="/financeiro" element={<DashboardFinanceiro />} />
          <Route path="/contas-pagar" element={<ContasPagar />} />
          <Route path="/contas-receber" element={<ContasReceber />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/avisos" element={<Avisos />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/permissoes" element={<PermissoesModulos />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
