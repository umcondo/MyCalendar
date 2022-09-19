import React from 'react';

export default function Counter({ number, onIncrease, onDecrease }) {
	return (
		<div>
			<h1>{number}</h1>
			<button onClick={onIncrease}>+1</button>
			<button onClick={onDecrease}>-1</button>
		</div>
	);
}
