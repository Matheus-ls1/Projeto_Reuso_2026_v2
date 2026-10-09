import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("joao.alves@amtsolution.com.br");
    const [senha, setSenha] = useState("••••••••");
    const [showSenha, setShowSenha] = useState(false);
    const [recuperar, setRecuperar] = useState(false);
    const [recuperarEmail, setRecuperarEmail] = useState("");
    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/dashboard");
    };
    return (<div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--background)" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 rounded-full opacity-5" style={{ width: 600, height: 600, background: "var(--primary)" }}/>
        <div className="absolute -bottom-20 -left-20 rounded-full opacity-5" style={{ width: 400, height: 400, background: "var(--brand)" }}/>
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center rounded-2xl mb-4" style={{ width: 56, height: 56, background: "var(--brand)" }}>
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>AMT Solution</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>ERP para pequenos negócios</p>
        </div>

        {/* Card */}
        <div className="p-8" style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: "var(--foreground)" }}>Entrar na sua conta</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>E-mail</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }}/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg outline-none" style={{ border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} placeholder="seu@email.com.br"/>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Senha</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }}/>
                <input type={showSenha ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg outline-none" style={{ border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} placeholder="••••••••"/>
                <button type="button" onClick={() => setShowSenha(!showSenha)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }}>
                  {showSenha ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>
            <button type="button" onClick={() => setRecuperar(true)} className="text-xs text-right" style={{ color: "var(--primary)" }}>
              Esqueci minha senha
            </button>
            <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--muted-foreground)" }}>
          © 2026 AMT Solution. Todos os direitos reservados.
        </p>
      </div>

      <Modal open={recuperar} onClose={() => setRecuperar(false)} title="Recuperar senha" size="sm" footer={<>
            <Button variant="ghost" onClick={() => setRecuperar(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => setRecuperar(false)}>Enviar link</Button>
          </>}>
        <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
          Informe seu e-mail para receber um link de recuperação de senha.
        </p>
        <Input label="E-mail" type="email" value={recuperarEmail} onChange={(e) => setRecuperarEmail(e.target.value)} placeholder="seu@email.com.br"/>
      </Modal>
    </div>);
}
