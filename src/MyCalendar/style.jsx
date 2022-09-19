import styled from 'styled-components';

export const Calendar = styled.div`
	box-sizing: border-box;
	padding: 0 50px;
	width: 100%;
	font-size: 1rem;
	font-weight: 500;

	.calendar__header-wrapper {
		position: relative;
	}

	.calendar__header-btns {
		display: flex;
		align-items: center;
		position: absolute;
		right: 10px;
		top: 10px;
	}
	.calendar__header-btns button {
		background-color: #fff;
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 4px;
		cursor: pointer;
		height: 22px;
	}
	.calendar__header-btns .text {
		padding: 0 15px;
	}

	.col {
		width: calc(100% / 7);
		text-align: end;
	}
	.col:nth-child(1),
	.col:nth-last-child(1) {
		color: rgba(1, 1, 1, 0.5);
		background-color: #ececec;
	}

	.col.days {
		padding: 5px;
		border-bottom: 1px solid #121212;
		background-color: #fff;
	}
	.date-text-wrapper {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.holiday {
		background-color: #ffccd9;
		text-align: start;
		color: #000;
		padding-left: 10px;
		border-radius: 5px;
		margin-left: 5px;
	}

	.schedule {
		background-color: #19acf8;

		border-radius: 5px;
		text-align: start;
		color: white;
	}
	.schedule::before {
		content: '•';
		color: white;
		margin: 0 5px;
	}
	.col.cell {
		padding: 5px;
		padding-right: 10px;
		box-sizing: border-box;
		height: calc(100vw / 14);
		border: 0.5px solid rgba(1, 1, 1, 0.1);
		overflow-y: hidden;
	}
	.col.cell.disabled {
		color: rgba(1, 1, 1, 0.2);
	}

	.col.cell.today {
		position: relative;
	}

	.col.cell.today span {
		position: absolute;
		top: 3px;
		right: 27px;
		display: flex;
		align-items: center;
		justify-content: center;

		min-width: 1.6rem;
		text-align: center;
		padding: 2px 4px;
		box-sizing: border-box;
		color: white;
		background-color: red;
		border-radius: 50%;
	}

	.col.cell:nth-last-child(1) {
		border-right: 0;
	}
	.col.cell:nth-child(1) {
		border-left: 0;
	}

	.row:nth-last-child(1) .col.cell {
		border-bottom: 0;
	}
	.row {
		display: flex;
	}
`;
