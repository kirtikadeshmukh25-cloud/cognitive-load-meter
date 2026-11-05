// Generate actionable suggestions based on stats
const Suggestions = {

  generate(stats) {
    const out = [];

    if (stats.avgSentenceLength > 25) {
      out.push(`Your average sentence is ${stats.avgSentenceLength.toFixed(1)} words. Aim for 15-20.`);
    } else if (stats.avgSentenceLength > 20) {
      out.push('A few sentences could be trimmed. Try splitting the longest ones.');
    }

    if (stats.pctComplex > 15) {
      out.push(`${stats.pctComplex.toFixed(0)}% of words are complex (3+ syllables). Replace some with shorter words.`);
    }

    if (stats.passiveCount > stats.sentenceCount * 0.2) {
      out.push(`${stats.passiveCount} sentences use passive voice. Use active voice for clarity.`);
    }

    const longSentences = stats.sentences.filter(s => Analyzer.getWords(s).length > 30);
    if (longSentences.length > 0) {
      out.push(`${longSentences.length} sentence(s) are over 30 words. Split them.`);
    }

    if (stats.adverbCount / stats.wordCount > 0.03) {
      out.push('You use a lot of -ly adverbs. Replace some with stronger verbs.');
    }

    const veryLong = stats.sentences.filter(s => Analyzer.getWords(s).length > 45);
    if (veryLong.length > 0) {
      out.push(`${veryLong.length} sentence(s) exceed 45 words. Break these up immediately.`);
    }

    if (out.length === 0) {
      out.push('Your text reads well. No major readability issues found.');
    }

    return out;
  },

  render(list, container) {
    container.innerHTML = '';
    list.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      container.appendChild(li);
    });
  }
};