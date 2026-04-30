import { useCallback, useEffect, useMemo, useState } from "react";
import type { Lang, Phase } from "./data/content";
import {
  langPageHeadline,
  reflectionPrompts,
  teachingQuotes,
  topics,
  uiStrings,
} from "./data/content";
import { randomItem } from "./lib/random";

function panelClass(active: boolean): string {
  return active ? "panel panel--active" : "panel";
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("lang");
  const [lang, setLang] = useState<Lang | null>(null);
  const [reflectText, setReflectText] = useState("");
  const [teachingText, setTeachingText] = useState("");

  const copy = useMemo(() => (lang ? uiStrings[lang] : uiStrings.en), [lang]);

  useEffect(() => {
    document.documentElement.lang = copy.htmlLang;
    document.body.classList.toggle("lang-zh", lang === "zh");
    return () => {
      document.body.classList.remove("lang-zh");
    };
  }, [copy.htmlLang, lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  const selectLang = useCallback((next: Lang) => {
    setLang(next);
    setPhase("topic");
  }, []);

  const selectTopic = useCallback(
    (topicKey: string) => {
      if (!lang) return;
      const prompts = reflectionPrompts[lang][topicKey];
      const quotes = teachingQuotes[lang][topicKey];
      setReflectText(randomItem(prompts));
      setTeachingText(randomItem(quotes));
      setPhase("reflect");
    },
    [lang],
  );

  const goTeaching = useCallback(() => {
    setPhase("teaching");
  }, []);

  const restart = useCallback(() => {
    setLang(null);
    setReflectText("");
    setTeachingText("");
    setPhase("lang");
  }, []);

  const topicList = lang ? topics[lang] : [];

  const logoMaskUrl = `${import.meta.env.BASE_URL}tzu-chi-60-logo-mask.png`;

  return (
    <div className="page" aria-live="polite">
      <header className="brand" role="banner">
        <div
          className="brand__logo"
          role="img"
          aria-label="Buddhist Tzu Chi Foundation 60th anniversary emblem"
          style={{
            WebkitMaskImage: `url(${logoMaskUrl})`,
            maskImage: `url(${logoMaskUrl})`,
          }}
        />
      </header>

      <main className={`main ${phase === "lang" ? "" : "main--flow"}`.trim()} role="main">
        <section
          className={panelClass(phase === "lang")}
          data-phase="lang"
          aria-labelledby="lang-heading"
        >
          <h1 className="panel__title panel__title--lang" id="lang-heading">
            <span className="panel__title-line">{langPageHeadline.lineEn}</span>
            <span className="panel__title-line panel__title-line--zh">{langPageHeadline.lineZh}</span>
          </h1>
          <p className="panel__lead">{uiStrings.en.langLead}</p>
          <div className="actions actions--stack">
            <button type="button" className="btn btn--primary" onClick={() => selectLang("en")}>
              English
            </button>
            <button type="button" className="btn btn--secondary" onClick={() => selectLang("zh")}>
              中文
            </button>
            <button type="button" className="btn btn--secondary" onClick={() => selectLang("es")}>
              Español
            </button>
          </div>
        </section>

        <section
          className={panelClass(phase === "topic")}
          data-phase="topic"
          aria-labelledby="topic-heading"
        >
          <h1 className="panel__title" id="topic-heading">
            {copy.topicQ}
          </h1>
          <p className="panel__hint">{copy.topicHint}</p>
          <ul className="choices" role="list">
            {topicList.map((item) => (
              <li key={item.key}>
                <button type="button" className="choice-btn" onClick={() => selectTopic(item.key)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section
          className={panelClass(phase === "reflect")}
          data-phase="reflect"
          aria-labelledby="reflect-heading"
        >
          <h2 className="sr-only" id="reflect-heading">
            {copy.reflectSr}
          </h2>
          <p className="quote quote--prompt">{reflectText}</p>
          <div className="actions">
            <button type="button" className="btn btn--primary" onClick={goTeaching}>
              {copy.next}
            </button>
          </div>
        </section>

        <section
          className={panelClass(phase === "teaching")}
          data-phase="teaching"
          aria-labelledby="teaching-heading"
        >
          <p className="kicker">{copy.teachingKicker}</p>
          <h2 className="sr-only" id="teaching-heading">
            {copy.teachingSr}
          </h2>
          <blockquote className="quote quote--teaching">{teachingText}</blockquote>
          <div className="actions">
            <button type="button" className="btn btn--primary" onClick={restart}>
              {copy.restart}
            </button>
          </div>
        </section>
      </main>

      <footer className="foot" role="contentinfo">
        <p className="foot__line">{copy.foot}</p>
      </footer>
    </div>
  );
}
