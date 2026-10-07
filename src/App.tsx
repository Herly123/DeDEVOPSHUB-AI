/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TECHNICAL_DASHBOARD_CARDS,
  OWASP_CHECKLIST_ITEMS,
  PIPELINE_TEMPLATES,
  CODE_STANDARDS_LIST,
  TechnicalGuideCard,
} from './data/devopsPortalData';
import { DevAssistantWidget } from './components/DevAssistantWidget';
import { DeveloperAccessModal } from './components/DeveloperAccessModal';
import {
  Terminal,
  Copy,
  Check,
  Search,
  ChevronRight,
  Bot,
  Menu,
  X,
  CheckSquare,
  Square,
  FileCode2,
  ShieldAlert,
  GitBranch,
  Layers,
  BookOpen,
} from 'lucide-react';

export default function App() {
  const [selectedGuide, setSelectedGuide] = useState<TechnicalGuideCard>(
    TECHNICAL_DASHBOARD_CARDS[0]
  );
  const [activePipelineId, setActivePipelineId] = useState<string>(
    PIPELINE_TEMPLATES[0].id
  );
  const [checkedOwaspIds, setCheckedOwaspIds] = useState<string[]>(
    OWASP_CHECKLIST_ITEMS.filter((i) => i.defaultChecked).map((i) => i.id)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string | null>(null);
  const [isDevModalOpen, setIsDevModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [developerSession, setDeveloperSession] = useState<{
    name: string;
    role: string;
    environment: string;
  } | null>(null);

  const activePipeline =
    PIPELINE_TEMPLATES.find((p) => p.id === activePipelineId) ||
    PIPELINE_TEMPLATES[0];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 1800);
  };

  const toggleOwaspItem = (id: string) => {
    setCheckedOwaspIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const triggerAssistantWithQuestion = (question: string) => {
    setAssistantPrompt(question);
    setIsAssistantOpen(true);
  };

  const filteredStandards = CODE_STANDARDS_LIST.filter(
    (std) =>
      std.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.ruleId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const owaspProgressPercent = Math.round(
    (checkedOwaspIds.length / OWASP_CHECKLIST_ITEMS.length) * 100
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-[#F8FAFC]">
      {/* 1. HEADER: Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 h-16 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 px-6 lg:px-12 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#inicio"
          className="font-display text-lg font-extrabold tracking-tight text-white whitespace-nowrap"
        >
          DevOpsHub <span className="text-[#06B6D4]">AI</span>
        </a>

        {/* Zone 2: 4 Clean Navigation Links */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300"
        >
          <a
            href="#inicio"
            className="hover:text-[#06B6D4] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
          >
            Inicio
          </a>
          <a
            href="#estandares-codigo"
            className="hover:text-[#06B6D4] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
          >
            Estándares de Código
          </a>
          <a
            href="#cicd-pipelines"
            className="hover:text-[#06B6D4] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
          >
            CI/CD Pipelines
          </a>
          <a
            href="#documentacion-tecnica"
            className="hover:text-[#06B6D4] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
          >
            Documentación Técnica
          </a>
        </nav>

        {/* Zone 3: Primary Action ("Acceso Developer" + Mobile Menu Toggle) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDevModalOpen(true)}
            className="min-h-[40px] px-4 py-2 rounded-lg bg-[#06B6D4] hover:bg-[#22D3EE] text-[#0F172A] text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
          >
            {developerSession
              ? `${developerSession.name} · ${developerSession.environment}`
              : 'Acceso Developer'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[40px] min-w-[40px] rounded-lg bg-[#1E293B] border border-slate-700 text-slate-200 flex items-center justify-center cursor-pointer"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1E293B] border-b border-slate-700 px-6 py-4 space-y-3">
          <button
            type="button"
            onClick={() => scrollToSection('inicio')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-[#06B6D4]"
          >
            Inicio
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('estandares-codigo')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-[#06B6D4]"
          >
            Estándares de Código
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('cicd-pipelines')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-[#06B6D4]"
          >
            CI/CD Pipelines
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('documentacion-tecnica')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-[#06B6D4]"
          >
            Documentación Técnica
          </button>
        </div>
      )}

      {/* MAIN CONTAINER (1440px Desktop Presence) */}
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-16 space-y-20">
        {/* 2. HERO SECTION */}
        <section
          id="inicio"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
        >
          {/* Left Column: Title, Subtitle, CTAs & Engineering Metrics */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs text-[#06B6D4] font-mono">
              <span>Portal de Ingeniería de Sistemas</span>
              <span aria-hidden="true">·</span>
              <span>Arquitectura, DevSecOps & Automatización</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-white leading-[1.12] text-balance">
              Acelera tu Desarrollo con IA y Estándares de Ingeniería
            </h1>

            <p className="text-base text-slate-300 leading-relaxed max-w-[64ch]">
              Centraliza la documentación técnica de arquitectura de microservicios, buenas prácticas de código limpio, controles de ciberseguridad OWASP y plantillas automatizadas de despliegue CI/CD en un único entorno para desarrolladores.
            </p>

            {/* Primary & Secondary Hero Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('dashboard-tecnico')}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#06B6D4] hover:bg-[#22D3EE] text-[#0F172A] text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorar Guías</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAssistantOpen(true)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-100 border border-slate-700 text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Bot className="w-4 h-4 text-[#06B6D4]" />
                <span>Consultar Asistente</span>
              </button>
            </div>

            {/* Unboxed Engineering Key Figures */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800">
              <div>
                <p className="font-mono text-2xl font-bold text-white tabular-nums">
                  3 Módulos
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Arquitectura, OWASP y CI/CD
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-[#06B6D4] tabular-nums">
                  OWASP 10
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Controles verificables en código
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-white tabular-nums">
                  YAML / TS
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Plantillas listas para producción
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: VS Code / GitHub Style Interactive Architecture Inspector */}
          <div className="lg:col-span-6">
            <div className="bg-[#1E293B] border border-slate-700/90 rounded-2xl overflow-hidden shadow-2xl">
              {/* IDE Window Header */}
              <div className="px-4 py-3 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Terminal className="w-4 h-4 text-[#06B6D4] shrink-0" />
                  <span className="font-mono text-xs text-slate-200 truncate">
                    {selectedGuide.codeFilename}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    · {selectedGuide.category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopyCode(selectedGuide.id, selectedGuide.codeSnippet)
                  }
                  className="min-h-[32px] px-2.5 py-1 rounded-md bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {copiedSnippetId === selectedGuide.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copiar código</span>
                    </>
                  )}
                </button>
              </div>

              {/* File Switcher Tabs inside IDE */}
              <div className="px-4 py-2 bg-[#0F172A]/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
                {TECHNICAL_DASHBOARD_CARDS.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedGuide(card)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors whitespace-nowrap cursor-pointer ${
                      selectedGuide.id === card.id
                        ? 'bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/40 font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {card.number}. {card.codeFilename}
                  </button>
                ))}
              </div>

              {/* Code Content */}
              <div className="p-5 bg-[#0F172A]/80 overflow-x-auto">
                <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200">
                  <code>{selectedGuide.codeSnippet}</code>
                </pre>
              </div>

              {/* Bottom IDE Status Bar */}
              <div className="px-4 py-2.5 bg-[#0F172A] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-[#06B6D4]">UTF-8</span>
                  <span>·</span>
                  <span>{selectedGuide.codeLanguage.toUpperCase()}</span>
                  <span>·</span>
                  <span>Actualizado {selectedGuide.updatedAt}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    triggerAssistantWithQuestion(
                      `Explica paso a paso cómo implementar ${selectedGuide.title} según el archivo ${selectedGuide.codeFilename}`
                    )
                  }
                  className="text-xs font-semibold text-[#06B6D4] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Analizar con DevAssistant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DASHBOARD TÉCNICO: 3 Interactive Cards */}
        <section
          id="dashboard-tecnico"
          className="space-y-8 pt-8 border-t border-slate-800"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-[#06B6D4]">
                01. Acceso Rápido de Ingeniería de Sistemas
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                Dashboard Técnico de Arquitectura, Seguridad y CI/CD
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Selecciona cualquiera de los tres pilares técnicos para inspeccionar su especificación, código de referencia y controles operativos.
            </p>
          </div>

          {/* 3 Main Interactive Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TECHNICAL_DASHBOARD_CARDS.map((card) => {
              const isSelected = selectedGuide.id === card.id;
              return (
                <article
                  key={card.id}
                  onClick={() => setSelectedGuide(card)}
                  className={`bg-[#1E293B] rounded-2xl p-6 border transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#06B6D4] ring-1 ring-[#06B6D4]'
                      : 'border-slate-700/80 hover:border-slate-500'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Clean Unboxed Metadata */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#06B6D4]">
                          {card.number}.
                        </span>
                        <span>{card.category}</span>
                      </div>
                      <span className="font-mono tabular-nums">{card.readingTime}</span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white leading-snug">
                      {card.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {card.subtitle}
                    </p>

                    {/* Key Architectural Bullet Points */}
                    <ul className="space-y-2 pt-2 border-t border-slate-700/70 text-xs text-slate-300">
                      {card.summaryPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="font-mono text-[#06B6D4] mt-0.5">›</span>
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Footer Metrics & Action */}
                  <div className="pt-5 mt-6 border-t border-slate-700/70 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {card.metrics.map((m) => (
                        <div key={m.label}>
                          <span className="text-[11px] text-slate-400 block">
                            {m.label}
                          </span>
                          <span className="font-mono text-sm font-semibold text-white tabular-nums">
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGuide(card);
                          if (card.id === 'cicd') scrollToSection('cicd-pipelines');
                          else if (card.id === 'seguridad')
                            scrollToSection('documentacion-tecnica');
                          else scrollToSection('estandares-codigo');
                        }}
                        className="text-xs font-bold text-[#06B6D4] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Abrir módulo completo</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerAssistantWithQuestion(
                            `Dame una guía práctica sobre: ${card.title}`
                          );
                        }}
                        className="min-h-[34px] px-3 py-1 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Consultar IA
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 4. ESTÁNDARES DE CÓDIGO & ARQUITECTURA DE MICROSERVICIOS */}
        <section
          id="estandares-codigo"
          className="space-y-8 pt-8 border-t border-slate-800"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-[#06B6D4]">
                02. Buenas Prácticas de Desarrollo & Clean Code
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                Estándares de Código y Patrones de Microservicios
              </h2>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar regla (ej. STD-ARCH, logs, env)..."
                className="w-full min-h-[40px] pl-10 pr-4 py-2 rounded-xl bg-[#1E293B] border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#06B6D4]"
              />
            </div>
          </div>

          <div className="space-y-6">
            {filteredStandards.map((item) => (
              <div
                key={item.id}
                className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/70 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span className="text-[#06B6D4] font-semibold">
                        {item.ruleId}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.domain}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(item.id, item.goodExample)}
                    className="self-start sm:self-auto min-h-[36px] px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedSnippetId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#06B6D4]" />
                        <span>Estándar copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copiar implementación</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.rationale}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Anti-Pattern */}
                  <div className="bg-[#0F172A] border border-red-500/30 rounded-xl p-4 space-y-2">
                    <div className="text-xs font-mono text-red-400 flex items-center justify-between">
                      <span>Evitar (Anti-patrón)</span>
                      <span>No recomendado</span>
                    </div>
                    <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                      <code>{item.badExample}</code>
                    </pre>
                  </div>

                  {/* Recommended Pattern */}
                  <div className="bg-[#0F172A] border border-[#06B6D4]/40 rounded-xl p-4 space-y-2">
                    <div className="text-xs font-mono text-[#06B6D4] flex items-center justify-between">
                      <span>Estándar DevOpsHub AI (Producción)</span>
                      <span>Verificado</span>
                    </div>
                    <pre className="font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                      <code>{item.goodExample}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CI/CD PIPELINES: Interactive Templates (GitHub Actions, GitLab CI, Docker) */}
        <section
          id="cicd-pipelines"
          className="space-y-8 pt-8 border-t border-slate-800"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-[#06B6D4]">
                03. Automatización de Despliegues & Contenedores
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                Plantillas de CI/CD (GitHub Actions, GitLab CI & Docker)
              </h2>
            </div>

            {/* Segmented Platform Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#1E293B] border border-slate-700 rounded-xl">
              {PIPELINE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setActivePipelineId(tpl.id)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    activePipeline.id === tpl.id
                      ? 'bg-[#06B6D4] text-[#0F172A]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tpl.platform}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Pipeline Metadata & Stage Flow */}
            <div className="lg:col-span-5 bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#06B6D4]">
                  <GitBranch className="w-4 h-4" />
                  <span>{activePipeline.platform}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    Duración media: {activePipeline.avgDuration}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {activePipeline.name}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activePipeline.description}
                </p>
              </div>

              {/* Pipeline Stages Sequence */}
              <div className="space-y-2.5 pt-2 border-t border-slate-700/70">
                <span className="text-xs font-semibold text-slate-300 block">
                  Etapas de ejecución del Pipeline:
                </span>
                <div className="space-y-2">
                  {activePipeline.stages.map((stage, idx) => (
                    <div
                      key={stage}
                      className="px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[#06B6D4] tabular-nums">
                          0{idx + 1}.
                        </span>
                        <span className="font-mono text-slate-200">{stage}</span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[11px]">
                        Verificado
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  triggerAssistantWithQuestion(
                    `¿Cómo puedo personalizar la plantilla ${activePipeline.name} (${activePipeline.filename}) para incluir pruebas E2E y notificaciones en Slack?`
                  )
                }
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-[#06B6D4] border border-[#06B6D4]/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Personalizar este Pipeline con DevAssistant</span>
              </button>
            </div>

            {/* YAML Code Viewer */}
            <div className="lg:col-span-7 bg-[#1E293B] border border-slate-700/80 rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-[#06B6D4]" />
                  <span className="font-mono text-xs text-slate-200">
                    {activePipeline.filename}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopyCode(activePipeline.id, activePipeline.yamlContent)
                  }
                  className="min-h-[34px] px-3 py-1 rounded-lg bg-[#06B6D4] hover:bg-[#22D3EE] text-[#0F172A] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSnippetId === activePipeline.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Plantilla Copiada</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar YAML</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 bg-[#0F172A]/85 overflow-x-auto">
                <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200">
                  <code>{activePipeline.yamlContent}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* 6. DOCUMENTACIÓN TÉCNICA & CHECKLIST INTERACTIVO OWASP + SECCIÓN DEVASSISTANT */}
        <section
          id="documentacion-tecnica"
          className="space-y-8 pt-8 border-t border-slate-800"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive OWASP Top 10 Checklist (7 cols) */}
            <div className="lg:col-span-7 bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/70 pb-4">
                <div>
                  <p className="text-xs font-mono text-[#06B6D4]">
                    04. Auditoría Interactiva de Ciberseguridad
                  </p>
                  <h2 className="font-display text-2xl font-bold text-white mt-0.5">
                    Checklist de Ciberseguridad & OWASP
                  </h2>
                </div>

                <div className="text-left sm:text-right font-mono">
                  <span className="text-xs text-slate-400 block">
                    Cumplimiento de Auditoría
                  </span>
                  <span className="text-lg font-bold text-[#06B6D4] tabular-nums">
                    {checkedOwaspIds.length} / {OWASP_CHECKLIST_ITEMS.length} ({owaspProgressPercent}%)
                  </span>
                </div>
              </div>

              {/* Checklist Rows */}
              <div className="divide-y divide-slate-700/60">
                {OWASP_CHECKLIST_ITEMS.map((item) => {
                  const isChecked = checkedOwaspIds.includes(item.id);
                  return (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => toggleOwaspItem(item.id)}
                          className="flex items-start gap-3 text-left group cursor-pointer"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-[#06B6D4] shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400 group-hover:text-white shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                              <span className="text-[#06B6D4] font-semibold">
                                {item.code}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span
                                className={
                                  item.severity === 'Crítica'
                                    ? 'text-red-400'
                                    : item.severity === 'Alta'
                                    ? 'text-amber-400'
                                    : 'text-slate-300'
                                }
                              >
                                Severidad {item.severity}
                              </span>
                            </div>
                            <h3
                              className={`text-sm font-bold mt-0.5 ${
                                isChecked
                                  ? 'text-slate-300 line-through decoration-slate-500'
                                  : 'text-white'
                              }`}
                            >
                              {item.title}
                            </h3>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleCopyCode(item.id, item.remediationCode)
                          }
                          className="min-h-[32px] px-2.5 py-1 rounded-md bg-[#0F172A] hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono shrink-0 cursor-pointer"
                        >
                          {copiedSnippetId === item.id ? 'Copiado' : 'Copiar parche'}
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 pl-8 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pl-8">
                        <pre className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto">
                          <code>{item.remediationCode}</code>
                        </pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dedicated Section for DevAssistant Spotlight & Architecture Reference (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#1E293B] border border-[#06B6D4]/50 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/15 border border-[#06B6D4]/40 flex items-center justify-center text-[#06B6D4]">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#06B6D4]">
                        Copiloto de Ingeniería en Vivo
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        Asistente Técnico DevAssistant
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong>DevAssistant</strong> está disponible en todo momento como widget flotante en la esquina inferior derecha o directamente desde estas consultas rápidas de ingeniería:
                </p>

                <div className="space-y-2">
                  {[
                    'Diseñar topología de microservicios con API Gateway y Kafka',
                    'Auditar cabeceras de seguridad HTTP y políticas CORS en producción',
                    'Configurar despliegue Blue/Green en Kubernetes con GitHub Actions',
                    'Implementar trazabilidad distribuida con OpenTelemetry en Node.js',
                  ].map((promptText) => (
                    <button
                      key={promptText}
                      type="button"
                      onClick={() => triggerAssistantWithQuestion(promptText)}
                      className="w-full p-3 rounded-xl bg-[#0F172A] hover:bg-slate-800/90 border border-slate-800 hover:border-[#06B6D4]/50 text-left text-xs text-slate-200 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    >
                      <span className="leading-snug">{promptText}</span>
                      <ChevronRight className="w-4 h-4 text-[#06B6D4] shrink-0" />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsAssistantOpen(true)}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#06B6D4] hover:bg-[#22D3EE] text-[#0F172A] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Abrir Consola Flotante DevAssistant</span>
                </button>
              </div>

              {/* Architectural Reference Card */}
              <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#06B6D4]">
                  <Layers className="w-4 h-4" />
                  <span>Topología de Referencia Cloud-Native</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Capas de Estandarización DevOpsHub AI
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800">
                    <span className="font-mono text-[#06B6D4] font-semibold block">
                      Capa 01 · Edge & API Gateway
                    </span>
                    <span className="text-slate-300 mt-0.5 block">
                      Terminación TLS 1.3, WAF OWASP CRS, Rate Limiting por token y validación de esquemas.
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800">
                    <span className="font-mono text-[#06B6D4] font-semibold block">
                      Capa 02 · Malla de Microservicios
                    </span>
                    <span className="text-slate-300 mt-0.5 block">
                      Comunicación mTLS, Circuit Breakers, idempotencia transaccional y eventos desacoplados.
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800">
                    <span className="font-mono text-[#06B6D4] font-semibold block">
                      Capa 03 · Observabilidad & Entrega Continua
                    </span>
                    <span className="text-slate-300 mt-0.5 block">
                      Métricas Prometheus, logs JSON correlacionados y despliegue automatizado con rollback.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET FOOTER */}
      <footer className="border-t border-slate-800 bg-[#0F172A] py-8 px-6 lg:px-12 mt-12">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-white">
              DevOpsHub <span className="text-[#06B6D4]">AI</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Portal de Desarrolladores para Ingeniería de Sistemas</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#inicio"
              className="hover:text-[#06B6D4] transition-colors"
            >
              Inicio
            </a>
            <a
              href="#estandares-codigo"
              className="hover:text-[#06B6D4] transition-colors"
            >
              Estándares de Código
            </a>
            <a
              href="#cicd-pipelines"
              className="hover:text-[#06B6D4] transition-colors"
            >
              CI/CD Pipelines
            </a>
            <a
              href="#documentacion-tecnica"
              className="hover:text-[#06B6D4] transition-colors"
            >
              Documentación Técnica
            </a>
          </div>
        </div>
      </footer>

      {/* FLOATING DEVASSISTANT WIDGET */}
      <DevAssistantWidget
        isOpen={isAssistantOpen}
        onToggleOpen={setIsAssistantOpen}
        externalPrompt={assistantPrompt}
        onClearExternalPrompt={() => setAssistantPrompt(null)}
      />

      {/* DEVELOPER ACCESS MODAL */}
      <DeveloperAccessModal
        isOpen={isDevModalOpen}
        onClose={() => setIsDevModalOpen(false)}
        onAuthenticated={(profile) => setDeveloperSession(profile)}
      />
    </div>
  );
}


