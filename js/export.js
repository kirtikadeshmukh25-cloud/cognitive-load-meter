// PDF and text export
const Exporter = {

  buildSummary(stats, flesch, grade, fog, smog) {
    return [
      'Cognitive Load Report',
      '=====================',
      '',
      `Words: ${stats.wordCount}`,
      `Sentences: ${stats.sentenceCount}`,
      `Avg sentence length: ${stats.avgSentenceLength.toFixed(1)} words`,
      `Complex words: ${stats.complexWordCount} (${stats.pctComplex.toFixed(1)}%)`,
      `Passive voice: ${stats.passiveCount} sentences`,
      '',
      'Scores',
      '------',
      `Flesch Reading Ease: ${flesch.toFixed(1)} (${Readability.describeFlesch(flesch)})`,
      `Flesch-Kincaid Grade: ${grade.toFixed(1)}`,
      `Gunning Fog: ${fog.toFixed(1)}`,
      `SMOG Index: ${smog.toFixed(1)}`,
      '',
      'Suggestions',
      '-----------',
      ...Suggestions.generate(stats),
    ].join('\n');
  },

  toPdf(summaryText) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFont('courier', 'normal');
    doc.setFontSize(11);

    const margin = 40;
    const maxWidth = 515;
    const lineHeight = 16;
    const pageHeight = 780;
    let y = margin;

    summaryText.split('\n').forEach(line => {
      const wrapped = doc.splitTextToSize(line, maxWidth);
      wrapped.forEach(w => {
        if (y > pageHeight) { doc.addPage(); y = margin; }
        doc.text(w, margin, y);
        y += lineHeight;
      });
    });

    doc.save('cognitive-load-report.pdf');
  },

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      return false;
    }
  }
};