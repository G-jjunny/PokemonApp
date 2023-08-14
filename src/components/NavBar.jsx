import styled from "styled-components";
import LogoImg from "../assets/Img/pokemon.png";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import app from "../firebase";

const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 100;
  transition: all.5s;
  background-color: ${(props) =>
    props.show ? "transparent" : "rgba(0, 32, 116, 0.8)"};
`;

const Logo = styled.a`
  padding: 0;
  width: 130px;
  /* margin-top: 4px; */
  overflow: hidden;
  img {
    width: 100%;
    cursor: pointer;
  }
`;
const LoginButton = styled.a`
  letter-spacing: 1.55px;
  background-color: #ffe100;
  color: #002074;
  padding: 6px 10px;
  border-radius: 10px;
  font-weight: 700;
  border: 3px solid #002074;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    transition: all 0.3s ease 0.3s;
    background-color: rgba(0, 32, 116, 0.7);
    border: 3px solid #ffe100;
    color: #ffe100;
  }
`;

const DropDown = styled.div`
  position: absolute;
  cursor: pointer;
  top: 52px;
  right: 0px;
  width: 100px;
  text-align: center;
  background-color: aliceblue;
  border: 1px solid #222222;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2px;
  padding: 10px;
  opacity: 0;
  /* display: none; */
  box-shadow: rgb(0 0 0 /50%) 0px 0px 18px 0px;
`;

const SignOut = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  &:hover {
    ${DropDown} {
      /* display: block; */
      opacity: 1;
      transition: 1s;
    }
  }
`;

const UserAvatar = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
`;

const initialUserData = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData"))
  : {};

const NavBar = () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  const [userData, setUserData] = useState(initialUserData);

  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else if (user && pathname === "/login") {
        navigate("/");
      }
      // console.log(user);
      return () => {
        unsubscribe();
      };
    });
  }, [pathname]);

  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // console.log(result);
        setUserData(result.user);
        localStorage.setItem("userData", JSON.stringify(result.user));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const listener = () => {
    if (window.scrollY > 50) {
      setShow(true);
    } else {
      setShow(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserData({});
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  return (
    <NavWrapper show={show}>
      <Logo>
        <img
          src={LogoImg}
          alt="logo"
          className=" h-full"
          onClick={() => (window.location.href = "/")}
        />
      </Logo>
      {pathname === "/login" ? (
        <LoginButton onClick={handleAuth}>로그인</LoginButton>
      ) : (
        <SignOut>
          <UserAvatar src={userData.photoURL} alt="UserAvatar" />
          <DropDown onClick={handleLogout}>로그아웃</DropDown>
        </SignOut>
      )}
    </NavWrapper>
  );
};

export default NavBar;
