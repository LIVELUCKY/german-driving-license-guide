/** Interactive sign-recognition quiz — React island, fully client-side */
import { useState, useCallback, useEffect, useRef } from 'react';

interface SignEntry {
  nd: string; ne: string; e: string; d: string; a?: string;
  no: string | null; img: string | null; drawn: string | null; url: string;
}

interface Props {
  lang?: 'en' | 'de' | 'ar';
  baseUrl?: string;
}

const UI = {
  en: {
    quiz: 'Sign quiz', start: 'Start quiz', again: 'New round',
    question: 'What does this sign mean?', reveal: 'Reveal answer',
    correct: 'Correct!', wrong: 'Nope —', skip: 'Skip',
    score: 'Score', done: 'Quiz complete!', next: 'Next',
    loading: 'Loading…', intro: 'Test yourself on German road signs.',
    perfect: '🏆 Perfect!', great: '⭐ Great!', good: '👍 Keep going!',
    redo: 'Redo wrong answers',
  },
  de: {
    quiz: 'Zeichen-Quiz', start: 'Quiz starten', again: 'Neue Runde',
    question: 'Was bedeutet dieses Zeichen?', reveal: 'Antwort zeigen',
    correct: 'Richtig!', wrong: 'Leider nein —', skip: 'Überspringen',
    score: 'Punkte', done: 'Quiz beendet!', next: 'Weiter',
    loading: 'Laden…', intro: 'Teste dein Wissen über Verkehrszeichen.',
    perfect: '🏆 Perfekt!', great: '⭐ Sehr gut!', good: '👍 Weiter üben!',
    redo: 'Falsche nochmal',
  },
  ar: {
    quiz: 'اختبار الإشارات', start: 'ابدأ الاختبار', again: 'جولة جديدة',
    question: 'ماذا تعني هذه الإشارة؟', reveal: 'اكشف الإجابة',
    correct: 'صحيح!', wrong: 'للأسف —', skip: 'تخطى',
    score: 'النتيجة', done: 'انتهى الاختبار!', next: 'التالي',
    loading: 'تحميل…', intro: 'اختبر نفسك على إشارات المرور الألمانية.',
    perfect: '🏆 مثالي!', great: '⭐ رائع!', good: '👍 استمر!',
    redo: 'أعد الأخطاء',
  },
};

const TOTAL = 10;
const LS_SEEN = 'fs_quiz_seen_v1';
const LS_WRONG = 'fs_quiz_wrong_v1';

function shuffle<T>(a: T[]): T[] {
  return [...a].sort(() => Math.random() - .5);
}

function lsGet(key: string): string[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function lsSet(key: string, val: string[]): void {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /**/ }
}

function label(s: SignEntry, lang: string): string {
  return lang === 'en' ? s.ne : s.nd; // German names for de + ar (test-relevant)
}

function track(event: string, params?: Record<string, unknown>) {
  try { (window as any).__fsTrack?.(event, params); } catch { /**/ }
}

function SignImg({ sign, base }: { sign: SignEntry; base: string }) {
  if (sign.img) {
    const src = sign.img.startsWith('/') ? base.replace(/\/$/, '') + sign.img : sign.img;
    return <img src={src} alt={sign.nd} width={96} height={96} style={{ objectFit: 'contain', display: 'block', width: 96, height: 96 }} />;
  }
  if (sign.drawn) {
    const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sign.drawn)}`;
    return <img src={src} alt={sign.nd} width={96} height={96} style={{ objectFit: 'contain', display: 'block', width: 96, height: 96 }} />;
  }
  return <span style={{ fontSize: 40 }}>❓</span>;
}

export default function SignQuiz({ lang = 'de', baseUrl = '/' }: Props) {
  const t = UI[lang as keyof typeof UI] ?? UI.de;
  const [allSigns, setAllSigns] = useState<SignEntry[]>([]);
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'done'>('idle');
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<null | boolean>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [options, setOptions] = useState<SignEntry[]>([]);
  const [deck, setDeck] = useState<SignEntry[]>([]);
  const [wrongCount, setWrongCount] = useState(() => lsGet(LS_WRONG).length);

  // Wrong IDs accumulated this session (to save on done)
  const sessionWrong = useRef<string[]>([]);

  const loadSigns = useCallback(async () => {
    if (allSigns.length > 0) return allSigns;
    setState('loading');
    try {
      const base = baseUrl.replace(/\/$/, '');
      const res = await fetch(`${base}/search-index.json`);
      const all: SignEntry[] = await res.json();
      const usable = all.filter(s => s.img || s.drawn);
      setAllSigns(usable);
      return usable;
    } catch { setState('idle'); return []; }
  }, [baseUrl, allSigns]);

  const buildDeck = useCallback((pool: SignEntry[], fromWrong = false): SignEntry[] => {
    if (fromWrong) {
      const wrong = new Set(lsGet(LS_WRONG));
      const wrongSigns = pool.filter(s => wrong.has(s.nd));
      return shuffle(wrongSigns).slice(0, TOTAL);
    }
    const seen = new Set(lsGet(LS_SEEN));
    let unseen = pool.filter(s => !seen.has(s.nd));
    if (unseen.length < TOTAL) {
      // All seen — silently reset and start fresh
      lsSet(LS_SEEN, []);
      unseen = pool;
    }
    return shuffle(unseen).slice(0, TOTAL);
  }, []);

  const startQuiz = useCallback(async (fromWrong = false) => {
    const pool = await loadSigns();
    if (!pool.length) return;
    const d = buildDeck(pool, fromWrong);
    if (!d.length) return;
    // Mark deck as seen
    if (!fromWrong) {
      const seen = lsGet(LS_SEEN);
      const updated = [...new Set([...seen, ...d.map(s => s.nd)])];
      lsSet(LS_SEEN, updated);
    }
    sessionWrong.current = [];
    setDeck(d);
    setIdx(0); setScore(0); setAnswered(null); setChosen(null);
    setState('playing');
    if (fromWrong) track('quiz_redo_start', { wrong_count: lsGet(LS_WRONG).length, lang });
    track('quiz_start', { mode: fromWrong ? 'redo_wrong' : 'new', lang });
  }, [loadSigns, buildDeck]);

  const makeOptions = useCallback((current: SignEntry, pool: SignEntry[]) => {
    const curLabel = label(current, lang);
    const others = shuffle(pool.filter(s => label(s, lang) !== curLabel)).slice(0, 3);
    return shuffle([current, ...others]);
  }, [lang]);

  useEffect(() => {
    if (state === 'playing' && deck.length > 0) {
      const pool = allSigns.length > 0 ? allSigns : deck;
      setOptions(makeOptions(deck[idx]!, pool));
      setAnswered(null); setChosen(null);
    }
  }, [idx, state, deck]); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = (opt: SignEntry) => {
    if (answered !== null || !deck[idx]) return;
    const cur = deck[idx]!;
    const correct = label(opt, lang) === label(cur, lang);
    setChosen(label(opt, lang));
    setAnswered(correct);
    track('quiz_answer', { correct: correct ? 1 : 0, sign: cur.no || cur.nd, lang });
    if (correct) {
      setScore(s => s + 1);
      // Remove from wrong list if they got it right this time
      const wrong = lsGet(LS_WRONG).filter(id => id !== cur.nd);
      lsSet(LS_WRONG, wrong);
      sessionWrong.current = sessionWrong.current.filter(id => id !== cur.nd);
    } else {
      // Add to wrong list
      const wrong = [...new Set([...lsGet(LS_WRONG), cur.nd])];
      lsSet(LS_WRONG, wrong);
      if (!sessionWrong.current.includes(cur.nd)) sessionWrong.current.push(cur.nd);
    }
  };

  const reveal = () => {
    if (answered !== null || !deck[idx]) return;
    const cur = deck[idx]!;
    track('quiz_reveal', { sign_id: cur.no || cur.nd, lang });
    setAnswered(false); setChosen(null);
    const wrong = [...new Set([...lsGet(LS_WRONG), cur.nd])];
    lsSet(LS_WRONG, wrong);
    if (!sessionWrong.current.includes(cur.nd)) sessionWrong.current.push(cur.nd);
  };

  const next = () => {
    if (idx + 1 >= deck.length) {
      const finalWrong = lsGet(LS_WRONG).length;
      setWrongCount(finalWrong);
      track('quiz_complete', { score, total: deck.length, lang, wrong_remaining: finalWrong });
      setState('done');
    } else {
      setIdx(i => i + 1);
    }
  };

  const feedbackMsg = () => {
    const pct = score / deck.length;
    if (pct === 1) return t.perfect;
    if (pct >= 0.7) return t.great;
    return t.good;
  };

  // ── styles ──
  const card: React.CSSProperties = {
    background: 'var(--surface)', border: '2px solid var(--line)',
    borderRadius: 8, padding: 'clamp(18px,3vw,28px)',
    boxShadow: 'var(--shadow-sm)', maxWidth: 600, margin: '0 auto',
  };
  const primaryBtn: React.CSSProperties = {
    display: 'inline-block', padding: '13px 24px', cursor: 'pointer',
    background: 'var(--ink)', color: 'var(--bg)', border: '2px solid var(--line)',
    fontFamily: 'var(--display)', fontSize: '.9rem', textTransform: 'uppercase' as const,
    letterSpacing: '.05em', fontWeight: 700, borderRadius: 4,
  };
  const optBtn = (isChosen: boolean, isCorrect: boolean, isWrong: boolean): React.CSSProperties => ({
    display: 'block', width: '100%', textAlign: 'left' as const,
    padding: '12px 16px', marginTop: 10, borderRadius: 6,
    cursor: answered !== null ? 'default' : 'pointer',
    border: `2px solid ${isCorrect ? 'rgba(0,168,107,.7)' : isWrong ? 'rgba(224,49,49,.7)' : 'var(--line)'}`,
    background: isCorrect ? 'rgba(0,168,107,.15)' : isWrong ? 'rgba(224,49,49,.15)' : isChosen ? 'var(--bg2)' : 'var(--surface)',
    color: 'var(--ink)', font: 'inherit', fontWeight: 600, fontSize: '.9rem',
    transition: 'background .15s, border-color .15s',
  });

  if (state === 'idle' || state === 'loading') return (
    <div style={card}>
      <h2 style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', marginBottom: 10 }}>{t.quiz}</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 18 }}>{t.intro}</p>
      {state === 'loading'
        ? <div style={{ color: 'var(--muted)', fontFamily: 'var(--display)', letterSpacing: '.05em' }}>{t.loading}</div>
        : <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            <button onClick={() => startQuiz(false)} style={primaryBtn}>{t.start}</button>
            {wrongCount > 0 && (
              <button onClick={() => startQuiz(true)} style={{ ...primaryBtn, background: 'var(--warn)', border: '2px solid var(--warn)' }}>
                {t.redo} ({wrongCount})
              </button>
            )}
          </div>
      }
    </div>
  );

  if (state === 'done') return (
    <div style={{ ...card, textAlign: 'center' as const }}>
      <div style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.3rem,4vw,2rem)', textTransform: 'uppercase', marginBottom: 8 }}>{t.done}</div>
      <div style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem,8vw,4rem)', color: 'var(--pop)', lineHeight: 1.1, margin: '12px 0 8px' }}>{score}/{deck.length}</div>
      <div style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '1.05rem' }}>{feedbackMsg()}</div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' as const }}>
        <button onClick={() => startQuiz(false)} style={primaryBtn}>{t.again}</button>
        {wrongCount > 0 && (
          <button onClick={() => startQuiz(true)} style={{ ...primaryBtn, background: 'var(--warn)', border: '2px solid var(--warn)' }}>
            {t.redo} ({wrongCount})
          </button>
        )}
      </div>
    </div>
  );

  const sign = deck[idx];
  if (!sign) return null;
  const correctLabel = label(sign, lang);

  return (
    <div style={card}>
      {/* progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ flex: 1, height: 6, background: 'var(--soft)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(idx / deck.length) * 100}%`, background: 'var(--pop)', transition: 'width .35s', borderRadius: 3 }} />
        </div>
        <span style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{idx + 1}/{deck.length}</span>
        <span style={{ fontSize: '.78rem', fontWeight: 800, color: 'var(--pop4)' }}>{t.score}: {score}</span>
      </div>

      {/* sign image */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <div style={{ background: 'var(--bg2)', border: '2px solid var(--soft)', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 140, height: 140 }}>
          <SignImg sign={sign} base={baseUrl} />
        </div>
      </div>

      {sign.no && <div style={{ textAlign: 'center', fontSize: '.68rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.08em' }}>StVO {sign.no}</div>}

      <p style={{ fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em', fontSize: '.85rem' }}>{t.question}</p>

      {options.map(opt => {
        const lbl = label(opt, lang);
        const isChosen = lbl === chosen;
        const isCorrect = answered !== null && lbl === correctLabel;
        const isWrong = isChosen && !isCorrect;
        return (
          <button key={lbl} onClick={() => answer(opt)} style={optBtn(isChosen, isCorrect && answered !== null, isWrong)}>
            {isCorrect && answered !== null ? '✓ ' : isWrong ? '✗ ' : ''}{lbl}
          </button>
        );
      })}

      {/* feedback */}
      {answered !== null && (
        <div style={{ marginTop: 14, padding: '11px 14px', background: answered ? 'rgba(0,168,107,.15)' : 'var(--bg2)', border: `2px solid ${answered ? 'rgba(0,168,107,.5)' : 'var(--line)'}`, borderRadius: 6, fontSize: '.9rem', color: 'var(--ink)' }}>
          {answered ? t.correct : `${t.wrong} ${correctLabel}`}
          {!answered && <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: 4 }}>{lang === 'de' ? sign.d : lang === 'ar' ? (sign.a || sign.e) : sign.e}</div>}
        </div>
      )}

      {/* actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        {answered === null && (
          <button onClick={reveal} style={{ ...optBtn(false,false,false), flex: 1, textAlign: 'center', background: 'var(--bg2)', cursor: 'pointer', marginTop: 0 }}>{t.reveal}</button>
        )}
        {answered !== null && (
          <button onClick={next} style={{ ...primaryBtn, flex: 1, textAlign: 'center', display: 'block', width: '100%' }}>
            {idx + 1 >= deck.length ? '→ ' + t.done : '→ ' + t.next}
          </button>
        )}
      </div>
    </div>
  );
}
