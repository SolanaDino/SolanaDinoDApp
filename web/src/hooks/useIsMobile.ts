import { useState, useEffect } from "react";

// Use to see if currently mobile || < 990px
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 990);

    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 990);
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return { isMobile };
};
