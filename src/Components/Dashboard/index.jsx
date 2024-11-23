import React, { useState, useEffect } from "react";
import "./Styles.scss"; // Assuming your SCSS is saved as Dashboard.scss

const Dashboard = () => {
  const [checkInTime, setCheckInTime] = useState(null);
  const [breakTime, setBreakTime] = useState(0); // Break time in minutes
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [shiftSummary, setShiftSummary] = useState(null);

  const totalShiftTime = 8 * 60; // 8 hours in minutes

  const handleCheckIn = () => {
    setCheckInTime(new Date());
    setBreakTime(0); // Reset break time on check-in
    setCheckOutTime(null); // Reset check-out
    setShiftSummary(null); // Reset summary
  };

  const handleBreakToggle = () => {
    if (isOnBreak) {
      setBreakTime((prev) => prev + Math.floor((new Date() - isOnBreak) / 60000));
      setIsOnBreak(false);
    } else {
      setIsOnBreak(new Date());
    }
  };

  const handleCheckOut = () => {
    if (checkInTime) {
      const workedTime = Math.floor((new Date() - checkInTime) / 60000) - breakTime;
      setCheckOutTime(new Date());
      setShiftSummary({
        workedTime: workedTime > totalShiftTime ? totalShiftTime : workedTime,
        breakTime,
      });
    }
  };

  const calculateProgress = () => {
    if (!checkInTime) return 0;
    const workedTime = Math.floor((new Date() - checkInTime) / 60000) - breakTime;
    return (Math.min(workedTime, totalShiftTime) / totalShiftTime) * 100;
  };

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  useEffect(() => {
    let interval;
    if (checkInTime && !checkOutTime) {
      interval = setInterval(() => {
        calculateProgress();
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [checkInTime, checkOutTime, breakTime]);

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Driver Dashboard</h2>
        <div className="datetime">{new Date().toLocaleString()}</div>
      </div>

      <div className="status-indicator">
        <div className={`status-card ${checkInTime ? "on-duty" : "off-duty"}`}>
          <div className="status-icon">🚦</div>
          <div className="status-label">{checkInTime ? "On Duty" : "Off Duty"}</div>
          <div className="status-description">
            {checkInTime ? "You are currently working" : "Shift not started"}
          </div>
        </div>

        <div className={`status-card ${isOnBreak ? "on-break" : ""}`}>
          <div className="status-icon">☕</div>
          <div className="status-label">{isOnBreak ? "On Break" : "No Break"}</div>
          <div className="status-description">
            {isOnBreak ? "You are currently on break" : "Not on break"}
          </div>
        </div>
      </div>

      <div className="actions">
        {!checkInTime && <button onClick={handleCheckIn}>Check In</button>}
        {checkInTime && (
          <>
            <button onClick={handleBreakToggle}>{isOnBreak ? "End Break" : "Take Break"}</button>
            <button onClick={handleCheckOut}>Check Out</button>
          </>
        )}
      </div>

      {checkInTime && !checkOutTime && (
        <div className="progress-container">
          <h3>Shift Progress</h3>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className="progress-details">
            <span>Break Time: {formatTime(breakTime)}</span>
            <span>
              Worked Time:{" "}
              {formatTime(
                Math.floor((new Date() - checkInTime) / 60000) - breakTime
              )}
            </span>
            <span>Shift Time: 8h</span>
          </div>
        </div>
      )}

      {shiftSummary && (
        <div className="summary">
          <h3>Shift Summary</h3>
          <div>
            <span>Total Worked Time:</span> {formatTime(shiftSummary.workedTime)}
          </div>
          <div>
            <span>Total Break Time:</span> {formatTime(shiftSummary.breakTime)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
