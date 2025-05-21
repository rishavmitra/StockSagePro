import React, { useContext, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { ThemeContext } from '../context/ThemeContext';

const PredictionChart = ({ historicalData, predictionData, symbol, modelType }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { darkMode } = useContext(ThemeContext);
  
  useEffect(() => {
    if (!historicalData || historicalData.length === 0 || !predictionData || predictionData.length === 0) {
      return;
    }
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    
    // Prepare historical data
    const historicalDates = historicalData.slice(-30).map(data => new Date(data.Date).toLocaleDateString());
    const historicalPrices = historicalData.slice(-30).map(data => data['Close']);
    
    // Prepare prediction data
    const predictionDates = predictionData.map(data => new Date(data.Date).toLocaleDateString());
    const predictionPrices = predictionData.map(data => data.Predicted_Price);
    
    // Combine dates and draw separator line
    const allDates = [...historicalDates, ...predictionDates];
    const separatorIndex = historicalDates.length - 1;
    
    // Set colors based on theme
    const gridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const fontColor = darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    
    // Get model color based on type
    const getModelColor = (type) => {
      switch(type) {
        case 'linear':
          return '#00c853';
        case 'random_forest':
          return '#aa00ff';
        case 'svm':
          return '#ff6d00';
        case 'lstm':
          return '#d50000';
        default:
          return '#00c853';
      }
    };
    
    const modelColor = getModelColor(modelType);
    
    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: allDates,
        datasets: [
          {
            label: `${symbol} Historical Price`,
            data: [...historicalPrices, ...Array(predictionDates.length).fill(null)],
            borderColor: '#2962ff',
            backgroundColor: 'rgba(41, 98, 255, 0.1)',
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 5,
            fill: true,
            tension: 0.4,
          },
          {
            label: `${symbol} Predicted Price (${modelType.toUpperCase()})`,
            data: [...Array(historicalDates.length).fill(null), ...predictionPrices],
            borderColor: modelColor,
            backgroundColor: `${modelColor}20`,
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 2,
            pointHoverRadius: 5,
            fill: true,
            tension: 0.4,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 12,
              },
              color: fontColor,
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            titleColor: darkMode ? '#ffffff' : '#000000',
            bodyColor: darkMode ? '#ffffff' : '#000000',
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 4,
          },
          annotation: {
            annotations: {
              line1: {
                type: 'line',
                xMin: separatorIndex,
                xMax: separatorIndex,
                borderColor: 'rgba(255, 99, 132, 0.5)',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                  content: 'Prediction Start',
                  enabled: true,
                  position: 'top',
                },
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: fontColor,
              maxRotation: 45,
              minRotation: 45,
              callback: function(index) {
                // Show fewer ticks for better readability
                return index % 3 === 0 ? allDates[index] : '';
              },
            },
          },
          y: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: fontColor,
              callback: function(value) {
                return '₹' + value.toLocaleString();
              },
            },
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        animation: {
          duration: 1000,
        },
      },
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [historicalData, predictionData, symbol, modelType, darkMode]);
  
  return (
    <div className="chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PredictionChart;
