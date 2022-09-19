const myLogger = (store) => (next) => (action) => {
	console.log(action); // 액션 출력
	const result = next(action); // 다음으로 액션 전달

	//업데이트 이후 상태 조회

	console.log('\t', store.getState());

	return result;
};
export default myLogger;
