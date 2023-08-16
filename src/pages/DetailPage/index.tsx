import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../assets/Loading";
import { LessThan } from "../../assets/LessThan";
import { GreaterThan } from "../../assets/GreaterThan";
import { ArrowLeft } from "../../assets/ArrowLeft";
import { Balance } from "../../assets/Balance";
import { Vector } from "../../assets/Vector";
import Type from "../../components/Type";
import BaseStat from "../../components/BaseStat";
import DamageModal from "../../components/DamageModal";
import { FormattedPokemonData } from "../../types/FormattedPokemonData";
import {
  Ability,
  PokemonDetail,
  Sprites,
  Stat,
} from "../../types/PokemonDetail";
import { DamageRelationOfPokemonTypes } from "../../types/DamageRelationOfPokemonTypes";
import {
  FlavorTextEntry,
  PokemonDescription,
} from "../../types/PokemonDescription";
import { PokemonData } from "../../types/PokemonData";

interface NextAndPreviousPokemon {
  next: string | undefined;
  previous: string | undefined;
}

const DetailPage = () => {
  const [pokemon, setPokemon] = useState<FormattedPokemonData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const params = useParams() as { id: string };
  const pokemonId = params.id; //해당 포켓몬id
  const baseUrl = `https://pokeapi.co/api/v2/pokemon/`; //base가 되는 url

  useEffect(() => {
    setIsLoading(true);
    fetchPokemonData(pokemonId);
  }, [pokemonId]);

  async function fetchPokemonData(id: string) {
    // 현재 페이지에 해당하는 포켓몬의 url
    const url = `${baseUrl}${id}`;
    try {
      // 현재 페이지에 해당하는 포켓몬의 정보를 가져옴
      const { data: pokemonData } = await axios.get<PokemonDetail>(url);
      if (pokemonData) {
        // 페이지 구성에 필요한 데이터들
        const { name, id, types, weight, height, stats, abilities, sprites } =
          pokemonData;
        const nextAndPreviousPokemon: NextAndPreviousPokemon =
          await getNextAndPreviousPokemon(id);

        // console.log(formatPokemonAbilities(abilities));

        const DamageRelations = await Promise.all(
          types.map(async (i) => {
            const type = await axios.get<DamageRelationOfPokemonTypes>(
              i.type.url
            );
            // console.log(JSON.stringify(type.data));
            return type.data.damage_relations;
          })
        );

        const formattedPokemonData: FormattedPokemonData = {
          id,
          name,
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          stats: formatPokemonStats(stats),
          DamageRelations,
          types: types.map((type) => type.type.name),
          sprites: formatPoketmonSprites(sprites),
          description: await getPokemonDiscription(id),
        };
        setPokemon(formattedPokemonData);
        setIsLoading(false);
        // console.log(formattedPokemonData);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const filterAndFormatDescription = (
    flavorText: FlavorTextEntry[]
  ): string[] => {
    const koreanDescriotion = flavorText
      ?.filter((text) => text.language.name === "ko")
      .map((text) => text.flavor_text.replace(/\r|\n|\f/g, " "));
    return koreanDescriotion;
  };

  const getPokemonDiscription = async (id: number): Promise<string> => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;

    const { data: pokemonSpecies } = await axios.get<PokemonDescription>(url);

    const descriptions: string[] = filterAndFormatDescription(
      pokemonSpecies.flavor_text_entries
    );

    // 여러개의 description중에 랜덤으로 하나만 반환
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const formatPoketmonSprites = (sprites: Sprites) => {
    const newSprites = { ...sprites };

    (Object.keys(sprites) as (keyof typeof newSprites)[]).forEach((key) => {
      if (typeof newSprites[key] !== "string") {
        delete newSprites[key];
      }
    });
    return Object.values(newSprites) as string[];
  };

  // 데이터를 사용하기 전 가공을 하는 과정
  const formatPokemonAbilities = (abilities: Ability[]) => {
    return abilities
      .filter((_, index) => index <= 1)
      .map((abj: Ability) => abj.ability.name.replaceAll("-", " "));
  };
  // console.log(pokemon?.DamageRelations);
  const formatPokemonStats = ([
    //구조분해할당
    statHP,
    statATK,
    statDEP,
    statSATK,
    statSDEP,
    statSPD,
  ]: Stat[]) => [
    { name: "Hit Points", baseStat: statHP.base_stat },
    { name: "Attack", baseStat: statATK.base_stat },
    { name: "Defense", baseStat: statDEP.base_stat },
    { name: "Special Attack", baseStat: statSATK.base_stat },
    { name: "Special Defense", baseStat: statSDEP.base_stat },
    { name: "Speed", baseStat: statSPD.base_stat },
  ];

  // 현재 포켓몬 정보를 가져와 이전, 다음 포켓몬의 이름을 가져오는 함수
  async function getNextAndPreviousPokemon(id: number) {
    // 현재 포켓몬을 가져온다
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`; //id-1을 해야 해당 포켓몬의 정보를 가져옴
    const { data: pokemonData } = await axios.get(urlPokemon);

    // 현재 포켓몬의 정보를 이용하여 이전, 다음 포켓몬의 정보를 가져옴
    const nextResponse =
      pokemonData.next && (await axios.get<PokemonData>(pokemonData.next));
    const previousResponse =
      pokemonData.previous &&
      (await axios.get<PokemonData>(pokemonData.previous));

    // 이전, 다음 포켓몬의 이름을 반환
    return {
      next: nextResponse?.data?.results?.[0].name,
      previous: previousResponse?.data?.results?.[0].name,
    };
  }

  // 로딩 동작
  if (isLoading)
    return (
      <div className="absolute h-auto w-auto top-1/2 -translate-x-1/2 left-1/2 z-50">
        {/* <img
          src={IconBall}
          alt="ball"
          className={` absolute h-auto w-10 top-1/3 -translate-x-1/2 left-1/2 z-50`}
        /> */}
        <Loading className="w-16 h-16 z-50 animate-spin text-slate-900" />
      </div>
    );
  // 데이터가 없을때

  if (!isLoading && !pokemon) {
    return (
      <div className=" w-screen h-screen flex">
        <div className=" text-center text-2xl text-slate-900 font-bold m-auto">
          ...Not Found
        </div>
      </div>
    );
  }
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const bg = `bg-${pokemon?.types?.[0]}`;
  const text = `text-${pokemon?.types?.[0]}`;

  // console.log(pokemon.previous);
  // console.log(pokemon.next);

  if (pokemon && !isLoading) {
    return (
      <>
        <article className="flex items-center gap-1 flex-col w-full">
          <div
            className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
          >
            {pokemon.previous && (
              <Link
                className="absolute top-[40%] -translate-y-1/2 z-50 left-1  transition hover:scale-110"
                to={`/pokemon/${pokemon.previous}`}
              >
                <LessThan className="w-8 h-10 p-1" />
              </Link>
            )}
            {pokemon.next && (
              <Link
                className={`absolute top-[40%] -translate-y-1/2 z-50 right-1 transition hover:scale-110`}
                to={`/pokemon/${pokemon.next}`}
              >
                <button className={``}>
                  <GreaterThan className=" w-8 h-10 p-1" />
                </button>
              </Link>
            )}

            <section className="w-full flex flex-col z-20 items-center justify-end relative h-full">
              <div className="absolute z-30 top-6 flex items-center w-full justify-between px-4 ">
                <div className="flex items-center gap-1">
                  <Link to={"/"}>
                    <ArrowLeft className="w-8 h-10 text-zinc-200  transition hover:scale-110 " />
                  </Link>
                  <h1 className=" text-zinc-200 font-bold text-2xl capitalize">
                    {pokemon.name}
                  </h1>
                </div>
                <div className="text-zinc-200 font-bold text-2xl">
                  No.{pokemon.id.toString().padStart(3, "00")}
                </div>
              </div>
              <div className=" relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16">
                <img
                  src={img}
                  width="100%"
                  height="auto"
                  loading="lazy"
                  alt={pokemon.name}
                  className={`object-contain h-full cursor-pointer animation`}
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </section>
            <section className=" w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center px-5 pb-4">
              <div className={`flex items-center justify-center gap-4`}>
                {/* 포켓몬 타입 */}
                {pokemon.types.map((type) => (
                  <Type key={type} type={type} />
                ))}
              </div>
              <h2 className={`text-lg font-bold ${text} mt-2`}>정보</h2>
              <div className=" flex w-full items-center justify-between max-w-[400px] text-center">
                <div className=" w-full">
                  <h4 className=" text-[0.8rem] text-zinc-400 font-bold">
                    몸무게
                  </h4>
                  <div className=" text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                    <Balance />
                    {pokemon.weight}kg
                    {/* <Vector /> */}
                  </div>
                </div>
                <div className=" w-full">
                  <h4 className=" text-[0.8rem] text-zinc-400 font-bold">키</h4>
                  <div className=" text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                    <Vector />
                    {pokemon.height}m
                  </div>
                </div>
                <div className=" w-full">
                  <h4 className=" text-[0.8rem] text-zinc-400 font-bold">
                    Weight
                  </h4>
                  {pokemon.abilities.map((ability) => (
                    <div
                      key={ability}
                      className=" text-[0.5rem] text-zinc-200 capitalize"
                    >
                      {ability}
                    </div>
                  ))}
                </div>
              </div>
              <h2 className={`text-lg font-semibold ${text} mt-2`}>
                기본 능력치
              </h2>
              <div className=" w-full flex">
                <table className="m-auto">
                  <tbody>
                    {pokemon.stats.map((stat) => (
                      <BaseStat
                        key={stat.name}
                        valueStat={stat.baseStat}
                        nameStat={stat.name}
                        type={pokemon.types[0]}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <h2 className={`text-lg font-semibold ${text} mt-2`}>설명</h2>
              <p className=" text-md leading-6 font-sans text-zinc-200 max-w-[30rem] text-center">
                {pokemon.description}
              </p>
              <div className=" flex my-2 flex-wrap justify-center">
                {pokemon.sprites.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="sprites"
                    className="hover:scale-125 transition-all"
                  />
                ))}
              </div>
              {/* {pokemon.DamageRelations && (
                <div className="w-10/12">
                  <h2 className={`text-center text-base font-semibold ${text}`}>
                    <DamageRelations damages={pokemon.DamageRelations} />
                  </h2>
                </div>
              )} */}
            </section>
          </div>
          {isModalOpen && (
            <DamageModal
              setIsModalOpen={setIsModalOpen}
              damages={pokemon.DamageRelations}
            />
          )}
        </article>
      </>
    );
  }

  return null;
};

export default DetailPage;
