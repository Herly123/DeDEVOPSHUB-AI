import React, { useState } from 'react';
import { X, Terminal, KeyRound, Check, Copy, ShieldCheck } from 'lucide-react';

interface DeveloperAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (developerProfile: {
    name: string;
    role: string;
    environment: string;
  }) => void;
}

export const DeveloperAccessModal: React.FC<DeveloperAccessModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [email, setEmail] = useState('ingeniero.sistemas@devopshub.io');
  const [role, setRole] = useState('Staff Platform Engineer');
  const [environment, setEnvironment] = useState('produccion-eu-west');
  const [copiedCli, setCopiedCli] = useState(false);

  if (!isOpen) return null;

  const cliCommand = `npx @devopshub/cli login --sso --env=${environment}`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthenticated({
      name: email.split('@')[0] || 'dev.engineer',
      role,
      environment,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dev-access-title"
    >
      <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-[#06B6D4]" />
            <h3 id="dev-access-title" className="text-base font-bold text-white">
              Acceso Developer · SSO & Credenciales CLI
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            Inicia sesión con tu cuenta de Ingeniería de Sistemas para sincronizar plantillas de CI/CD, políticas OWASP y el contexto de tu clúster con <strong>DevAssistant</strong>.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="dev-email"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Correo Corporativo / Identificador Git
              </label>
              <input
                id="dev-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#0F172A] border border-slate-700 text-sm text-white font-mono focus:outline-none focus:border-[#06B6D4]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dev-role"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Rol de Ingeniería
                </label>
                <select
                  id="dev-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-[#0F172A] border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                >
                  <option value="Staff Platform Engineer">Staff Platform Engineer</option>
                  <option value="Arquitecto de Software">Arquitecto de Software</option>
                  <option value="Especialista DevSecOps">Especialista DevSecOps</option>
                  <option value="SRE / Cloud Engineer">SRE / Cloud Engineer</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="dev-env"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Entorno Activo
                </label>
                <select
                  id="dev-env"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-[#0F172A] border border-slate-700 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#06B6D4]"
                >
                  <option value="produccion-eu-west">produccion-eu-west</option>
                  <option value="staging-us-east">staging-us-east</option>
                  <option value="dev-sandbox-k8s">dev-sandbox-k8s</option>
                </select>
              </div>
            </div>
          </div>

          {/* Terminal CLI Snippet */}
          <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#06B6D4]" />
                Autenticación desde terminal (OIDC)
              </span>
              <button
                type="button"
                onClick={handleCopyCli}
                className="text-xs font-mono text-[#06B6D4] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedCli ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar comando</span>
                  </>
                )}
              </button>
            </div>
            <pre className="font-mono text-xs text-slate-200 overflow-x-auto">
              <code>$ {cliCommand}</code>
            </pre>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[42px] px-5 py-2 rounded-xl bg-[#06B6D4] hover:bg-[#22D3EE] text-[#0F172A] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Activar Sesión Developer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
