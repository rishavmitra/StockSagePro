import React, { useContext, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { ThemeContext } from '../context/ThemeContext';

const StockChart = ({ stockData, symbol, indicators }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { darkMode } = useContext(ThemeContext);
  
  useEffect(() => {
    if (!stockData || stockData.length === 0) return;
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    
    // Prepare data for the chart
    const labels = stockData.map(data => new Date(data.Date).toLocaleDateString());
    const prices = stockData.map(data => data['Close']);
    
    // Set colors based on theme
    const gridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const fontColor = darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    
    // Prepare datasets
    const datasets = [
      {
        label: `${symbol} Price`,
        data: prices,
        borderColor: '#2962ff',
        backgroundColor: 'rgba(41, 98, 255, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#2962ff',
        pointHoverBorderColor: darkMode ? '#ffffff' : '#000000',
        fill: true,
        tension: 0.4,
      }
    ];
    
    // Add indicators if available
    if (indicators) {
      // Add SMA indicators
      if (indicators.SMA_20) {
        datasets.push({
          label: 'SMA 20',
          data: indicators.SMA_20,
          borderColor: '#ff6d00',
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
          tension: 0.4,
        });
      }
      
      if (indicators.SMA_50) {
        datasets.push({
          label: 'SMA 50',
          data: indicators.SMA_50,
          borderColor: '#2e7d32',
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
          tension: 0.4,
        });
      }
      
      // Add Bollinger Bands if available
      if (indicators.BB_Upper && indicators.BB_Middle && indicators.BB_Lower) {
        datasets.push({
          label: 'Bollinger Upper',
          data: indicators.BB_Upper,
          borderColor: 'rgba(103, 58, 183, 0.7)',
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
        });
        
        datasets.push({
          label: 'Bollinger Lower',
          data: indicators.BB_Lower,
          borderColor: 'rgba(103, 58, 183, 0.7)',
          borderWidth: 1,
          pointRadius: 0,
          fill: '+1', // Fill between upper and lower bands
          backgroundColor: 'rgba(103, 58, 183, 0.1)',
        });
      }
    }
    
    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets,
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
  }, [stockData, symbol, indicators, darkMode]);
  
  return (
    <div className="chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default StockChart;
