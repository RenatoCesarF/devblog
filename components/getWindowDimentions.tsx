import { useState,useEffect } from "react";
import { FaRegCaretSquareDown } from "react-icons/fa";


const getWindowDimensions = ()=> {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
}
  
const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState({width: 0, height: 0});
  
    useEffect(() => {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      }
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return windowDimensions;
}

export default useWindowDimensions