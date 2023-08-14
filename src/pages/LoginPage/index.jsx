import Pokemon from "../../assets/Img/pokemon.png";
import Pikachu from "../../assets/Img/pikachu.png";
import BgBall from "../../assets/Img/dottedpokeball.png";
import BgBall2 from "../../assets/Img/pokeball.png";
import styled from "styled-components";

const LoginPage = () => {
  return (
    <section className=" bg-gray-200 min-h-[90vh] flex items-center justify-center overflow-hidden relative">
      <div className=" rotate-[-15deg] absolute left-[-230px] ">
        <img src={BgBall} alt="bg-ball" />
        {/* <img src={BgBall2} alt="bg-ball" /> */}
      </div>
      <div className=" z-50 bg-gray-300 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center hover:scale-105 transition-all">
        <div className=" md:w-1/2 px-8 md:px-16">
          {/* <h2 className=" font-bold text-2xl">Pokemon</h2> */}
          <div>
            <img src={Pokemon} alt="pokemon-logo" className="w-full" />
          </div>
          <p className=" text-xs font-semibold mt-4 text-[#002074]">
            포켓몬 사이트에 오신걸
          </p>
          <p className=" text-xs mt-1 font-semibold text-[#002074]">
            환영합니다.
          </p>
          <p className=" text-xs mt-4 text-[#002074]">로그인해 주세요</p>
        </div>
        <div className=" md:block hidden w-1/2">
          <img
            alt="login"
            className=" rounded-2xl"
            src={Pikachu}
            // src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          />
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
