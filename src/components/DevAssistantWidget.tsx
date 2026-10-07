import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Terminal,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface DevAssistantWidgetProps {
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

const QUICK_PROMPTS = [
  '¿Cómo estructurar microservicios con Circuit Breaker?',
  'Dame un checklist OWASP para una API en Node.js',
  'Genera un pipeline GitHub Actions con escaneo Trivy',
  '¿Cómo configurar contenedores Docker sin usuario root?',
];

export const DevAssistantWidget: React.FC<DevAssistantWidgetProps> = ({
  isOpen,
  onToggleOpen,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: 'Hola, soy **DevAssistant**, tu asistente de Ingeniería de Sistemas en DevOpsHub AI. Puedo ayudarte a diseñar arquitecturas de microservicios, auditar controles OWASP Top 10 o generar pipelines CI/CD listos para producción.',
      timestamp: 'Ahora',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (externalPrompt) {
      onToggleOpen(true);
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  const handleSendMessage = async (promptText?: string) => {
    const query = (promptText ?? input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/dev-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text:
          data.reply ||
          'No se pudo procesar la consulta en este momento. Intenta de nuevo.',
        timestamp: new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        text: 'Se produjo un error de red al conectar con el motor de DevAssistant. Verifica la conexión del servidor local.',
        timestamp: new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: 'Sesión reiniciada. ¿Qué arquitectura de software, regla OWASP o pipeline CI/CD deseas revisar hoy?',
        timestamp: 'Ahora',
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button when closed */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            type="button"
            onClick={() => onToggleOpen(true)}
            className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#06B6D4] hover:bg-[#22D3EE] text-[#0F172A] font-semibold text-sm shadow-xl shadow-black/40 flex items-center gap-2.5 transition-transform duration-150 active:scale-[0.98] cursor-pointer"
            aria-label="Abrir asistente DevAssistant"
          >
            <Bot className="w-5 h-5 stroke-[2.2]" />
            <span className="whitespace-nowrap">DevAssistant IA</span>
          </button>
        </div>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <aside
          aria-label="Ventana de asistente técnico DevAssistant"
          className={`fixed z-50 transition-all duration-200 bg-[#1E293B] border border-slate-700/90 shadow-2xl shadow-black/60 flex flex-col overflow-hidden ${
            isExpanded
              ? 'bottom-4 right-4 left-4 top-20 md:left-auto md:w-[640px] md:h-[78vh] rounded-2xl'
              : 'bottom-4 right-4 left-4 sm:left-auto sm:w-[410px] h-[560px] max-h-[82vh] rounded-2xl'
          }`}
        >
          {/* Widget Header */}
          <div className="h-14 px-4 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/15 border border-[#06B6D4]/40 flex items-center justify-center text-[#06B6D4] shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-100 truncate">
                    DevAssistant
                  </h3>
                  <span className="text-[11px] font-mono text-[#06B6D4]">
                    · Activo
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  Copiloto de Arquitectura, OWASP y CI/CD
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleResetChat}
                className="min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Reiniciar conversación"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:flex min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 items-center justify-center transition-colors cursor-pointer"
                title={isExpanded ? 'Restaurar tamaño' : 'Expandir panel'}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onToggleOpen(false)}
                className="min-h-[36px] min-w-[36px] rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar DevAssistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Viewport */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0F172A]/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300">
                    {msg.role === 'user' ? 'Ingeniero' : 'DevAssistant'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#06B6D4] text-[#0F172A] font-medium'
                      : 'bg-[#1E293B] text-slate-200 border border-slate-700/80'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#06B6D4] animate-spin" />
                  <span>Analizando arquitectura y estándares...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Bar */}
          <div className="px-3 py-2 bg-[#0F172A]/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-md bg-[#1E293B] hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] whitespace-nowrap transition-colors shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0F172A] border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre microservicios, OWASP o YAML CI/CD..."
              className="flex-1 min-h-[40px] px-3.5 py-2 rounded-xl bg-[#1E293B] border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#06B6D4]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="min-h-[40px] min-w-[40px] px-3 rounded-xl bg-[#06B6D4] hover:bg-[#22D3EE] disabled:opacity-40 text-[#0F172A] font-semibold flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Enviar consulta"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </aside>
      )}
    </>
  );
};
