import React from 'react';
import './App.css';
import Top from "./Top";
import {OpenAIApiProvider} from "./openai/OpenAIApiContext";

function App() {
    return (
        <div className="App">
            <OpenAIApiProvider>
                <Top/>
            </OpenAIApiProvider>
        </div>
    );
}

export default App;