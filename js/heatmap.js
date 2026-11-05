// Score each sentence and classify it
const Heatmap = {

  // Score a single sentence 0-100 (higher = harder)
  scoreSentence(sentence, stats) {
    const words = Analyzer.getWords(sentence);
    if (!words.length) return 0;

    const syllables = Analyzer.countTotalSyllables(words);
    const avgLen = words.length;
    const avgSyll = syllables / words.length;

    // Heuristic weights (tuned by feel, not science)
    let score = 0;
    score += Math.min(avgLen * 2.5, 40);         // longer sentence = harder
    score += Math.min((avgSyll - 1.4) * 40, 40); // more syllables per word = harder
    score += Math.min((avgLen / stats.avgSentenceLength) * 10, 20);

    return Math.max(0, Math.min(100, score));
  },

  classify(score) {
    if (score < 35) return 'easy';
    if (score < 65) return 'medium';
    return 'hard';
  },

  // Build the HTML for the heatmap
  render(sentences, stats, container) {
    container.innerHTML = '';
    sentences.forEach(sentence => {
      const score = this.scoreSentence(sentence, stats);
      const level = this.classify(score);

      const span = document.createElement('span');
      span.className = `sentence ${level}`;
      span.title = `Difficulty score: ${Math.round(score)}/100`;
      span.textContent = sentence + ' ';
      container.appendChild(span);
    });
  }
};