import { useState, useRef, useEffect, type FormEvent, type ReactNode } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useI18n } from '../i18n/I18nProvider';
import { IconChat, IconClose, IconSend } from '../lib/icons';

// Ordre de secours : si le 1er est saturé (503), on essaie le suivant
const MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
];

const SYSTEM_PROMPT = `Tu es l'assistant personnel de RAKOTONIAINA Mirado, sur son portfolio.

=== COMPORTEMENT ===
- Si on te salue (bonjour, salut, hello, hi, etc.), réponds poliment et propose d'aider sur le parcours de Mirado.
- Tu peux faire de petites phrases de politesse (merci, à bientôt, avec plaisir).
- Tu parles en français, de façon claire, concise et professionnelle.
- Tu réponds surtout aux questions sur son parcours, compétences, projets, expériences et formation.
- Si la question est hors sujet, refuse poliment et recentre sur Mirado.

=== FORMAT DE RÉPONSE (IMPORTANT) ===
- N'utilise PAS de Markdown : pas de **gras**, pas de *italique*, pas de listes Markdown avec des astérisques.
- Écris en texte simple, avec des retours à la ligne.
- Pour les listes, utilise des tirets simples "-" ou des puces "•" en début de ligne.
- Réponses structurées et lisibles, 3 à 8 phrases ou une courte liste max.

=== PROFIL ===
- Nom : RAKOTONIAINA Mirado
- Statut : Étudiant en M1 Data & Intelligence Artificielle
- École : EMIT (École de Management et d'Innovation Technologique), Fianarantsoa
- Localisation : Antananarivo, Madagascar
- Email : miradorakoto111@gmail.com
- Téléphone : +261 34 57 344 84
- GitHub : https://github.com/M1rad0-rkt
- LinkedIn : https://www.linkedin.com/in/mirado-rakotoniaina-978523346
- Disponible pour stages et collaborations en Data & IA

=== FORMATION ===
- Master en Informatique — Parcours Data & IA (M1 en cours) — EMIT Fianarantsoa (2025 – en cours)
- Licence en Informatique — Université FJKM Ravelojaona Ampandrana (2022 – 2025)
- Baccalauréat Série D — Lycée Saint François Xavier Antanimena (2021 – 2022)

=== EXPÉRIENCES ===
1. Stagiaire projet — Autorités de Régulation des Marchés Publics (ARMP, Ministère de l'économie et de la finance) — en cours
   → Assistant de règlementation de l'ARMP & Chatbot de suivi sur l'utilisation des sites
2. Ideathon — Orange Digital Center & Ingedata — Data Challenge Inter-universitaire (2026)
   → Analyse de données et IA appliquée au marketing
3. Formation DevOps — Orange Digital Center (2026)
4. Stage de fin d'études — PixelVault (2024-2025)
   → Système de traitement des demandes clients avec analyse de satisfaction (React + Django + Tailwind + MySQL) → projet Clientelia
5. Stage — Ministère de la Jeunesse et du Sport (2022-2023)
6. Stage d'observation — Hôtel de Ville Analakely, DDNSI (2021-2022)

=== COMPÉTENCES ===
- Langages : Python, PHP, C, JavaScript
- Web : HTML5, CSS3, React/Vite, Django, Tailwind CSS
- Data science : Pandas, NumPy, Matplotlib, Scikit-learn, PyTorch, NLP, LLM
- Bases de données : PostgreSQL, MySQL, SQL
- BI : ETL/ELT, Power BI
- Outils : Git/GitHub, Trello, Docker

=== PROJETS ===
- Clientelia (projet phare) : plateforme gestion demandes clients + analyse satisfaction, JWT (React, Django, MySQL, Vite)
- Comptoir E-commerce : Boutique en ligne polyvalente conçue pour s'adapter à différents types de marchés. Stack moderne avec authentification JWT, catalogue produits et parcours d'achat. Accent sur la scalabilité et une API claire.(React, FastAPI, PostgreSQL)
- Assistant IA de Règlementation ARMP : RAG + LLM + NLP sur les textes des marchés publics (en cours / à venir)
- Chatbot IA ARMP : aide à l'inscription et à l'utilisation des sites ARMP (Python, TensorFlow, NLP)
- Tera-project : analyse qualité de l'air à Fianarantsoa (Python, Pandas, Streamlit, Matplotlib)
- Rice-disease-detection : détection de maladies du riz par vision (Python, PyTorch, Gradio)
- Rezerveo : réservation de lieux pour événements (PHP, MySQL, Bootstrap)
- GymGest : gestion de salle de sport (Python)
- Aktifitifitra : jeu 2D en Python + SQLite

=== PASSIONS ===
Machine Learning, Intelligence Artificielle, Guitare, Basket-ball, Chanter, Musculation

Réponds toujours en tant qu'assistant de Mirado, jamais comme Mirado lui-même ("Mirado a fait...", "Il maîtrise...").`;

const SUGGESTIONS_FR = [
  'Quel est son parcours ?',
  'Quels sont ses projets en IA ?',
  'Quelles compétences maîtrise-t-il ?',
  'Est-il disponible pour un stage ?',
];

const SUGGESTIONS_EN = [
  'What is his background?',
  'What are his AI projects?',
  'What skills does he have?',
  'Is he available for an internship?',
];

type Msg = { role: 'user' | 'assistant'; text: string };

function friendlyError(err: unknown): string {
  const msg = String((err as { message?: string })?.message || err || '');
  if (msg.includes('API_KEY') || msg.includes('API key') || msg.includes('401') || msg.includes('403')) {
    return 'Clé API invalide ou refusée. Vérifie VITE_GEMINI_API_KEY dans .env et relance npm run dev.';
  }
  if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
    return 'Quota API atteint. Réessaie plus tard ou crée une nouvelle clé sur aistudio.google.com/apikey.';
  }
  if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand')) {
    return 'Le modèle est saturé (forte demande). Réessaie dans quelques secondes.';
  }
  if (msg.includes('404') || msg.includes('not found') || msg.includes('no longer available')) {
    return 'Modèle indisponible. Le code va tenter un autre modèle au prochain essai.';
  }
  const short = msg.replace(/\[GoogleGenerativeAI.*?\]\s*/gi, '').slice(0, 180);
  return short || "Désolé, une erreur s'est produite. Réessaie dans un instant.";
}

async function generateWithFallback(apiKey: string, question: string, historyMessages: Msg[]) {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: unknown;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
      });

      const history = historyMessages
        .slice(1)
        .slice(-6)
        .map((m) => ({
          role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
          parts: [{ text: m.text }],
        }));
      while (history.length && history[0].role === 'model') history.shift();

      if (history.length === 0) {
        const result = await model.generateContent(question);
        return result.response.text();
      }

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(question);
      return result.response.text();
    } catch (err) {
      console.warn(`[Chatbot] Échec modèle ${modelName}:`, (err as Error)?.message || err);
      lastError = err;
      const m = String((err as Error)?.message || '');
      if (
        m.includes('404') ||
        m.includes('503') ||
        m.includes('UNAVAILABLE') ||
        m.includes('high demand') ||
        m.includes('no longer available') ||
        m.includes('not found')
      ) {
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

function MessageContent({ text }: { text: string }) {
  const lines = String(text || '').split('\n');
  return (
    <div className="chatbot__msg-body">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const content = isBullet ? trimmed.replace(/^[•\-*]\s*/, '') : line;

        const parts: ReactNode[] = [];
        const re = /\*\*(.+?)\*\*/g;
        let last = 0;
        let m: RegExpExecArray | null;
        let key = 0;
        while ((m = re.exec(content)) !== null) {
          if (m.index > last) parts.push(<span key={key++}>{content.slice(last, m.index)}</span>);
          parts.push(
            <strong key={key++}>{m[1]}</strong>,
          );
          last = m.index + m[0].length;
        }
        if (last < content.length) parts.push(<span key={key++}>{content.slice(last)}</span>);
        if (parts.length === 0 && content) parts.push(<span key={0}>{content}</span>);

        if (!trimmed) return <div key={i} className="chatbot__spacer" />;

        if (isBullet) {
          return (
            <div key={i} className="chatbot__bullet">
              <span aria-hidden="true">•</span>
              <span>{parts}</span>
            </div>
          );
        }
        return <p key={i}>{parts}</p>;
      })}
    </div>
  );
}

export function Chatbot() {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      text:
        lang === 'en'
          ? 'Hi! Ask me about Mirado’s background, projects or skills.'
          : 'Salut ! Pose-moi une question sur le parcours, les projets ou les compétences de Mirado.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open && window.matchMedia('(min-width: 640px)').matches) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const small = window.matchMedia('(max-width: 639px)');
    const vv = window.visualViewport;
    const previousOverflow = document.body.style.overflow;

    const fit = () => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (small.matches && vv) {
        dialog.style.height = `${vv.height}px`;
        dialog.style.top = `${vv.offsetTop}px`;
      } else {
        dialog.style.height = '';
        dialog.style.top = '';
      }
    };

    if (small.matches) document.body.style.overflow = 'hidden';
    fit();
    vv?.addEventListener('resize', fit);
    vv?.addEventListener('scroll', fit);
    window.addEventListener('resize', fit);
    return () => {
      vv?.removeEventListener('resize', fit);
      vv?.removeEventListener('scroll', fit);
      window.removeEventListener('resize', fit);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const suggestions = lang === 'en' ? SUGGESTIONS_EN : SUGGESTIONS_FR;

  const send = async (raw: string) => {
    const question = raw.trim();
    if (!question || loading) return;

    const prevMessages = messagesRef.current;
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            lang === 'en'
              ? 'Missing API key. Add VITE_GEMINI_API_KEY to your .env file and restart the dev server.'
              : 'Clé API manquante. Ajoute VITE_GEMINI_API_KEY dans ton fichier .env puis relance npm run dev.',
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      const text = await generateWithFallback(apiKey, question, prevMessages);
      setMessages((prev) => [...prev, { role: 'assistant', text }]);
    } catch (err) {
      console.error('[Chatbot]', err);
      setMessages((prev) => [...prev, { role: 'assistant', text: friendlyError(err) }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      <button
        type="button"
        className={`chatbot__fab ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? (lang === 'en' ? 'Close chat' : 'Fermer le chat') : lang === 'en' ? 'Open chat' : 'Ouvrir le chat'}
        aria-expanded={open}
      >
        {open ? <IconClose size={22} /> : <IconChat size={24} />}
      </button>

      {!open && (
        <button
          type="button"
          className="chatbot__hint"
          onClick={() => setOpen(true)}
          aria-label={lang === 'en' ? 'Open chat: any questions?' : 'Ouvrir le chat : une question ?'}
        >
          <svg viewBox="0 0 160 96" className="chatbot__hint-svg" aria-hidden="true">
            <path
              d="M34 62 A15 15 0 0 1 28 36 A17 17 0 0 1 52 16 A21 21 0 0 1 88 10 A18 18 0 0 1 120 20 A17 17 0 0 1 134 46 A16 16 0 0 1 118 66 A22 22 0 0 1 84 70 A22 22 0 0 1 56 68 A16 16 0 0 1 34 62 Z"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="none"
            />
            <ellipse cx="122" cy="82" rx="6" ry="4.5" strokeWidth="2" fill="none" />
            <ellipse cx="128" cy="92" rx="3.5" ry="2.8" strokeWidth="2" fill="none" />
          </svg>
          <span className="chatbot__hint-text">
            {lang === 'en' ? (
              <>
                Any questions?
                <br />
                Ask me!
              </>
            ) : (
              <>
                Une question ?
                <br />
                Demande-moi&nbsp;!
              </>
            )}
          </span>
        </button>
      )}

      {open && (
        <div ref={dialogRef} className="chatbot__panel" role="dialog" aria-label={lang === 'en' ? "Mirado's assistant" : 'Assistant de Mirado'}>
          <header className="chatbot__head">
            <span className="chatbot__avatar" aria-hidden="true">
              <IconChat size={20} />
            </span>
            <div className="chatbot__head-text">
              <strong>{lang === 'en' ? "Mirado's assistant" : 'Assistant de Mirado'}</strong>
              <span className="mono">{lang === 'en' ? 'Portfolio Q&A' : 'Questions portfolio'}</span>
            </div>
            <button
              type="button"
              className="icon-btn chatbot__close"
              onClick={() => setOpen(false)}
              aria-label={lang === 'en' ? 'Close' : 'Fermer'}
            >
              <IconClose size={18} />
            </button>
          </header>

          <div className="chatbot__messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot__bubble chatbot__bubble--${m.role}`}>
                <MessageContent text={m.text} />
              </div>
            ))}
            {loading && (
              <div className="chatbot__bubble chatbot__bubble--assistant chatbot__typing" aria-live="polite">
                <span />
                <span />
                <span />
              </div>
            )}
            {messages.length === 1 && !loading && (
              <div className="chatbot__suggestions">
                {suggestions.map((s) => (
                  <button key={s} type="button" className="chatbot__chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form className="chatbot__form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === 'en' ? 'Your question…' : 'Ta question…'}
              aria-label={lang === 'en' ? 'Your question' : 'Ta question'}
              disabled={loading}
            />
            <button type="submit" className="chatbot__send" disabled={loading || !input.trim()} aria-label={lang === 'en' ? 'Send' : 'Envoyer'}>
              <IconSend size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
