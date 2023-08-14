import { useEffect } from "react";

export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listner = (event) => {
      // 모달 안을 클릭했는지
      // console.log(event);
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      // 모달 밖을 클릭했는지
      handler();
    };

    document.addEventListener("mousedown", listner);

    return () => {
      document.removeEventListener("mousedown", listner);
    };
  }, []);
}
