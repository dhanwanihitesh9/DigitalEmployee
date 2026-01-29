const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const logger = require('../utils/logger');

/**
 * Chart Service
 * Generates chart images for visualizations
 */

class ChartService {
  constructor() {
    this.width = 800;
    this.height = 600;
    this.chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: this.width,
      height: this.height,
      backgroundColour: 'white'
    });
  }

  /**
   * Generate pie chart for spending categories
   * @param {Array} categories - Array of category objects with name and amount
   * @returns {Promise<Buffer>} PNG image buffer
   */
  async generatePieChart(categories) {
    try {
      logger.info('Generating pie chart for spending categories...');

      const labels = categories.map(cat => cat.category);
      const data = categories.map(cat => cat.amount);
      const colors = this.generateColors(categories.length);

      const configuration = {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors,
            borderWidth: 1,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 14
                },
                padding: 15
              }
            },
            title: {
              display: true,
              text: 'Spending by Category',
              font: {
                size: 20,
                weight: 'bold'
              },
              padding: 20
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: AED ${value.toFixed(2)} (${percentage}%)`;
                }
              }
            }
          }
        }
      };

      const imageBuffer = await this.chartJSNodeCanvas.renderToBuffer(configuration);
      logger.info('Pie chart generated successfully');
      
      return imageBuffer;
    } catch (error) {
      logger.error(`Error generating pie chart: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate distinct colors for chart segments
   * @param {number} count - Number of colors needed
   * @returns {Array} Array of color hex codes
   */
  generateColors(count) {
    const baseColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF9F40'
    ];

    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }

    // Generate additional colors if needed
    const colors = [...baseColors];
    for (let i = baseColors.length; i < count; i++) {
      colors.push(`hsl(${(i * 360) / count}, 70%, 60%)`);
    }

    return colors;
  }
}

module.exports = new ChartService();
