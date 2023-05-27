const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <div className={isDanger ? "countdown danger" : "countdown"}>
      <p>{value}</p>
      <span className="common-time-weight">{type}</span>
    </div>
  );
};

export default DateTimeDisplay;
