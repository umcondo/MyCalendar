const CalendarDays = () => {
	const date = ['일', '월', '화', '수', '목', '금', '토'];

	return (
		<div className="calendar__days-wrapper row">
			{date.map((day, idx) => (
				<div className="col days" key={idx}>
					{day}
				</div>
			))}
		</div>
	);
};

export default CalendarDays;
