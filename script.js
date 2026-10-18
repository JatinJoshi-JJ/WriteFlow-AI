/**
 * AI Writing Analytics Studio (WriteFlow)
 * Master Client-Side Application Logic with Lenis Smooth Scrolling
 * Pure Vanilla JavaScript (ES6+)
 */

// Common English Stop Words for Keyword Filtering
const STOP_WORDS = new Set([
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "aren't",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can",
  "can't",
  "cannot",
  "could",
  "couldn't",
  "did",
  "didn't",
  "do",
  "does",
  "doesn't",
  "doing",
  "don't",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "hadn't",
  "has",
  "hasn't",
  "have",
  "haven't",
  "having",
  "he",
  "he'd",
  "he'll",
  "he's",
  "her",
  "here",
  "here's",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "how's",
  "i",
  "i'd",
  "i'll",
  "i'm",
  "i've",
  "if",
  "in",
  "into",
  "is",
  "isn't",
  "it",
  "it's",
  "its",
  "itself",
  "let's",
  "me",
  "more",
  "most",
  "mustn't",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "ought",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "shan't",
  "she",
  "she'd",
  "she'll",
  "she's",
  "should",
  "shouldn't",
  "so",
  "some",
  "such",
  "than",
  "that",
  "that's",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "there's",
  "these",
  "they",
  "they'd",
  "they'll",
  "they're",
  "they've",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "wasn't",
  "we",
  "we'd",
  "we'll",
  "we're",
  "we've",
  "were",
  "weren't",
  "what",
  "what's",
  "when",
  "when's",
  "where",
  "where's",
  "which",
  "while",
  "who",
  "who's",
  "whom",
  "why",
  "why's",
  "with",
  "won't",
  "would",
  "wouldn't",
  "you",
  "you'd",
  "you'll",
  "you're",
  "you've",
  "your",
  "yours",
  "yourself",
  "yourselves",
]);

// Common Filler Words & Phrases for Heuristic Detection
const FILLER_PATTERNS = [
  {
    word: "very",
    suggestion:
      'Try a stronger adjective (e.g., "brilliant" instead of "very smart").',
  },
  { word: "really", suggestion: "Often redundant; consider omitting it." },
  {
    word: "basically",
    suggestion: "Filler word; remove to increase authority.",
  },
  { word: "actually", suggestion: "Frequently unnecessary in formal writing." },
  { word: "literally", suggestion: "Ensure it is strictly accurate, or omit." },
  { word: "in order to", suggestion: 'Simplify to just "to".' },
  {
    word: "at the end of the day",
    suggestion: 'Cliche phrase; replace with "ultimately" or "in conclusion".',
  },
  {
    word: "due to the fact that",
    suggestion: 'Simplify to "because" or "since".',
  },
  { word: "for the purpose of", suggestion: 'Simplify to "for" or "to".' },
  {
    word: "kind of",
    suggestion: "Weakens statements; consider making a direct assertion.",
  },
  {
    word: "sort of",
    suggestion: "Weakens statements; consider making a direct assertion.",
  },
];

// Passive Voice Verb Patterns (Heuristic)
const PASSIVE_REGEX =
  /\b(am|is|are|was|were|be|been|being)\s+([a-z]+ed|[a-z]+en|written|done|made|built|chosen|seen|known|found|given|taken)\b/gi;

// Sample Editorial Text for Demonstration
const SAMPLE_TEXT = `Effective writing is not merely about conveying data; it is an art of clarity, empathy, and intellectual precision. In a world saturated with digital noise, concise prose cuts through ambiguity and resonates with readers across disciplines. 

When you craft an essay, an executive summary, or a technical white paper, every sentence should carry deliberate weight. Avoid unnecessary filler words and aim for active verbs that energize your argument. 

By analyzing sentence cadence, vocabulary diversity, and syllable structure, modern writers can refine their drafts into captivating narratives that inspire decisive action.`;

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const editor = document.getElementById("editorTextarea");
  const scrollProgressBar = document.getElementById("scrollProgress");
  const preloader = document.getElementById("preloader");
  const announcementBar = document.getElementById("announcementBar");
  const dismissAnnouncementBtn = document.getElementById(
    "dismissAnnouncementBtn",
  );

  // Theme & Navigation Elements
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeIconSun = document.getElementById("themeIconSun");
  const themeIconMoon = document.getElementById("themeIconMoon");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileNavPanel = document.getElementById("mobileNavPanel");

  // Editor Toolbar Elements
  const insertSampleBtn = document.getElementById("insertSampleBtn");
  const copyTextBtn = document.getElementById("copyTextBtn");
  const clearTextBtn = document.getElementById("clearTextBtn");
  const focusModeBtn = document.getElementById("focusModeBtn");
  const exitFocusBtn = document.getElementById("exitFocusBtn");
  const fontSizeSelect = document.getElementById("fontSizeSelect");
  const wordWrapBtn = document.getElementById("wordWrapBtn");

  // Confirmation Modal Elements
  const clearModal = document.getElementById("clearModal");
  const cancelClearBtn = document.getElementById("cancelClearBtn");
  const confirmClearBtn = document.getElementById("confirmClearBtn");

  // Core Statistics Display
  const statWords = document.getElementById("statWords");
  const statChars = document.getElementById("statChars");
  const statCharsNoSpaces = document.getElementById("statCharsNoSpaces");
  const statSentences = document.getElementById("statSentences");
  const statParagraphs = document.getElementById("statParagraphs");
  const statReadingTime = document.getElementById("statReadingTime");
  const statSpeakingTime = document.getElementById("statSpeakingTime");
  const statAvgWordLength = document.getElementById("statAvgWordLength");

  // Readability & Quality Elements
  const readabilityScoreEl = document.getElementById("readabilityScore");
  const readabilityLevelBadge = document.getElementById(
    "readabilityLevelBadge",
  );
  const readabilityProgressBar = document.getElementById(
    "readabilityProgressBar",
  );
  const avgSentenceLengthEl = document.getElementById("avgSentenceLength");
  const longSentencePctEl = document.getElementById("longSentencePct");
  const vocabularyVarietyEl = document.getElementById("vocabularyVariety");

  // Keyword Elements
  const excludeStopWordsCheckbox = document.getElementById(
    "excludeStopWordsCheckbox",
  );
  const keywordListEl = document.getElementById("keywordList");
  const keywordCloudEl = document.getElementById("keywordCloud");

  // Insights Elements
  const insightsListEl = document.getElementById("insightsList");
  const insightsCountBadge = document.getElementById("insightsCountBadge");

  // Goals Elements
  const goalInput = document.getElementById("goalInput");
  const goalProgressPct = document.getElementById("goalProgressPct");
  const goalProgressBar = document.getElementById("goalProgressBar");
  const goalRemainingWords = document.getElementById("goalRemainingWords");
  const goalSuccessBadge = document.getElementById("goalSuccessBadge");

  // Toast Notification Container
  const toastContainer = document.getElementById("toastContainer");

  // State
  let excludeStopWords = true;
  let wordGoal = 500;
  let isWordWrap = true;
  let hasShownCelebration = false;

  // 1. Initialize Lenis Smooth Scrolling (Seamless, Non-stuttering)
  let lenisInstance = null;
  if (typeof Lenis !== "undefined") {
    try {
      lenisInstance = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.0,
        infinite: false,
      });

      function raf(time) {
        if (lenisInstance) {
          lenisInstance.raf(time);
          requestAnimationFrame(raf);
        }
      }
      requestAnimationFrame(raf);

      // Connect scroll progress bar with Lenis
      lenisInstance.on("scroll", (e) => {
        if (!scrollProgressBar) return;
        const scrollTop = e.scroll;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgressBar.style.width = `${Math.min(scrolled, 100)}%`;
      });

      // Smooth scroll for anchor navigation links via Lenis
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          const targetId = anchor.getAttribute("href");
          if (targetId && targetId !== "#") {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              e.preventDefault();
              lenisInstance.scrollTo(targetEl, {
                offset: -65,
                duration: 1.1,
              });
              if (targetId === "#analyzer" && editor) {
                setTimeout(() => editor.focus(), 600);
              }
            }
          }
        });
      });
    } catch (err) {
      console.warn("Lenis initialization skipped:", err);
    }
  }

  // Fallback native scroll progress if Lenis not active
  if (!lenisInstance) {
    window.addEventListener("scroll", () => {
      if (!scrollProgressBar) return;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${Math.min(scrolled, 100)}%`;
    });
  }

  // 2. Preloader Removal
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("loaded");
    }, 250);
  }

  // 3. Announcement Bar Dismissal
  if (dismissAnnouncementBtn && announcementBar) {
    dismissAnnouncementBtn.addEventListener("click", () => {
      announcementBar.classList.add("hidden");
    });
  }

  // 4. Light / Dark Theme Management
  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add("dark");
      if (themeIconSun) themeIconSun.classList.remove("hidden");
      if (themeIconMoon) themeIconMoon.classList.add("hidden");
    } else {
      document.documentElement.classList.remove("dark");
      if (themeIconSun) themeIconSun.classList.add("hidden");
      if (themeIconMoon) themeIconMoon.classList.remove("hidden");
    }
    try {
      localStorage.setItem("writeflow_theme", isDark ? "dark" : "light");
    } catch (e) {
      // LocalStorage blocked
    }
  }

  // Initial Theme Setup
  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("writeflow_theme");
  } catch (e) {}

  if (savedTheme) {
    applyTheme(savedTheme === "dark");
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    applyTheme(true);
  } else {
    applyTheme(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.contains("dark");
      applyTheme(!isDark);
      showToast(`Switched to ${!isDark ? "Dark" : "Light"} theme`);
    });
  }

  // 5. Mobile Menu Toggle
  if (mobileMenuToggle && mobileNavPanel) {
    mobileMenuToggle.addEventListener("click", () => {
      const isOpen = mobileNavPanel.classList.toggle("open");
      mobileMenuToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close mobile nav on anchor click
    const mobileLinks = mobileNavPanel.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNavPanel.classList.remove("open");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 6. Toast Notification Helper
  function showToast(message, type = "info") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";

    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "warning") icon = "⚠️";
    if (type === "error") icon = "❌";

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // 7. Text Analysis Functions

  // Syllable Counter Heuristic for Flesch Reading Ease
  function countSyllablesInWord(word) {
    word = word.toLowerCase().trim();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, "");
    word = word.replace(/^y/, "");
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? Math.max(syllables.length, 1) : 1;
  }

  function countTotalSyllables(words) {
    return words.reduce((acc, word) => acc + countSyllablesInWord(word), 0);
  }

  // Master Text Analysis
  function analyzeText(rawText) {
    const text = rawText || "";

    // Characters
    const totalChars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;

    // Words
    const trimmed = text.trim();
    const words = trimmed
      ? trimmed.split(/\s+/).filter((w) => w.length > 0)
      : [];
    const totalWords = words.length;

    // Sentences
    // Matches sentences ending with . ! ? or end of text
    const sentences = trimmed
      ? trimmed.split(/[.!?]+(?:\s+|$)/).filter((s) => s.trim().length > 0)
      : [];
    const totalSentences = Math.max(sentences.length, totalWords > 0 ? 1 : 0);

    // Paragraphs
    const paragraphs = text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const totalParagraphs = paragraphs.length;

    // Average Word Length
    const avgWordLength =
      totalWords > 0 ? (charsNoSpaces / totalWords).toFixed(1) : "0.0";

    // Reading & Speaking Time
    // Standard reading: 225 wpm; Speaking: 145 wpm
    const readingMinutes = totalWords / 225;
    const speakingMinutes = totalWords / 145;

    function formatTime(min) {
      if (min === 0) return "0 min";
      if (min < 1) {
        const sec = Math.ceil(min * 60);
        return `${sec} sec`;
      }
      const rounded = Math.round(min * 10) / 10;
      return `${rounded} min`;
    }

    const readingTimeStr = formatTime(readingMinutes);
    const speakingTimeStr = formatTime(speakingMinutes);

    // Readability: Flesch Reading Ease
    let fleschScore = 0;
    let fleschGrade = "N/A";
    let fleschColorClass = "text-slate-400";

    if (totalWords > 0 && totalSentences > 0) {
      const totalSyllables = countTotalSyllables(words);
      const ASL = totalWords / totalSentences; // Average Sentence Length
      const ASW = totalSyllables / totalWords; // Average Syllables per Word

      const calculatedScore = 206.835 - 1.015 * ASL - 84.6 * ASW;
      fleschScore = Math.max(0, Math.min(100, Math.round(calculatedScore)));

      if (fleschScore >= 90) {
        fleschGrade = "Very Easy (5th Grade)";
        fleschColorClass = "text-emerald-500";
      } else if (fleschScore >= 80) {
        fleschGrade = "Easy (6th Grade)";
        fleschColorClass = "text-emerald-500";
      } else if (fleschScore >= 70) {
        fleschGrade = "Fairly Easy (7th Grade)";
        fleschColorClass = "text-teal-500";
      } else if (fleschScore >= 60) {
        fleschGrade = "Standard (8th-9th Grade)";
        fleschColorClass = "text-indigo-500";
      } else if (fleschScore >= 50) {
        fleschGrade = "Fairly Difficult (10th-12th Grade)";
        fleschColorClass = "text-amber-500";
      } else if (fleschScore >= 30) {
        fleschGrade = "Difficult (College)";
        fleschColorClass = "text-orange-500";
      } else {
        fleschGrade = "Very Difficult (Professional/Academic)";
        fleschColorClass = "text-rose-500";
      }
    }

    // Quality Metrics
    const avgWordsPerSentence =
      totalSentences > 0 ? (totalWords / totalSentences).toFixed(1) : "0.0";

    let longSentenceCount = 0;
    sentences.forEach((s) => {
      const sWords = s
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      if (sWords.length > 25) longSentenceCount++;
    });
    const longSentencePct =
      totalSentences > 0
        ? Math.round((longSentenceCount / totalSentences) * 100)
        : 0;

    // Unique Words & Vocabulary Variety (Type-Token Ratio)
    const normalizedWords = words
      .map((w) => w.toLowerCase().replace(/[^a-z0-9]/gi, ""))
      .filter((w) => w.length > 0);
    const uniqueWordSet = new Set(normalizedWords);
    const vocabularyVariety =
      totalWords > 0 ? Math.round((uniqueWordSet.size / totalWords) * 100) : 0;

    // Keyword Frequency Analysis
    const freqMap = new Map();
    normalizedWords.forEach((w) => {
      if (excludeStopWords && STOP_WORDS.has(w)) return;
      if (w.length < 2) return;
      freqMap.set(w, (freqMap.get(w) || 0) + 1);
    });

    const sortedKeywords = Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    // Smart Writing Insights Heuristics
    const insights = [];

    // 1. Long Sentence Check
    if (longSentenceCount > 0) {
      insights.push({
        title: `${longSentenceCount} Long Sentence${longSentenceCount > 1 ? "s" : ""} Detected`,
        explanation:
          "Sentences with more than 25 words can strain cognitive processing and reduce reader retention.",
        type: "warning",
        recommendation:
          "Break complex compound ideas into two shorter, punchier statements.",
      });
    }

    // 2. Filler Words Check
    const foundFillers = [];
    const lowerText = text.toLowerCase();
    FILLER_PATTERNS.forEach((fp) => {
      const regex = new RegExp(`\\b${fp.word}\\b`, "gi");
      const matches = lowerText.match(regex);
      if (matches && matches.length > 0) {
        foundFillers.push({
          word: fp.word,
          count: matches.length,
          tip: fp.suggestion,
        });
      }
    });

    if (foundFillers.length > 0) {
      const topFiller = foundFillers[0];
      insights.push({
        title: `Possible Filler Word: "${topFiller.word}" (${topFiller.count}x)`,
        explanation: topFiller.tip,
        type: "info",
        recommendation:
          "Trimming unnecessary qualifiers tightens your prose and adds crisp confidence.",
      });
    }

    // 3. Passive Voice Heuristic
    const passiveMatches = text.match(PASSIVE_REGEX) || [];
    if (passiveMatches.length > 0) {
      insights.push({
        title: `Potential Passive Construction (${passiveMatches.length})`,
        explanation: `Found phrases like "${passiveMatches.slice(0, 2).join('", "')}". Passive voice can obscure who is performing the action.`,
        type: "info",
        recommendation:
          "Whenever possible, place the active subject before the verb.",
      });
    }

    // 4. Vocabulary Diversity Check
    if (totalWords >= 50 && vocabularyVariety < 40) {
      insights.push({
        title: "Low Vocabulary Variety",
        explanation: `Your unique word ratio is ${vocabularyVariety}%. High word repetition can make text feel monotonous.`,
        type: "warning",
        recommendation: "Introduce synonyms or condense repetitive phrasing.",
      });
    } else if (totalWords >= 50 && vocabularyVariety >= 65) {
      insights.push({
        title: "Rich Vocabulary Variety",
        explanation: `Strong lexical diversity (${vocabularyVariety}% unique words).`,
        type: "success",
        recommendation:
          "Maintain this natural linguistic range throughout your draft.",
      });
    }

    // 5. Monolithic Paragraph Check
    const longParagraphs = paragraphs.filter(
      (p) => p.split(/\s+/).length > 130,
    );
    if (longParagraphs.length > 0) {
      insights.push({
        title: "Dense Paragraph Structure",
        explanation: `${longParagraphs.length} paragraph exceeds 130 words. Dense text walls discourage mobile skimmers.`,
        type: "warning",
        recommendation:
          "Introduce a paragraph break around major conceptual transitions.",
      });
    }

    return {
      totalChars,
      charsNoSpaces,
      totalWords,
      totalSentences,
      totalParagraphs,
      avgWordLength,
      readingTimeStr,
      speakingTimeStr,
      fleschScore,
      fleschGrade,
      fleschColorClass,
      avgWordsPerSentence,
      longSentencePct,
      vocabularyVariety,
      sortedKeywords,
      insights,
    };
  }

  // 8. Render Updates into UI
  function updateUI() {
    const rawText = editor ? editor.value : "";
    const stats = analyzeText(rawText);

    // Update Core Numbers
    if (statWords) statWords.textContent = stats.totalWords.toLocaleString();
    if (statChars) statChars.textContent = stats.totalChars.toLocaleString();
    if (statCharsNoSpaces)
      statCharsNoSpaces.textContent = stats.charsNoSpaces.toLocaleString();
    if (statSentences)
      statSentences.textContent = stats.totalSentences.toLocaleString();
    if (statParagraphs)
      statParagraphs.textContent = stats.totalParagraphs.toLocaleString();
    if (statReadingTime) statReadingTime.textContent = stats.readingTimeStr;
    if (statSpeakingTime) statSpeakingTime.textContent = stats.speakingTimeStr;
    if (statAvgWordLength)
      statAvgWordLength.textContent = `${stats.avgWordLength} ch`;

    // Update Readability
    if (readabilityScoreEl)
      readabilityScoreEl.textContent =
        stats.totalWords > 0 ? stats.fleschScore : "--";
    if (readabilityLevelBadge) {
      readabilityLevelBadge.textContent =
        stats.totalWords > 0 ? stats.fleschGrade : "Waiting for text";
      readabilityLevelBadge.className = `text-xs font-semibold px-2.5 py-1 rounded-full ${stats.totalWords > 0 ? stats.fleschColorClass : "text-slate-400"}`;
    }
    if (readabilityProgressBar) {
      readabilityProgressBar.style.width =
        stats.totalWords > 0 ? `${stats.fleschScore}%` : "0%";
    }
    if (avgSentenceLengthEl)
      avgSentenceLengthEl.textContent = `${stats.avgWordsPerSentence} words`;
    if (longSentencePctEl)
      longSentencePctEl.textContent = `${stats.longSentencePct}%`;
    if (vocabularyVarietyEl)
      vocabularyVarietyEl.textContent = `${stats.vocabularyVariety}%`;

    // Update Keywords List & Cloud
    renderKeywords(stats.sortedKeywords, stats.totalWords);

    // Update Insights List
    renderInsights(stats.insights, stats.totalWords);

    // Update Writing Goal
    updateGoalProgress(stats.totalWords);
  }

  // Render Keywords
  function renderKeywords(keywords, totalWords) {
    if (!keywordListEl || !keywordCloudEl) return;

    if (keywords.length === 0 || totalWords === 0) {
      keywordListEl.innerHTML = `
        <div class="text-xs text-slate-400 py-4 text-center">
          Start typing to discover frequent keywords and density distribution.
        </div>`;
      keywordCloudEl.innerHTML = `
        <div class="text-xs text-slate-400 py-3 text-center w-full">
          Keyword cloud will appear as content expands.
        </div>`;
      return;
    }

    // List rendering with density progress bars
    let listHTML = "";
    keywords.forEach(([word, count]) => {
      const density = ((count / totalWords) * 100).toFixed(1);
      listHTML += `
        <div class="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-sm">
          <div class="flex items-center space-x-2">
            <span class="font-medium text-slate-700 dark:text-slate-200 capitalize">${word}</span>
            <span class="text-xs text-slate-400">×${count}</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-16 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div class="bg-indigo-600 h-full rounded-full" style="width: ${Math.min(density * 10, 100)}%"></div>
            </div>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400 w-10 text-right">${density}%</span>
          </div>
        </div>`;
    });
    keywordListEl.innerHTML = listHTML;

    // Cloud rendering
    let cloudHTML = "";
    const maxCount = keywords[0][1];
    keywords.forEach(([word, count]) => {
      const scale = 0.85 + (count / maxCount) * 0.45;
      cloudHTML += `
        <button class="keyword-tag" data-word="${word}" style="font-size: ${scale.toFixed(2)}rem;" title="Click to copy '${word}'">
          <span>${word}</span>
          <span class="text-xs opacity-60">(${count})</span>
        </button>`;
    });
    keywordCloudEl.innerHTML = cloudHTML;

    // Attach click-to-copy handlers on keyword cloud items
    keywordCloudEl.querySelectorAll(".keyword-tag").forEach((tag) => {
      tag.addEventListener("click", () => {
        const word = tag.getAttribute("data-word");
        copyToClipboard(word, `Keyword "${word}" copied!`);
      });
    });
  }

  // Render Insights
  function renderInsights(insights, totalWords) {
    if (!insightsListEl) return;

    if (totalWords === 0) {
      if (insightsCountBadge) insightsCountBadge.textContent = "0";
      insightsListEl.innerHTML = `
        <div class="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          No insights yet. Type or paste your draft above to trigger real-time stylistic heuristics.
        </div>`;
      return;
    }

    if (insights.length === 0) {
      if (insightsCountBadge) insightsCountBadge.textContent = "0";
      insightsListEl.innerHTML = `
        <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-left flex items-start space-x-3">
          <span class="text-emerald-500 text-lg">✨</span>
          <div>
            <h4 class="text-xs font-bold text-emerald-800 dark:text-emerald-200">Writing Looks Sharp!</h4>
            <p class="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">No passive voice, overused fillers, or overly long sentences detected.</p>
          </div>
        </div>`;
      return;
    }

    if (insightsCountBadge) insightsCountBadge.textContent = insights.length;

    let html = "";
    insights.forEach((item) => {
      let badgeClass =
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300";
      let icon = "💡";
      if (item.type === "warning") {
        badgeClass =
          "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
        icon = "⚠️";
      } else if (item.type === "success") {
        badgeClass =
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
        icon = "🌟";
      }

      html += `
        <div class="insight-card">
          <div class="text-xl select-none">${icon}</div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100">${item.title}</h4>
              <span class="insight-badge ${badgeClass}">${item.type}</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-1.5">${item.explanation}</p>
            <div class="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center space-x-1">
              <span>👉</span>
              <span>${item.recommendation}</span>
            </div>
          </div>
        </div>`;
    });
    insightsListEl.innerHTML = html;
  }

  // Update Goal Progress
  function updateGoalProgress(currentWords) {
    if (!goalProgressBar || !goalProgressPct || !goalRemainingWords) return;

    const goal = Math.max(1, wordGoal);
    const pct = Math.min(100, Math.round((currentWords / goal) * 100));

    goalProgressPct.textContent = `${pct}%`;
    goalProgressBar.style.width = `${pct}%`;

    const remaining = Math.max(0, goal - currentWords);
    if (remaining === 0 && currentWords > 0) {
      goalRemainingWords.textContent = `Goal reached! (+${currentWords - goal} words)`;
      if (goalSuccessBadge) goalSuccessBadge.classList.remove("hidden");
      if (!hasShownCelebration && currentWords >= goal) {
        showToast(`🎉 Word goal of ${goal} words completed!`, "success");
        hasShownCelebration = true;
      }
    } else {
      goalRemainingWords.textContent = `${remaining} words remaining`;
      if (goalSuccessBadge) goalSuccessBadge.classList.add("hidden");
      hasShownCelebration = false;
    }
  }

  // 9. Event Listeners for Editor

  if (editor) {
    editor.addEventListener("input", updateUI);
  }

  // Insert Sample Text
  if (insertSampleBtn && editor) {
    insertSampleBtn.addEventListener("click", () => {
      editor.value = SAMPLE_TEXT;
      updateUI();
      showToast("Sample editorial text inserted", "success");
      editor.focus();
    });
  }

  // Copy to Clipboard with Graceful Fallback
  function copyToClipboard(
    textToCopy,
    successMsg = "Text copied to clipboard!",
  ) {
    if (!textToCopy) {
      showToast("Nothing to copy", "warning");
      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => showToast(successMsg, "success"))
        .catch(() => fallbackCopy(textToCopy, successMsg));
    } else {
      fallbackCopy(textToCopy, successMsg);
    }
  }

  function fallbackCopy(textToCopy, successMsg) {
    try {
      const tempTextarea = document.createElement("textarea");
      tempTextarea.value = textToCopy;
      tempTextarea.style.position = "fixed";
      tempTextarea.style.left = "-9999px";
      document.body.appendChild(tempTextarea);
      tempTextarea.focus();
      tempTextarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(tempTextarea);
      if (successful) {
        showToast(successMsg, "success");
      } else {
        showToast("Unable to copy text automatically", "error");
      }
    } catch (err) {
      showToast("Clipboard permission blocked", "error");
    }
  }

  if (copyTextBtn && editor) {
    copyTextBtn.addEventListener("click", () => {
      copyToClipboard(editor.value, "Full editor text copied to clipboard!");
    });
  }

  // Clear Text Modal Confirmation
  if (clearTextBtn && clearModal && editor) {
    clearTextBtn.addEventListener("click", () => {
      if (!editor.value.trim()) {
        showToast("Editor is already empty", "info");
        return;
      }
      clearModal.classList.add("active");
    });
  }

  if (cancelClearBtn && clearModal) {
    cancelClearBtn.addEventListener("click", () => {
      clearModal.classList.remove("active");
    });
  }

  if (confirmClearBtn && clearModal && editor) {
    confirmClearBtn.addEventListener("click", () => {
      editor.value = "";
      updateUI();
      clearModal.classList.remove("active");
      showToast("Editor cleared", "info");
      editor.focus();
    });
  }

  // Close modal when clicking outside box
  if (clearModal) {
    clearModal.addEventListener("click", (e) => {
      if (e.target === clearModal) clearModal.classList.remove("active");
    });
  }

  // Font Size Selector
  if (fontSizeSelect && editor) {
    fontSizeSelect.addEventListener("change", (e) => {
      const size = e.target.value;
      if (size === "sm") editor.style.fontSize = "0.9rem";
      else if (size === "lg") editor.style.fontSize = "1.2rem";
      else editor.style.fontSize = "1.05rem";
    });
  }

  // Word Wrap Toggle
  if (wordWrapBtn && editor) {
    wordWrapBtn.addEventListener("click", () => {
      isWordWrap = !isWordWrap;
      editor.style.whiteSpace = isWordWrap ? "pre-wrap" : "pre";
      editor.style.overflowX = isWordWrap ? "hidden" : "auto";
      wordWrapBtn.classList.toggle("text-indigo-600", isWordWrap);
      showToast(`Word wrap ${isWordWrap ? "enabled" : "disabled"}`);
    });
  }

  // Focus Mode Toggle
  if (focusModeBtn) {
    focusModeBtn.addEventListener("click", () => {
      document.body.classList.add("focus-mode");
      if (exitFocusBtn) exitFocusBtn.classList.remove("hidden");
      showToast("Focus Mode activated. Press Exit Focus to return.");
      if (editor) editor.focus();
    });
  }

  if (exitFocusBtn) {
    exitFocusBtn.addEventListener("click", () => {
      document.body.classList.remove("focus-mode");
      exitFocusBtn.classList.add("hidden");
      showToast("Exited Focus Mode");
    });
  }

  // Goal Input Change
  if (goalInput) {
    goalInput.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      wordGoal = isNaN(val) || val <= 0 ? 100 : val;
      updateUI();
    });
  }

  // Exclude Stop Words Checkbox
  if (excludeStopWordsCheckbox) {
    excludeStopWordsCheckbox.addEventListener("change", (e) => {
      excludeStopWords = e.target.checked;
      updateUI();
      showToast(
        excludeStopWords ? "Common stop words excluded" : "Showing all words",
      );
    });
  }

  // 10. FAQ Accordion Handling
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.closest(".accordion-item");
      const isActive = item.classList.contains("active");

      // Close all accordion items
      document
        .querySelectorAll(".accordion-item")
        .forEach((it) => it.classList.remove("active"));

      // If wasn't active, open it
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  // ==========================================================================
  // Gemini AI Features & Intelligence Hub
  // ==========================================================================

  const geminiPolishBtn = document.getElementById("geminiPolishBtn");
  const geminiToneDropdownBtn = document.getElementById(
    "geminiToneDropdownBtn",
  );
  const geminiToneMenu = document.getElementById("geminiToneMenu");
  const geminiSummaryBtn = document.getElementById("geminiSummaryBtn");
  const geminiHeadlinesBtn = document.getElementById("geminiHeadlinesBtn");
  const geminiContinueBtn = document.getElementById("geminiContinueBtn");
  const geminiKeyBtn = document.getElementById("geminiKeyBtn");

  // Modals
  const geminiResultModal = document.getElementById("geminiResultModal");
  const geminiModalTitle = document.getElementById("geminiModalTitle");
  const geminiResultContent = document.getElementById("geminiResultContent");
  const geminiReplaceBtn = document.getElementById("geminiReplaceBtn");
  const geminiInsertBtn = document.getElementById("geminiInsertBtn");
  const geminiCopyBtn = document.getElementById("geminiCopyBtn");
  const geminiCloseBtn = document.getElementById("geminiCloseBtn");

  const geminiKeyModal = document.getElementById("geminiKeyModal");
  const geminiApiKeyInput = document.getElementById("geminiApiKeyInput");
  const geminiSaveKeyBtn = document.getElementById("geminiSaveKeyBtn");
  const geminiClearKeyBtn = document.getElementById("geminiClearKeyBtn");
  const geminiCancelKeyBtn = document.getElementById("geminiCancelKeyBtn");

  let currentGeminiResult = "";

  // Tone Dropdown Toggle
  if (geminiToneDropdownBtn && geminiToneMenu) {
    geminiToneDropdownBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      geminiToneMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
      geminiToneMenu.classList.add("hidden");
    });

    document.querySelectorAll(".gemini-tone-opt").forEach((opt) => {
      opt.addEventListener("click", () => {
        const tone = opt.getAttribute("data-tone");
        executeGeminiAction("tone", tone);
      });
    });
  }

  // Action Button Listeners
  if (geminiPolishBtn) {
    geminiPolishBtn.addEventListener("click", () =>
      executeGeminiAction("polish"),
    );
  }
  if (geminiSummaryBtn) {
    geminiSummaryBtn.addEventListener("click", () =>
      executeGeminiAction("summary"),
    );
  }
  if (geminiHeadlinesBtn) {
    geminiHeadlinesBtn.addEventListener("click", () =>
      executeGeminiAction("headlines"),
    );
  }
  if (geminiContinueBtn) {
    geminiContinueBtn.addEventListener("click", () =>
      executeGeminiAction("continue"),
    );
  }

  // Key Modal Listeners
  if (geminiKeyBtn && geminiKeyModal && geminiApiKeyInput) {
    geminiKeyBtn.addEventListener("click", () => {
      const savedKey = localStorage.getItem("writeflow_gemini_key") || "";
      geminiApiKeyInput.value = savedKey;
      geminiKeyModal.classList.add("active");
    });
  }
  if (geminiCancelKeyBtn && geminiKeyModal) {
    geminiCancelKeyBtn.addEventListener("click", () =>
      geminiKeyModal.classList.remove("active"),
    );
  }
  if (geminiClearKeyBtn && geminiKeyModal && geminiApiKeyInput) {
    geminiClearKeyBtn.addEventListener("click", () => {
      localStorage.removeItem("writeflow_gemini_key");
      geminiApiKeyInput.value = "";
      geminiKeyModal.classList.remove("active");
      showToast("Gemini API key cleared. Using local smart engine.", "info");
    });
  }
  if (geminiSaveKeyBtn && geminiKeyModal && geminiApiKeyInput) {
    geminiSaveKeyBtn.addEventListener("click", () => {
      const keyVal = geminiApiKeyInput.value.trim();
      if (keyVal) {
        localStorage.setItem("writeflow_gemini_key", keyVal);
        showToast("Gemini API key saved successfully!", "success");
      } else {
        localStorage.removeItem("writeflow_gemini_key");
        showToast("Using local smart engine mode.", "info");
      }
      geminiKeyModal.classList.remove("active");
    });
  }

  // Modal Dialog Close & Replace Handlers
  if (geminiCloseBtn && geminiResultModal) {
    geminiCloseBtn.addEventListener("click", () =>
      geminiResultModal.classList.remove("active"),
    );
  }
  if (geminiResultModal) {
    geminiResultModal.addEventListener("click", (e) => {
      if (e.target === geminiResultModal)
        geminiResultModal.classList.remove("active");
    });
  }

  if (geminiReplaceBtn && editor) {
    geminiReplaceBtn.addEventListener("click", () => {
      if (currentGeminiResult) {
        editor.value = currentGeminiResult;
        updateUI();
        geminiResultModal.classList.remove("active");
        showToast("Text updated in editor with Gemini output!", "success");
        editor.focus();
      }
    });
  }

  if (geminiInsertBtn && editor) {
    geminiInsertBtn.addEventListener("click", () => {
      if (currentGeminiResult) {
        editor.value =
          (editor.value.trim() ? editor.value.trim() + "\n\n" : "") +
          currentGeminiResult;
        updateUI();
        geminiResultModal.classList.remove("active");
        showToast("Gemini output appended to editor!", "success");
        editor.focus();
      }
    });
  }

  if (geminiCopyBtn) {
    geminiCopyBtn.addEventListener("click", () => {
      if (currentGeminiResult) {
        copyToClipboard(
          currentGeminiResult,
          "Gemini output copied to clipboard!",
        );
      }
    });
  }

  // Master Action Executor (Live API with Local Smart Engine Fallback)
  async function executeGeminiAction(actionType, option = null) {
    const rawText = editor ? editor.value.trim() : "";
    if (!rawText) {
      showToast("Please type or insert some text first!", "warning");
      if (editor) editor.focus();
      return;
    }

    // Titles setup
    let actionTitle = "Gemini AI Assistant";
    if (actionType === "polish")
      actionTitle = "✨ Gemini AI: Polished & Refined Prose";
    else if (actionType === "tone")
      actionTitle = `🎭 Gemini AI: ${option ? option.charAt(0).toUpperCase() + option.slice(1) : ""} Tone Rewrite`;
    else if (actionType === "summary")
      actionTitle = "📋 Gemini AI: Executive TL;DR Summary";
    else if (actionType === "headlines")
      actionTitle = "💡 Gemini AI: Catchy Headlines & Hooks";
    else if (actionType === "continue")
      actionTitle = "✍️ Gemini AI: Story Continuation";

    if (geminiModalTitle) geminiModalTitle.textContent = actionTitle;
    if (geminiResultContent) {
      geminiResultContent.innerHTML = `
        <div class="py-10 text-center space-y-3">
          <div class="gemini-loading-spinner mx-auto"></div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Gemini 1.5 Flash is analyzing your text...</p>
        </div>`;
    }
    if (geminiResultModal) geminiResultModal.classList.add("active");

    const apiKey = localStorage.getItem("writeflow_gemini_key") || "";
    let resultText = "";

    if (apiKey) {
      try {
        resultText = await callLiveGeminiAPI(
          apiKey,
          actionType,
          option,
          rawText,
        );
      } catch (err) {
        console.warn(
          "Live API call failed or blocked, falling back to smart engine:",
          err,
        );
        resultText = generateSmartEngineResult(actionType, option, rawText);
      }
    } else {
      // Simulate brief natural processing time
      await new Promise((r) => setTimeout(r, 450));
      resultText = generateSmartEngineResult(actionType, option, rawText);
    }

    currentGeminiResult = resultText;
    if (geminiResultContent) {
      const formattedHTML = formatResultToHTML(resultText);
      geminiResultContent.innerHTML = formattedHTML;
    }
  }

  // Live Google Gemini API Integration
  async function callLiveGeminiAPI(apiKey, actionType, option, text) {
    let promptInstruction = "";
    if (actionType === "polish") {
      promptInstruction =
        "Proofread, polish grammar, eliminate weak filler words, and convert passive voice to active voice while preserving the core message. Return only the revised text:";
    } else if (actionType === "tone") {
      promptInstruction = `Rewrite the following text in an assertive, engaging ${option} tone. Return only the rewritten text:`;
    } else if (actionType === "summary") {
      promptInstruction =
        "Provide a structured executive summary of the following text with 3 bullet points of core insights followed by a 1-sentence bottom-line takeaway:";
    } else if (actionType === "headlines") {
      promptInstruction =
        "Generate 5 compelling, viral-ready headlines/titles for the following content. Number them 1 to 5:";
    } else if (actionType === "continue") {
      promptInstruction =
        "Write a logical, engaging continuation paragraph that builds directly upon this text:";
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptInstruction + "\n\n" + text }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }
    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  }

  // Built-in Intelligent Gemini Simulation Engine (Guaranteed zero network dependence)
  function generateSmartEngineResult(actionType, option, text) {
    const sentences = text
      .split(/[.!?]+(?:\s+|$)/)
      .filter((s) => s.trim().length > 0);
    const words = text.split(/\s+/).filter((w) => w.length > 0);

    if (actionType === "polish") {
      let polished = text;
      // Clean fillers
      polished = polished.replace(
        /\b(basically|actually|literally|kind of|sort of)\s+/gi,
        "",
      );
      polished = polished.replace(/\bvery\s+([a-z]+)/gi, (m, word) => {
        const strongMap = {
          good: "exceptional",
          bad: "terrible",
          big: "colossal",
          small: "compact",
          fast: "swift",
          smart: "brilliant",
          happy: "thrilled",
          important: "crucial",
        };
        return strongMap[word.toLowerCase()] || "highly " + word;
      });
      // Replace in order to -> to
      polished = polished.replace(/\bin order to\b/gi, "to");
      // Replace passive phrases
      polished = polished.replace(/\bwas written by\b/gi, "wrote");
      polished = polished.replace(/\bwas conducted by\b/gi, "conducted");
      return polished.trim();
    }

    if (actionType === "tone") {
      if (option === "professional") {
        return `In synthesizing strategic objectives, ${text.replace(/\bI think\b/gi, "Analysis indicates").replace(/\bmaybe\b/gi, "feasibly")}\n\nConsistently prioritizing methodological clarity ensures sustained execution and stakeholder alignment.`;
      } else if (option === "concise") {
        const firstTwo = sentences
          .slice(0, Math.min(2, sentences.length))
          .join(". ");
        return `${firstTwo}. Cut the excess; deliver precision.`;
      } else if (option === "academic") {
        return `Empirical scrutiny underscores that ${text.replace(/\bshows\b/gi, "demonstrates").replace(/\bgood\b/gi, "salient")}. This paradigm highlights the cognitive interplay between linguistic cadence and reader comprehension.`;
      } else {
        // casual
        return `Here is the real takeaway: ${text.replace(/\bFurthermore\b/gi, "Also").replace(/\bConsequently\b/gi, "So")}\n\nPretty exciting stuff when you see it all come together!`;
      }
    }

    if (actionType === "summary") {
      const topWords = words.slice(0, 15).join(" ");
      return `• Core Focus: Highlighting key perspectives surrounding "${sentences[0] || topWords}".\n• Structural Cadence: Developed across ${sentences.length} core thoughts with calibrated lexical density.\n• Practical Impact: Eliminating ambiguity strengthens communication across digital and professional channels.\n\nKey Takeaway: Clear, intentional writing commands attention and converts passive skimmers into engaged readers.`;
    }

    if (actionType === "headlines") {
      const topic = words.slice(0, 5).join(" ");
      return `1. The Definitive Blueprint: Master the Nuances of ${topic}\n2. Why Concise Prose Outperforms Lengthy Arguments Every Time\n3. How Intentional Writing Transforms Clarity into Decisive Action\n4. Beyond the Draft: 5 Crucial Insights from Your Writing Analysis\n5. The Power of Every Word: Crafting High-Impact Communication`;
    }

    if (actionType === "continue") {
      return `Building directly upon this rationale, the next logical milestone involves operationalizing these insights into daily workflows. When authors maintain conscious awareness of pacing and syllable density, drafts evolve from functional explanations into resonant narratives that spark meaningful collaboration.`;
    }

    return text;
  }

  function formatResultToHTML(text) {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return escaped.replace(/\n/g, "<br>");
  }

  // 11. Initial Run with Starter / Sample Content
  updateUI();
});
