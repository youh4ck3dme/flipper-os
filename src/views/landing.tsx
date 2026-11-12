import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Brain, CheckCircle2, Github, Lock, Share2, ShieldCheck, TrendingUp } from "lucide-react";
import { Mark } from "@/components/mark";
import { inputClass, Panel } from "@/components/ui";
import { eur, simulateAudit, type Audit } from "@/lib/model";
import { useOs } from "@/lib/store";

const GITHUB_RE = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/i;
const ANON_KEY = "flipper-anon-audit";

const STEPS = [
  "Načítavam repozitár",
  "Analyzujem DNA projektu",
  "Porovnávam s trhom",
  "Počítam exit cenu",
] as const;

const HOW = [
  { icon: Github, k: "Krok 1", t: "Vložte GitHub repo", d: "Iba verejné URL. Nikdy nesťahujeme ani neukladáme váš kód." },
  { icon: Brain, k: "Krok 2", t: "AI auditne DNA kódu", d: "Detegovaný stack, skóre zdravia kódu, tech dlh a refactor príležitosti." },
  { icon: TrendingUp, k: "Krok 3", t: "Získajte exit cenu", d: "Realistický rozsah ocenenia podporený násobiteľmi odvetvia a trhovými dátami." },
] as const;

const LOCKED = [
  "Detailné refactor tipy ktoré zvýšia váš násobiteľ",
  "Biznis stratégie ktoré kupujúci milujú",
  "Investorská PDF prezentácia (Roboto, EN/SK)",
  "Privátne CRM kupujúcich s AI cold-emailmi",
];

function normalizeGithub(raw: string) {
  return raw.trim().replace(/\.git\/?$/i, "").replace(/\/+$/, "");
}

function qualityLabel(score: number) {
  if (score >= 90) return "Čistý ako sklo";
  if (score >= 75) return "Solídny";
  if (score >= 60) return "Zmiešaný";
  if (score >= 45) return "Rubberdebt";
  return "Toxický";
}

function readStored(): Audit | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ANON_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { audit?: Audit };
    return parsed.audit ?? null;
  } catch {
    return null;
  }
}

async function downloadScore(audit: Audit) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#09080d";
  ctx.fillRect(0, 0, 1200, 630);
  ctx.fillStyle = "#c084fc";
  ctx.font = "600 28px sans-serif";
  ctx.fillText("Flipper OS", 72, 96);
  ctx.fillStyle = "#f4f1fb";
  ctx.font = "600 64px sans-serif";
  ctx.fillText(audit.name, 72, 210);
  ctx.font = "500 92px monospace";
  ctx.fillText(String(audit.health), 72, 340);
  ctx.fillStyle = "#b3adc4";
  ctx.font = "400 32px sans-serif";
  ctx.fillText(`${eur(audit.low)} – ${eur(audit.high)}`, 72, 420);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
  if (!blob) return;
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = `flipper-score-${audit.name}.png`;
  link.click();
  URL.revokeObjectURL(href);
}

export function Landing() {
  const saveAudit = useOs((s) => s.saveAudit);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [shareNote, setShareNote] = useState("");
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle");
  const [step, setStep] = useState(0);
  const [report, setReport] = useState<Audit | null>(null);
  const [anonUsed, setAnonUsed] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    document.title = "Akú hodnotu má vaše PWA? · GitHub Code Audit | Flipper OS";
    const stored = readStored();
    if (stored) {
      setAnonUsed(true);
      setReport(stored);
      setPhase("done");
      setUrl(stored.url);
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const id = "flipper-landing-ld";
    const existing = document.getElementById(id);
    const script = existing ?? document.createElement("script");
    script.id = id;
    script.setAttribute("type", "application/ld+json");
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Flipper OS",
      applicationCategory: "BusinessApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      description: "Bezplatné ocenenie pre PWA alebo micro-SaaS. Vložte verejný GitHub repo a získajte exit cenu.",
    });
    if (!existing) document.head.appendChild(script);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  useEffect(() => {
    if (!pending) return;
    const wait = reduce ? 280 : 1500;
    const timers = reduce
      ? []
      : [
          window.setTimeout(() => setStep(1), 350),
          window.setTimeout(() => setStep(2), 700),
          window.setTimeout(() => setStep(3), 1050),
        ];
    timers.push(
      window.setTimeout(() => {
        const audit = simulateAudit(pending);
        setReport(audit);
        setPhase("done");
        setAnonUsed(true);
        localStorage.setItem(ANON_KEY, JSON.stringify({ audit }));
        saveAudit(audit);
        setPending(null);
      }, wait),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [pending, reduce, saveAudit]);

  const applyUrl = (raw: string) => {
    const next = normalizeGithub(raw);
    setUrl(next);
    if (next.length === 0) setError("");
    else if (!GITHUB_RE.test(next)) setError("Vložte platnú verejnú GitHub URL (github.com/owner/repo).");
    else setError("");
    return next;
  };

  const run = (raw: string) => {
    const next = applyUrl(raw);
    if (!GITHUB_RE.test(next)) {
      setError("Vložte platnú verejnú GitHub URL (github.com/owner/repo).");
      return;
    }
    if (anonUsed) {
      setError("Využili ste bezplatný audit. V OS sú ďalšie audity v labáku.");
      return;
    }
    setError("");
    setShareNote("");
    setPhase("run");
    setStep(reduce ? 3 : 0);
    setPending(next);
  };

  const valid = GITHUB_RE.test(url);
  const mid = report ? Math.round((report.low + report.high) / 2) : 0;

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-3">
          <Mark />
          <div className="leading-tight">
            <p className="text-sm font-semibold">Flipper OS</p>
            <p className="text-xs text-muted">AI broker pre micro-SaaS</p>
          </div>
        </div>
        <Link
          to="/os"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg"
        >
          Otvoriť OS
          <ArrowRight className="size-4" />
        </Link>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-4 pb-20">
        <section className="space-y-6 pt-2 text-center md:pt-8">
          <p className="text-xs font-medium tracking-widest text-primary uppercase">AI Code Auditor · Prvý audit zdarma</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Akú hodnotu má vaše PWA <span className="text-primary">v skutočnosti?</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted">
            Vložte svoj verejný GitHub repozitár. Audit prečíta model kódu, porovná s trhom a povie realistickú exit cenu.
          </p>

          <form
            className="glass mx-auto max-w-2xl space-y-3 rounded-2xl p-4 text-left md:p-5"
            onSubmit={(event) => {
              event.preventDefault();
              run(url);
            }}
          >
            <label className="sr-only" htmlFor="repo">
              https://github.com/owner/repo
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="repo"
                type="url"
                inputMode="url"
                autoComplete="url"
                maxLength={300}
                value={url}
                placeholder="https://github.com/owner/repo"
                onChange={(event) => applyUrl(event.target.value)}
                onPaste={(event) => {
                  const text = event.clipboardData.getData("text");
                  if (!text) return;
                  event.preventDefault();
                  applyUrl(text);
                }}
                className={inputClass}
                aria-invalid={Boolean(error)}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="submit"
                disabled={phase === "run" || anonUsed || (url.length > 0 && !valid)}
                className="h-11 shrink-0 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-fg disabled:opacity-60"
              >
                {phase === "run" ? "Analyzujem…" : "Analyzovať môj repo"}
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-ok" />
                1 audit zdarma · bez registrácie
              </span>
              {anonUsed && phase !== "run" ? (
                <Link to="/os" className="text-primary">
                  Otvoriť OS pre ďalší audit
                </Link>
              ) : null}
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
          </form>

          {phase !== "run" && !report ? (
            <p className="text-xs tracking-widest text-muted uppercase">
              Code-aware ocenenia · Poháňané lokálnym modelom · Pre solo zakladateľov
            </p>
          ) : null}
        </section>

        {phase === "run" ? (
          <Panel className="space-y-3 text-left">
            <p className="text-xs font-medium tracking-widest text-primary uppercase">AI Code Auditor pracuje</p>
            <p className="text-sm text-muted">Číta DNA vášho repozitára…</p>
            <ol className="space-y-2">
              {STEPS.map((label, index) => (
                <li
                  key={label}
                  className={index <= step || reduce ? "glass-strong rounded-xl px-3 py-2 text-sm" : "rounded-xl px-3 py-2 text-sm text-muted"}
                >
                  {label}
                </li>
              ))}
            </ol>
          </Panel>
        ) : null}

        {report && phase !== "run" ? (
          <Panel className="space-y-5 text-left">
            <div className="text-center">
              <p className="text-xs font-medium tracking-widest text-primary uppercase">Odhadovaná exit hodnota</p>
              <p className="mt-2 font-mono text-5xl font-medium md:text-6xl">{eur(mid)}</p>
              <p className="mt-1 text-sm text-muted">
                {eur(report.low)} – {eur(report.high)}
              </p>
            </div>
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <p className="text-sm">
                  Zdravie kódu · {qualityLabel(report.health)}
                </p>
                <p className="font-mono text-sm">{report.health}</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-primary" style={{ width: `${report.health}%` }} />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {report.stack.map((item) => (
                <span key={item} className="glass-strong rounded-full px-2 py-1 text-xs">
                  {item}
                </span>
              ))}
            </div>
            <ul className="space-y-1 text-sm text-muted">
              {report.risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
            <div className="glass-strong space-y-2 rounded-xl p-4">
              <p className="inline-flex items-center gap-2 font-medium">
                <Lock className="size-4 text-primary" />
                Odomknite kompletný investičný report
              </p>
              <ul className="space-y-1 text-sm text-muted">
                {LOCKED.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-ok" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/os" className="inline-flex h-11 items-center text-sm font-medium text-primary">
                Otvoriť OS <ArrowRight className="ml-1 size-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="glass inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm"
                onClick={() => {
                  void downloadScore(report).then(() => setShareNote("Obrázok stiahnutý — zdieľajte na X alebo LinkedIne."));
                }}
              >
                <Share2 className="size-4" />
                Zdieľať moje skóre
              </button>
              <Link
                to="/os"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-fg"
              >
                Otvoriť OS
              </Link>
            </div>
            {shareNote ? <p className="text-sm text-muted">{shareNote}</p> : null}
            <p className="text-xs text-muted">Čísla auditu sú lokálny model z URL. Živý crawl GitHubu tu nie je napojený.</p>
          </Panel>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-center text-2xl font-semibold">Ako to funguje</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {HOW.map((item) => (
              <article key={item.k} className="glass rounded-2xl p-4 text-left">
                <item.icon className="size-5 text-primary" />
                <p className="mt-3 text-xs tracking-widest text-muted uppercase">{item.k}</p>
                <h3 className="mt-1 font-medium">{item.t}</h3>
                <p className="mt-1 text-sm text-muted">{item.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold">Pripravený predať svoje PWA?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
            Pokračujte v OS. Portfólio, trh a CRM sú v tom istom pracovnom priestore.
          </p>
          <Link
            to="/os"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-fg"
          >
            Otvoriť OS
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
