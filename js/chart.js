// Radar chart of cognitive metrics
let radarInstance = null;

const RadarChart = {

  build(stats) {
    // Normalize each metric to 0-100 where 100 is hardest
    const sentenceLoad = Math.min((stats.avgSentenceLength / 25) * 100, 100);
    const vocabComplexity = Math.min(stats.pctComplex * 4, 100);
    const syllableDensity = Math.min((stats.avgSyllablesPerWord / 2.5) * 100, 100);
    const passiveRate = Math.min((stats.passiveCount / stats.sentenceCount) * 200, 100);
    const adverbLoad = Math.min((stats.adverbCount / stats.wordCount) * 1000, 100);
    const overall = (
      sentenceLoad + vocabComplexity + syllableDensity + passiveRate + adverbLoad
    ) / 5;

    return [sentenceLoad, vocabComplexity, syllableDensity, passiveRate, adverbLoad, overall];
  },

  render(canvas, stats) {
    const data = this.build(stats);

    if (radarInstance) radarInstance.destroy();

    const style = getComputedStyle(document.body);
    const textColor = style.getPropertyValue('--text').trim();
    const primary = style.getPropertyValue('--primary').trim();
    const border = style.getPropertyValue('--border').trim();

    radarInstance = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['Sentence Length', 'Complex Words', 'Syllable Density', 'Passive Voice', 'Adverbs', 'Overall'],
        datasets: [{
          label: 'Load Score',
          data,
          borderColor: primary,
          backgroundColor: 'rgba(46, 139, 62, 0.15)',
          pointBackgroundColor: primary,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 25,
              color: textColor,
              backdropColor: 'transparent',
            },
            grid: { color: border },
            angleLines: { color: border },
            pointLabels: { color: textColor, font: { size: 11 } },
          }
        },
        plugins: {
          legend: { labels: { color: textColor } }
        }
      }
    });
  },

  destroy() {
    if (radarInstance) { radarInstance.destroy(); radarInstance = null; }
  }
};