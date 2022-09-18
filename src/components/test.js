//// 처음에 1년데이터 불러오고 11월이면 다음년 데이터 2월이면 전년 데이터 다 불러오기
const getNextYearHoliday = useCallback(async () => {
  try {
    const result = await axios.get(
      `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=${
        year * 1 + 1 + ""
      }&numOfRows=100&ServiceKey=Jp1JskGd1jDAmnUl31%2Bb3fqVio0uixSSXJj1dUNAK9UJoWDjyMNfhCC1wr3XTxeQ0WZzq5tjURjIYxPZyuK14g%3D%3D&_type=json`
    );
    const response = result.data.response.body.items?.item;

    setHoliday((prev) => [...prev, ...response]);
  } catch (error) {
    console.log(error);
  }
}, [year]);

const getPostYearHoliday = useCallback(async () => {
  try {
    const result = await axios.get(
      `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=${
        year * 1 - 1 + ""
      }&numOfRows=100&ServiceKey=Jp1JskGd1jDAmnUl31%2Bb3fqVio0uixSSXJj1dUNAK9UJoWDjyMNfhCC1wr3XTxeQ0WZzq5tjURjIYxPZyuK14g%3D%3D&_type=json`
    );
    const response = result.data.response.body.items?.item;

    setHoliday((prev) => [...prev, ...response]);
  } catch (error) {
    console.log(error);
  }
}, [year]);

const prevMonth = useCallback(() => {
  setCurrentMonth(subMonths(currentMonth, 1));
  if (format(currentMonth, "MM") * 1 <= 1) {
    getPostYearHoliday();
  }
}, [currentMonth, getPostYearHoliday]);

const nextMonth = useCallback(() => {
  setCurrentMonth(addMonths(currentMonth, 1));

  if (format(currentMonth, "MM") * 1 >= 11) {
    getNextYearHoliday();
  }
}, [currentMonth, getNextYearHoliday]);

const onClickToday = useCallback(() => {
  setSelectedDate(new Date());
  setCurrentMonth(new Date());
}, []);
useEffect(() => {
  const getHoliday = async () => {
    const year = format(currentMonth, "yyyy");
    const month = format(currentMonth, "MM");
    try {
      const result = await axios.get(
        `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=${year}&solMonth=${month}&numOfRows=100&ServiceKey=Jp1JskGd1jDAmnUl31%2Bb3fqVio0uixSSXJj1dUNAK9UJoWDjyMNfhCC1wr3XTxeQ0WZzq5tjURjIYxPZyuK14g%3D%3D&_type=json`
      );
      const result1 = await axios.get(
        `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=${year}&solMonth=${format(
          subMonths(currentMonth, 1),
          "MM"
        )}&numOfRows=100&ServiceKey=Jp1JskGd1jDAmnUl31%2Bb3fqVio0uixSSXJj1dUNAK9UJoWDjyMNfhCC1wr3XTxeQ0WZzq5tjURjIYxPZyuK14g%3D%3D&_type=json`
      );
      const result2 = await axios.get(
        `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=${year}&solMonth=${format(
          addMonths(currentMonth, 1),
          "MM"
        )}&numOfRows=100&ServiceKey=Jp1JskGd1jDAmnUl31%2Bb3fqVio0uixSSXJj1dUNAK9UJoWDjyMNfhCC1wr3XTxeQ0WZzq5tjURjIYxPZyuK14g%3D%3D&_type=json`
      );

      const response = result.data.response.body.items?.item;
      const response1 = result1.data.response.body.items?.item;
      const response2 = result2.data.response.body.items?.item;

      let stack = [];

      if (response?.length) {
        stack = [...stack, ...response];
      } else if (typeof response === "object") {
        stack.push(response);
      }
      if (response1?.length) {
        stack = [...stack, ...response1];
      } else if (typeof response1 === "object") {
        stack.push(response1);
      }
      if (response2?.length) {
        stack = [...stack, ...response2];
      } else if (typeof response2 === "object") {
        stack.push(response2);
      }

      setHoliday(stack);
    } catch (error) {
      console.log(error);
    }
  };
  getHoliday();
}, [currentMonth]);
