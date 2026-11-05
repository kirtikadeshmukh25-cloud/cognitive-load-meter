// Basic text tokenizing and counting
const Analyzer = {

  // Split into sentences using compromise
  getSentences(text) {
    const doc = nlp(text);
    return doc.sentences().out('array');
  },

  // Split into words
  getWords(text) {
    return text.match(/\b[\w'-]+\b/g) || [];
  },

  // Count syllables in a single word (approximate but effective)
  countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const m = word.match(/[aeiouy]{1,2}/g);
    return m ? m.length : 1;
  },

  // Count total syllables in text
  countTotalSyllables(words) {
    return words.reduce((sum, w) => sum + this.countSyllables(w), 0);
  },

  // Is word "complex" (3+ syllables)?
  isComplexWord(word) {
    return this.countSyllables(word) >= 3;
  },

  // Detect passive voice (rough heuristic: "be" verb + past participle)
  countPassiveVoice(sentences) {
    const beVerbs = /\b(is|are|was|were|be|been|being|am)\b\s+\w+(ed|en)\b/i;
    return sentences.filter(s => beVerbs.test(s)).length;
  },

  // Count adverbs (words ending in "ly")
  countAdverbs(words) {
    return words.filter(w => /ly$/i.test(w) && w.length > 4).length;
  },

  // Main stats object
  getStats(text) {
    const sentences = this.getSentences(text);
    const words = this.getWords(text);
    const syllables = this.countTotalSyllables(words);
    const complexWords = words.filter(w => this.isComplexWord(w));
    const passiveCount = this.countPassiveVoice(sentences);
    const adverbs = this.countAdverbs(words);

    const avgSentenceLength = sentences.length ? words.length / sentences.length : 0;
    const avgSyllablesPerWord = words.length ? syllables / words.length : 0;
    const pctComplex = words.length ? (complexWords.length / words.length) * 100 : 0;

    return {
      sentences,
      words,
      wordCount: words.length,
      sentenceCount: sentences.length,
      syllableCount: syllables,
      complexWordCount: complexWords.length,
      passiveCount,
      adverbCount: adverbs,
      avgSentenceLength,
      avgSyllablesPerWord,
      pctComplex,
    };
  }
};