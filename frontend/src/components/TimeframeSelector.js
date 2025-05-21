import React from 'react';

const TimeframeSelector = ({ timeframe, onTimeframeChange }) => {
  const timeframes = [
    { value: '5d', label: '5 Days' },
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
    { value: '2y', label: '2 Years' },
    { value: '5y', label: '5 Years' },
  ];
  
  return (
    <div className="timeframe-selector mb-4">
      <div className="card">
        <div className="card-header">
          <h5 className="m-0">Select Timeframe</h5>
        </div>
        <div className="card-body">
          <div className="btn-group d-flex flex-wrap" role="group">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                type="button"
                className={`btn ${timeframe === tf.value ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => onTimeframeChange(tf.value)}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeframeSelector;
