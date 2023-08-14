import { useEffect, useState } from "react";
import axios from "axios";
import PokeCard from "../../components/PokeCard";
import AutoComplete from "../../components/AutoComplete";

function MainPage() {
  // 모든 포켓몬의 데이터state
  const [allPokemons, setAllPokemons] = useState([]);

  // 화면상에 보여지는 포켓몬 데이터state
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const limitNum = 30;
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;

  useEffect(() => {
    fetchPokeData();
  }, []);

  const filterDisplayedPokemonData = (
    allpokemonsDate,
    displayedPokemons = []
  ) => {
    const limit = displayedPokemons.length + limitNum;
    // 모든 포켓몬 데이터에서 limitnum만큼 더 가져오기
    const array = allpokemonsDate.filter(
      (pokemon, index) => index + 1 <= limit
    );
    return array;
  };

  const fetchPokeData = async () => {
    try {
      // 1008개 포켓몬 데이터 받아오기
      const response = await axios.get(url);
      // 모든 데이터 기억하기
      setAllPokemons(response.data.results);
      // 실제 화면에 보여질 리스트 state
      setDisplayedPokemons(filterDisplayedPokemonData(response.data.results));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <article className="pt-6">
        <header className="flex flex-col gap-2 w-full px-4 z-50">
          <AutoComplete
            allPokemons={allPokemons}
            setDisplayedPokemons={setDisplayedPokemons}
          />
        </header>
        <section className="pt-6 flex flex-col justify-center items-center overflow-auto z-0 pb-3">
          <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
            {displayedPokemons.length > 0 ? (
              displayedPokemons.map(({ url, name }, index) => (
                <PokeCard key={url} url={url} name={name} />
              ))
            ) : (
              <h2 className="font-medium text-lg text-slate-900 mb-1">
                해당 포켓몬이 없습니다.
              </h2>
            )}
          </div>
        </section>
        <div className="text-center pb-3">
          {allPokemons.length > displayedPokemons.length &&
            displayedPokemons.length !== 1 && (
              <button
                className={`bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white transition-all hover:text-slate-800 hover:bg-slate-400`}
                onClick={() =>
                  setDisplayedPokemons(
                    filterDisplayedPokemonData(allPokemons, displayedPokemons)
                  )
                }
              >
                더보기
              </button>
            )}
        </div>
      </article>
    </>
  );
}

export default MainPage;
