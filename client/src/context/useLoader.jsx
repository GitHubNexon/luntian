import { createContext, useContext, useState } from "react";
import "../styles/custom.css"

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {

    const [show, setShow] = useState(false);

    function loading(state){
        setShow(state);
    }

    return (
        <LoaderContext.Provider value={{loading}}>
            <div className={`flex justify-center items-center h-screen loader transition duration-500 ${show ? 'opacity-1 visible' : 'opacity-0 invisible'}`}>
             <div className="loaderSpin"></div>
            </div>
            { children }
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);