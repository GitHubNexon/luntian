import { createContext, useState } from "react";

export const MiscContext = createContext();

export function MiscContextProvider({ children }) {
    const [expandSidebar, setExpandSidebar] = useState(false);

    return (
        <MiscContext.Provider value={{
            expandSidebar, setExpandSidebar
        }}>
            {children}
        </MiscContext.Provider>
    );
}
