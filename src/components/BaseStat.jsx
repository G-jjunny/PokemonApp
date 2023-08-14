import React, { useEffect, useRef } from "react";
import PokeBallIcon from "../assets/Img/small-pokeball-icon.jpg";

const BaseStat = ({ valueStat, nameStat, type }) => {
  const bg = `bg-${type}`;
  const ref = useRef(null);
  useEffect(() => {
    const setValueStat = ref.current;
    const calc = valueStat * (100 / 255);
    setValueStat.style.width = calc + "%";
  }, []);
  return (
    <tr className=" w-full text-white">
      <img src={PokeBallIcon} alt="ball" className="w-10" />
      <td className=" sm:pr-5 ">{nameStat}</td>
      <td className=" px-2 sm:px-3 ">{valueStat}</td>
      <td>
        <div
          className={`flex items-start h-2 min-w-[10rem] rounded overflow-hidden bg-gray-600 `}
        >
          <div ref={ref} className={`h-3 ${bg} transition-all stat`}></div>
        </div>
      </td>
      <td className=" px-2 sm:px-5">255</td>
    </tr>
  );
};

export default BaseStat;
