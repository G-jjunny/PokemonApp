import { useState } from "react";

function AutoComplete({ allPokemons, setDisplayedPokemons }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filterNames = (input) => {
    const value = input.toLowerCase();
    return value ? allPokemons.filter((e) => e.name.includes(value)) : [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let text = searchTerm.trim(); //빈칸들을 지워줌
    setDisplayedPokemons(filterNames(text));
    setSearchTerm("");
  };

  // 이름이 같은거 찾는거
  const checkEqualName = (input) => {
    const filteredArray = filterNames(input);

    return filteredArray[0]?.name === input ? [] : filteredArray;
  };

  // 클릭시 해당 이름으로 input초기화
  const handleSearch = (e) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative z-50">
      <form
        className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          className="text-xs w-[20.5rem] h-6 px-2 py-1 bg-slate-600 rounded-lg text-gray-300 text-center"
        />
        <button
          className="text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700"
          type="submit"
        >
          검색
        </button>
      </form>
      {checkEqualName(searchTerm).length > 0 && (
        <div className=" w-full flex bottom-0 h-0 flex-col absolute justify-center items-center translate-y-2">
          <div className=" w-0 h-0 border-x-transparent border-x-8 border-b-[8px] border-gray-700 -translate-y-1/2"></div>
          <ul className=" w-40 max-h-[134px] bg-gray-700 rounded-lg absolute top-0 overflow-auto scrollbar-none">
            {checkEqualName(searchTerm).map((e, i) => (
              <li key={`button-${i}`}>
                <button
                  className=" text-base text-center w-full hover:bg-gray-600 p-[2px] text-gray-100"
                  onClick={handleSearch}
                  value={e.name}
                >
                  {e.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AutoComplete;
