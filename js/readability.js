// Five standard readability formulas
const Readability = {

  fleschReadingEase(stats) {
    if (!stats.sentenceCount || !stats.wordCount) return 0;
    const score =
      206.835 -
      1.015 * (stats.wordCount / stats.sentenceCount) -
      84.6 * (stats.syllableCount / stats.wordCount);
    return Math.max(0, Math.min(100, score));
  },

  fleschKincaidGrade(stats) {
    if (!stats.sentenceCount || !stats.wordCount) return 0;
    return (
      0.39 * (stats.wordCount / stats.sentenceCount) +
      11.8 * (stats.syllableCount / stats.wordCount) -
      15.59
    );
  },

  gunningFog(stats) {
    if (!stats.sentenceCount || !stats.wordCount) return 0;
    return (
      0.4 *
      ((stats.wordCount / stats.sentenceCount) +
        100 * (stats.complexWordCount / stats.wordCount))
    );
  },

  smog(stats) {
    if (!stats.sentenceCount) return 0;
    return 1.043 * Math.sqrt(stats.complexWordCount * (30 / stats.sentenceCount)) + 3.1291;
  },

  automatedReadabilityIndex(stats) {
    if (!stats.wordCount || !stats.sentenceCount) return 0;
    const chars = stats.words.join('').length;
    return 4.71 * (chars / stats.wordCount) + 0.5 * (stats.wordCount / stats.sentenceCount) - 21.43;
  },

  // Human-friendly description of Flesch score
  describeFlesch(score) {
    if (score >= 90) return 'Very easy (5th grade)';
    if (score >= 80) return 'Easy (6th grade)';
    if (score >= 70) return 'Fairly easy (7th grade)';
    if (score >= 60) return 'Standard (8-9th grade)';
    if (score >= 50) return 'Fairly difficult (10-12th grade)';
    if (score >= 30) return 'Difficult (college)';
    return 'Very difficult (graduate)';
  },

  describeGrade(grade) {
    const g = Math.max(1, Math.round(grade));
    if (g <= 6) return `Grade ${g} - easy read`;
    if (g <= 9) return `Grade ${g} - middle school`;
    if (g <= 12) return `Grade ${g} - high school`;
    if (g <= 16) return `Grade ${g} - college`;
    return `Grade ${g} - graduate level`;
  }
};