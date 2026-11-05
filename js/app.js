// Entry point - ties everything together
lucide.createIcons();

const $ = id => document.getElementById(id);

const textInput    = $('textInput');
const analyzeBtn   = $('analyzeBtn');
const clearBtn     = $('clearBtn');
const sampleBtn    = $('sampleBtn');
const wordCounter  = $('wordCounter');
const resultsPanel = $('resultsPanel');
const toast        = $('toast');
const toastText    = $('toastText');
const exportPdfBtn = $('exportPdf');
const copyBtn      = $('copySummary');

// Live word count
textInput.addEventListener('input', () => {
  const count = Analyzer.getWords(textInput.value).length;
  wordCounter.textContent = `${count} word${count === 1 ? '' : 's'}`;
});

// Analyze
analyzeBtn.addEventListener('click', () => {
  const text = textInput.value.trim();
  if (text.length < 30) {
    showToast('Add at least 30 characters to analyze.');
    return;
  }

  const stats = Analyzer.getStats(text);
  const flesch = Readability.fleschReadingEase(stats);
  const grade  = Readability.fleschKincaidGrade(stats);
  const fog    = Readability.gunningFog(stats);
  const smog   = Readability.smog(stats);

  // Score cards
  $('scoreFlesch').textContent = flesch.toFixed(1);
  $('descFlesch').textContent  = Readability.describeFlesch(flesch);
  $('scoreGrade').textContent  = grade.toFixed(1);
  $('descGrade').textContent   = Readability.describeGrade(grade);
  $('scoreFog').textContent    = fog.toFixed(1);
  $('descFog').textContent     = fog < 10 ? 'Easy' : fog < 15 ? 'Moderate' : 'Hard';
  $('scoreSmog').textContent   = smog.toFixed(1);
  $('descSmog').textContent    = smog < 10 ? 'Easy' : smog < 15 ? 'Moderate' : 'Hard';

  // Stats list
  const statItems = [
    ['Words', stats.wordCount],
    ['Sentences', stats.sentenceCount],
    ['Avg sentence length', stats.avgSentenceLength.toFixed(1)],
    ['Complex words', `${stats.complexWordCount} (${stats.pctComplex.toFixed(1)}%)`],
    ['Passive voice', stats.passiveCount],
    ['Adverbs', stats.adverbCount],
  ];
  $('statList').innerHTML = statItems
    .map(([label, val]) => `<li><span>${label}</span><span>${val}</span></li>`)
    .join('');

  // Heatmap
  Heatmap.render(stats.sentences, stats, $('heatmap'));

  // Chart
  RadarChart.render($('radarChart'), stats);

  // Suggestions
  Suggestions.render(Suggestions.generate(stats), $('suggestionList'));

  resultsPanel.hidden = false;
  resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Store for export
  window.__lastReport = { stats, flesch, grade, fog, smog };
});

// Clear
clearBtn.addEventListener('click', () => {
  textInput.value = '';
  wordCounter.textContent = '0 words';
  resultsPanel.hidden = true;
  RadarChart.destroy();
});

// Sample text
sampleBtn.addEventListener('click', () => {
  textInput.value = `The implementation of comprehensive regulatory frameworks necessitates a multifaceted approach to stakeholder engagement. Organizations must systematically evaluate their operational paradigms in order to ensure compliance with evolving legislative requirements. Furthermore, the integration of advanced technological solutions has fundamentally transformed the manner in which institutions approach data governance and privacy protection. Consequently, it is imperative that decision-makers remain cognizant of these developments.`;
  textInput.dispatchEvent(new Event('input'));
});

// Export PDF
exportPdfBtn.addEventListener('click', () => {
  if (!window.__lastReport) { showToast('Analyze text first.'); return; }
  const { stats, flesch, grade, fog, smog } = window.__lastReport;
  const summary = Exporter.buildSummary(stats, flesch, grade, fog, smog);
  Exporter.toPdf(summary);
  showToast('PDF downloaded.');
});

// Copy summary
copyBtn.addEventListener('click', async () => {
  if (!window.__lastReport) { showToast('Analyze text first.'); return; }
  const { stats, flesch, grade, fog, smog } = window.__lastReport;
  const summary = Exporter.buildSummary(stats, flesch, grade, fog, smog);
  const ok = await Exporter.copyToClipboard(summary);
  showToast(ok ? 'Summary copied.' : 'Copy failed.');
});

// Toast helper
let toastTimer;
function showToast(msg) {
  toastText.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// Rebuild icons after dynamic DOM inserts
document.addEventListener('DOMContentLoaded', () => lucide.createIcons());