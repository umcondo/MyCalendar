import React from "react";
import Counter2 from "../components/Counter2";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { decrease, increase, setDiff } from "../modules/counter2";

export default function CounterContainer2() {
  // useSelector는 리덕스의 스토어 상태 조회하는 훅
  const { number, diff } = useSelector(
    (state) => ({
      number: state.counter2.number,
      diff: state.counter2.diff,
    }),
    shallowEqual
  );

  // useDispatch는 리덕스 스토어의 dispatch를 함수에서 사용 할 수 있도록 하는 훅
  const dispatch = useDispatch();

  // 각 액션을 디스패치
  const onIncrease = () => dispatch(increase());
  const onDecrease = () => dispatch(decrease());
  const onSetDiff = (diff) => dispatch(setDiff(diff));

  return (
    <Counter2
      number={number}
      diff={diff}
      onDecrease={onDecrease}
      onIncrease={onIncrease}
      onSetDiff={onSetDiff}
    />
  );
}
