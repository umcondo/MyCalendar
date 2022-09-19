import styled from 'styled-components';

export const ModalContainer = styled.div`
	.modal-close-btn {
		position: absolute;
		top: 10px;
		left: 10px;
		cursor: pointer;
		font-size: 1.5rem;
		box-sizing: border-box;
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.modal-wrapper {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		width: 500px;
		height: 600px;
		padding: 60px;
		box-sizing: border-box;
		z-index: 2;

		display: flex;
		flex-direction: column;

		margin-left: auto;

		border-radius: 3px;
		box-shadow: rgb(15 15 15 / 2%) 0px 0px 0px 1px,
			rgb(15 15 15 / 3%) 0px 3px 6px, rgb(15 15 15 / 6%) 0px 9px 24px;

		margin-right: auto;
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		gap: 15px;
		width: 100%;
		height: 100%;
		position: relative;
	}
	.modal-title {
		min-height: 28px;
		border: 0;
		font-size: 1.5rem;
	}
	.modal-title::placeholder {
		color: rgba(0, 0, 0, 0.4);
	}
	.modal-date {
		font-size: 0.9rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		padding-bottom: 15px;
	}
	.modal-date span:nth-child(1) {
		color: rgba(0, 0, 0, 0.5);
	}
	.modal-date span:nth-child(2) {
		margin-left: 40px;
	}
	.modal-text {
		white-space: pre-wrap;

		font-size: 1rem;

		border: 0;
		height: 250px;
		box-sizing: border-box;
		resize: none;
	}
	.modal-text::placeholder {
		font-size: 1rem;
		color: rgba(0, 0, 0, 0.4);
	}
	.modal-btn {
		background-color: #fff;
		border: 1px solid rgba(0, 0, 0, 0.3);
		padding: 10px 0;
		border-radius: 5px;
		cursor: pointer;
		bottom: -20px;
		position: absolute;
		width: 100%;
	}
	.update-btn {
		position: absolute;
		bottom: 30px;
		width: 100%;
	}
	.delete-btn {
		width: 100%;
	}
	.modal-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 1;
	}
	input:focus,
	textarea:focus {
		outline: none;
	}
`;

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
		cursor: pointer;
	}
	.schedule:hover {
		background-color: skyblue;
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
		min-height: calc(100vw / 14);
		border: 0.5px solid rgba(1, 1, 1, 0.1);
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
