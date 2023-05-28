import {createContext, ReactNode, useContext} from 'react';
import {Configuration, OpenAIApi} from "openai";

const OpenAIApiContext = createContext<OpenAIApi | undefined>(undefined);

export const useOpenAIApiContext = () => useContext(OpenAIApiContext);

export const OpenAIApiProvider = ({children}: { children: ReactNode }) => {
    const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        organization: process.env.REACT_APP_OPENAI_ORGANIZATION,
    });
    const openaiApi = new OpenAIApi(configuration);

    return (
        <OpenAIApiContext.Provider value={openaiApi}>
            {children}
        </OpenAIApiContext.Provider>
    );
}