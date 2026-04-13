"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { KineticHeading } from "@/components/landing/KineticHeading";
import { WHATSAPP_URL } from "@/lib/contact";

const sectionClass = "cinematic-section relative mx-auto w-full max-w-[90rem] px-5 py-24 md:px-10 md:py-36";

/** Captura ao vivo da página (substitui stock / IA). */
function sitePreviewImage(siteUrl: string, width = 1400) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(siteUrl)}?w=${width}`;
}

const timeline = [
  {
    year: "2025",
    title: "Pix Automático com IA",
    description: "Primeira plataforma de cobrança inteligente com IA integrada ao Pix Automático.",
  },
  {
    year: "2024",
    title: "Escala Nacional",
    description: "Sistema capaz de prever inadimplência e automatizar fluxos de caixa em tempo real.",
  },
  {
    year: "2023",
    title: "Fundação AIIDO",
    description: "Transformação de conhecimento teórico em máquina de resultados.",
  },
];

const portfolioCases = [
  {
    site: "masterclassic.com.br",
    name: "MasterClassic Seguros",
    coverSrc: sitePreviewImage("https://masterclassic.com.br/"),
    preview: "PreviewInsurtech",
    description:
      "Plataforma 100% digital de seguro de vida com simulação online, checkout integrado e atendimento 24h. +150 mil clientes e 35 anos de mercado digitalizados.",
    stack: ["React", "IA", "Checkout", "WhatsApp API"],
    metrics: ["150K+ Clientes", "+340% Conversão"],
    href: "https://masterclassic.com.br/",
  },
  {
    site: "www.rhiro.com.br",
    name: "Rhiro - Gente & Gestão",
    coverSrc: sitePreviewImage("https://www.rhiro.com.br/"),
    preview: "PreviewHRTech / IA",
    description:
      "Sistema inteligente de gestão de pessoas com IA. Automatiza recrutamento, onboarding, documentação digital, saúde mental NR-1 e desenvolvimento contínuo.",
    stack: ["IA", "NLP", "Dashboard", "Automação RH"],
    metrics: ["85% Redução Manual", "-60% Tempo Contratação"],
    href: "https://www.rhiro.com.br/",
  },
  {
    site: "www.maximatalents.com",
    name: "Maxima Talents",
    coverSrc: sitePreviewImage("https://www.maximatalents.com/"),
    preview: "PreviewAgencia / Plataforma",
    description:
      "Ecossistema digital completo para a maior agência de talentos de MG. Casting online, galeria interativa, método M.A.X.I.M.A e portal para empresas. +20 anos de mercado.",
    stack: ["React", "Galeria", "Casting", "CRM"],
    metrics: ["87+ Profissionais", "20+ Anos Mercado"],
    href: "https://www.maximatalents.com/",
  },
  {
    site: "www.educaiy.com.br",
    name: "Educaiy",
    coverSrc: sitePreviewImage("https://www.educaiy.com.br/"),
    preview: "PreviewEdTech / IA",
    description:
      "Plataforma de ensino com IA que personaliza trilhas de aprendizado. Tutor inteligente 24h, gamificação com XP e conquistas, certificados e biblioteca virtual.",
    stack: ["IA", "PWA", "Gamificação", "Tutor IA"],
    metrics: ["12+ Certificados", "24/7 Disponível"],
    href: "https://www.educaiy.com.br/",
  },
] as const;

export type PortfolioCaseItem = (typeof portfolioCases)[number];

export function ProblemSection() {
  return (
    <AnimatedSection id="pioneirismo" className={`${sectionClass} problem-trigger`}>
      <p className="bracket-label mb-6">[ Sobre mim ]</p>
      <KineticHeading
        as="h2"
        className="problem-title max-w-5xl text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-neutral-100"
      >
        Jhenni Nascimento
      </KineticHeading>
      <p className="mt-5 font-mono-ui text-xs uppercase tracking-[0.2em] text-neutral-500">Engenheira de Software - PUC - Google - IBM</p>
      <p className="mt-10 max-w-4xl text-xl leading-relaxed text-neutral-300 md:text-2xl">
        Eu projeto os sistemas que tornam a sua concorrência obsoleta.
      </p>
      <p className="mt-8 max-w-5xl text-lg leading-relaxed text-neutral-400 md:text-xl">
        Mente por trás da primeira IA de cobrança via Pix Automático do Brasil. Eu não entrego "tecnologia"; eu
        construo ativos digitais de alta escala para empresas que não aceitam a ineficiência.
      </p>
    </AnimatedSection>
  );
}

export function SolutionSection() {
  return (
    <AnimatedSection id="autoridade" className={sectionClass}>
      <p className="bracket-label mb-10 text-neutral-400">[ 2025 - Marco histórico ]</p>
      <KineticHeading
        as="h3"
        className="mb-10 max-w-4xl text-[clamp(1.8rem,4vw,3.3rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-white"
      >
        Se eu pude revolucionar o sistema financeiro, imagine o que posso fazer pelo seu negócio.
      </KineticHeading>
      <div className="grid gap-6 md:grid-cols-3">
        {timeline.map((item) => (
          <motion.article
            key={item.year}
            className="luxury-glass reactive-card rounded-lg p-8 md:p-10"
            whileHover={{ y: -4 }}
          >
            <p className="font-mono-ui text-xs uppercase tracking-[0.18em] text-neutral-500">{item.year}</p>
            <h4 className="mb-4 mt-3 text-2xl font-semibold tracking-tight text-neutral-100">{item.title}</h4>
            <p className="text-base leading-relaxed text-neutral-400">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </AnimatedSection>
  );
}

export function DemoFlow() {
  return null;
}

export function ComparisonSection() {
  return null;
}

export function CasesSection({ onOpenCase }: { onOpenCase: (item: PortfolioCaseItem) => void }) {
  return (
    <AnimatedSection id="portfolio" className={sectionClass}>
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="bracket-label mb-3">[ Cases de Sucesso ]</p>
          <KineticHeading
            as="h2"
            className="max-w-3xl text-[clamp(2rem,4vw,3.2rem)] font-semibold tracking-tight text-neutral-100"
          >
            Projetos que geram resultados reais.
          </KineticHeading>
          <p className="mt-4 max-w-3xl text-neutral-400">
            Cada projeto é um ativo digital construído para escalar, automatizar e dominar mercados.
          </p>
        </div>
      </div>

      <div className="grid gap-7 md:grid-cols-2">
        {portfolioCases.map((item) => (
          <motion.article
            key={item.site}
            role="button"
            tabIndex={0}
            data-cursor-label={item.name.toUpperCase()}
            className="portfolio-case-card luxury-glass reactive-card case-card project-card cursor-pointer rounded-lg"
            onClick={() => onOpenCase(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenCase(item);
              }
            }}
          >
            <div className="portfolio-card-mask overflow-hidden border border-white/10 bg-black/20">
              <div className="project-card-media relative aspect-[16/10] w-full">
                <img
                  className="project-card-image joseph-parallax-img h-full w-full object-cover object-top"
                  src={item.coverSrc}
                  alt={`Preview de ${item.name}`}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>
              <div className="p-7 md:p-9">
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-neutral-500">{item.site}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-100">{item.name}</h3>
                <p className="font-mono-ui mt-2 text-[11px] uppercase tracking-[0.18em] text-neutral-400">{item.preview}</p>
                <p className="mt-5 text-neutral-300">{item.description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {item.stack.map((tag) => (
                    <span key={tag} className="border border-white/12 px-3 py-1 font-mono-ui text-[10px] uppercase tracking-[0.14em] text-neutral-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  {item.metrics.map((metric) => (
                    <div key={metric} className="hero-kpi rounded-md px-4 py-3 text-sm font-medium text-neutral-200">
                      {metric}
                    </div>
                  ))}
                </div>

                <span className="interactive-target mt-7 inline-block border border-white/25 px-5 py-3 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-neutral-100">
                  Ver projeto
                </span>
              </div>
              <div className="portfolio-card-progress px-7 pb-5 md:px-9" aria-hidden>
                <span className="video-reel-progress-fill" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </AnimatedSection>
  );
}

export function ProcessSection() {
  return (
    <section id="aiido" className={`landing-content-section ${sectionClass} process-pin`}>
      <div data-parallax="0.1" className="process-step luxury-glass rounded-lg p-8 md:p-12 lg:p-14">
        <p className="bracket-label mb-6">[ Sócia-fundadora ]</p>
        <h3 className="mb-3 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-neutral-100">
          AIIDO - Engenharia de IA & Sistemas Inteligentes.
        </h3>
        <p className="font-mono-ui mb-6 text-xs uppercase tracking-[0.18em] text-neutral-300">aiido.com.br</p>

        <div className="relative mb-10 overflow-hidden rounded-xl border border-white/15 bg-black/50 shadow-[0_0_100px_rgba(0,0,0,0.35)]">
          <div className="relative h-[min(75vh,820px)] w-full">
            <iframe
              src="https://aiido.com.br/"
              title="AIIDO — pré-visualização ao vivo"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allow="fullscreen"
            />
          </div>
          <p className="border-t border-white/10 px-4 py-3 text-center font-mono-ui text-[10px] leading-relaxed text-neutral-500">
            Pré-visualização embutida do site. Se não carregar (política do domínio), abra em nova aba abaixo.
          </p>
        </div>

        <a
          href="https://aiido.com.br"
          target="_blank"
          rel="noreferrer"
          className="interactive-target mb-10 inline-block border border-white/25 px-5 py-3 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-neutral-100 transition hover:border-white/45"
        >
          Abrir aiido.com.br em nova aba
        </a>

        <p className="process-intro max-w-4xl text-lg leading-relaxed text-neutral-200">
          Como sócia-fundadora da AIIDO, transformei conhecimento em engenharia real. A AIIDO é especialista em pegar
          gargalos operacionais e transformar em fluxos automatizados com IA que rodam 24/7.
        </p>
        <p className="mt-7 max-w-5xl text-lg leading-relaxed text-neutral-300">
          Estruturação completa de empresas, automação total de processos, sistemas de IA personalizados, plataformas
          inteligentes e consultoria estratégica — tudo em um ecossistema projetado para escala global.
        </p>

        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {[
            "IA & Machine Learning",
            "Automação",
            "Engenharia de Software",
            "Consultoria",
          ].map((item) => (
            <div key={item} className="border border-white/12 bg-white/[0.04] px-4 py-3 font-mono-ui text-[11px] uppercase tracking-[0.14em] text-neutral-200">
              {item}
            </div>
          ))}
        </div>

        <blockquote className="mt-10 border-l border-white/25 pl-6 text-lg italic text-neutral-200">
          "Se pode ser mapeado, pode ser automatizado. Se gera dados, pode ser inteligente."
          <span className="mt-2 block font-mono-ui text-xs not-italic uppercase tracking-[0.15em] text-neutral-400">
            — Jhenni Nascimento, Sócia-fundadora
          </span>
        </blockquote>
      </div>
    </section>
  );
}

export function TechSection() {
  return (
    <AnimatedSection id="verticais" className={sectionClass}>
      <p className="bracket-label mb-8">[ Verticais de Impacto ]</p>
      <h3 className="mb-10 max-w-4xl text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-neutral-100">
        Inteligência Artificial funcional para quem busca o topo.
      </h3>

      <div className="grid gap-5 md:grid-cols-2">
        {[
          "Fintech & Pagamentos - Especialista na nova economia do Banco Central (Pix Automático).",
          "Insurtech & Segurança - Visão computacional preditiva e análise de risco por IA.",
          "EdTech & Fashion - Algoritmos de personalização e predição de tendências.",
          "Corporate Automation - Automações inteligentes para Fiscal, RH e Controladoria.",
        ].map((item) => (
          <motion.div key={item} className="luxury-glass reactive-card rounded-lg p-6 text-neutral-300" animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            {item}
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

export function ROISection() {
  return (
    <AnimatedSection id="stack" className={sectionClass}>
      <p className="bracket-label mb-8">[ O Diferencial ]</p>
      <h3 className="mb-6 max-w-4xl text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-neutral-100">
        Eu falo a língua do seu conselho administrativo.
      </h3>
      <p className="max-w-5xl text-lg leading-relaxed text-neutral-400">
        O grande erro dos desenvolvedores é não entender o DRE da empresa. Minha experiência sólida em Controladoria,
        Jurídico e RH me permite transitar entre o servidor e a mesa de diretoria.
      </p>

      <div className="mt-9 grid gap-3 md:grid-cols-3">
        {["ROI Mensurável", "Redução de Custos", "24/7 Monitoramento"].map((metric) => (
          <div key={metric} className="hero-kpi rounded-lg px-5 py-4 text-lg font-semibold text-neutral-200">
            {metric}
          </div>
        ))}
      </div>
      <p className="mt-5 text-xl font-medium text-neutral-200">Eu não vendo "funcionalidades", eu vendo ROI.</p>

      <p className="bracket-label mb-8 mt-16">[ Stack Estratégica ]</p>
      <h4 className="mb-7 text-2xl font-semibold text-neutral-100">Meu Arsenal Tecnológico.</h4>
      <div className="grid gap-5 md:grid-cols-2">
        {[
          "AI / ML Core - Python, Scikit-Learn, TensorFlow, LangChain.",
          "Computer Vision - OpenCV, YOLO, MediaPipe, OCR Avançado.",
          "Software Engineering - Arquitetura de APIs, SQL, Cloud (AWS/GCP).",
          "RPA & Automation - UiPath, Selenium, Integrações Customizadas.",
        ].map((stack) => (
          <div key={stack} className="luxury-glass reactive-card rounded-lg p-5 text-neutral-400">
            {stack}
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}

export function CTASection() {
  return (
    <AnimatedSection id="cta" className={`${sectionClass} text-center`}>
      <KineticHeading
        as="h2"
        className="cta-title mx-auto mb-8 max-w-5xl text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-neutral-100"
      >
        O futuro não espera por quem tem dúvidas.
      </KineticHeading>
      <p className="mx-auto mb-8 max-w-4xl text-lg text-neutral-400">
        O mercado de 2026 já está sendo dominado por quem implementou IA funcional ontem. Se você busca uma profissional
        que une a solidez da engenharia com a disrupção da inteligência artificial, você acaba de encontrar.
      </p>
      <p className="mx-auto mb-12 max-w-3xl font-mono-ui text-xs uppercase tracking-[0.18em] text-neutral-500">
        Disponibilidade limitada para novos projetos estratégicos.
      </p>
      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="cta-magnetic magnetic-btn interactive-target inline-block border border-white/25 bg-transparent px-10 py-4 font-mono-ui text-xs uppercase tracking-[0.22em] text-neutral-200"
      >
        FALAR DIRETAMENTE COM JHENNI
      </motion.a>
    </AnimatedSection>
  );
}
