import React, { useContext } from "react";
import "./App.css";
import { Symfoni, CurrentAddressContext } from "./hardhat/SymfoniContext";
import { Swap } from "./components/Swap";


function App() {


  
  

  return (
    <div className="App">
      <Symfoni autoInit={true} >
        <div className="min-h-screen bg-gray-500 font-sans border-box">
          <div className="max-w-5xl mx-auto sm:px-6 lg:px-8" >                
            <div className="text-gray-100 text-6xl pt-28 pb-10 border-1px">
              deX $wap
            </div>
            <Swap
              tokenA="0xbA04725116854CF83e7C841DCFF7e9E32CE48A78"
              tokenB="0x99c98ADab1Fd2A77f5C394153A20c9Db6D9d393a"
            ></Swap>
          </div>
        </div>
      </Symfoni>
    </div>
  );
}

export default App;
