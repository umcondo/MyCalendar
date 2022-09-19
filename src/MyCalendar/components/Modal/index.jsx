import { format } from 'date-fns';
import { useCallback, useState } from 'react';
import { ModalContainer } from './style';

const Modal = ({
	selectedDate,
	setShowModal,
	setSchedule,
	schedule,
	scheduleId,
}) => {
	const [text, setText] = useState('');
	const onChange = useCallback((e) => {
		setText(e.target.value);
	}, []);

	const onSubmit = useCallback(
		(e) => {
			e.preventDefault();
			setSchedule((prev) => [
				...prev,
				{
					scheduleId: scheduleId.current++,
					date: selectedDate,
					scheduleText: text,
				},
			]);
			setShowModal((prev) => !prev);
		},
		[setSchedule, setShowModal, selectedDate, text, scheduleId]
	);

	const onDelete = useCallback(
		(id) => setSchedule((prev) => prev.filter((elm) => elm.scheduleId !== id)),
		[setSchedule]
	);
	return (
		<ModalContainer>
			<div className="modal-wapper">
				<h1>스케줄을 입력해주세요</h1>
				<span>
					{format(selectedDate, 'yyyy') +
						format(selectedDate, 'MM') +
						format(selectedDate, 'dd')}
				</span>
				{schedule
					.filter((elm) => format(elm.date, 't') === format(selectedDate, 't'))
					.map((elm) => (
						<div key={elm.scheduleId}>
							<span>{elm.scheduleId}</span>
							<span>{elm.scheduleText}</span>
							<button
								onClick={() => {
									onDelete(elm.scheduleId);
								}}
							>
								삭제
							</button>
						</div>
					))}
				<form onSubmit={onSubmit}>
					<input value={text} onChange={onChange} />

					<button>입력</button>
				</form>
			</div>
			<div
				className="modal-background"
				onClick={() => {
					setShowModal((prev) => !prev);
				}}
			/>
		</ModalContainer>
	);
};

export default Modal;
