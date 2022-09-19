import { format } from 'date-fns';

const CalendarHeader = ({
	currentMonth,
	prevMonth,
	nextMonth,
	onClickToday,
}) => {
	return (
		<div className="calendar__header-wrapper">
			<h1 className="calendar__header-title">
				{`${format(currentMonth, 'yyyy')}년 ${format(currentMonth, 'M')}월`}
			</h1>

			<div className="calendar__header-btns">
				<button onClick={prevMonth}>{'<'}</button>
				<button className="text" onClick={onClickToday}>
					{'오늘'}
				</button>
				<button onClick={nextMonth}>{'>'}</button>
			</div>
		</div>
	);
};

export default CalendarHeader;
