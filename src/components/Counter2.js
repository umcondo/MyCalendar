import React from "react";

export default function Counter2({
  number,
  diff,
  onIncrease,
  onDecrease,
  onSetDiff,
}) {
  const onChange = (e) => {
    onSetDiff(parseInt(e.target.value), 10);
  };

  return (
    <div>
      <h1>{number}</h1>
      <div>
        <input type="number" value={diff} min="1" onChange={onChange} />
        <button onClick={onIncrease}>증가</button>
        <button onClick={onDecrease}>감소</button>
      </div>
    </div>
  );
}
