import React, { useContext, useEffect, useState } from "react";
import { ERC20Context, UniswapV2Router02Context, CurrentAddressContext } from "../hardhat/SymfoniContext";
import { ERC20 } from "../hardhat/typechain/ERC20";
import { ethers } from "ethers";

interface Props {
    tokenA: string;
    tokenB: string;
}

export const Swap: React.FC<Props> = ({ tokenA, tokenB }) => {
    const ERC20Factory = useContext(ERC20Context);
  
    const [tokenAInstance, setTokenAInstance] = useState<ERC20>();
    const [tokenBInstance, setTokenBInstance] = useState<ERC20>();
  
    const [tokenASymbol, setTokenASymbol] = useState<string>();
    const [tokenBSymbol, setTokenBSymbol] = useState<string>();
  
    useEffect(() => {
      if (ERC20Factory.instance) {
        setTokenAInstance(ERC20Factory.instance!.attach(tokenA));
        setTokenBInstance(ERC20Factory.instance!.attach(tokenB));
      }
    }, [ERC20Factory.instance, tokenA, tokenB]);
  
    useEffect(() => {
      const fetchTokenSymbols = async () => {
        if (!tokenAInstance || !tokenBInstance)  {
          return;
        }
        
        setTokenASymbol(await tokenAInstance.symbol());
        setTokenBSymbol(await tokenBInstance.symbol());
      };
      fetchTokenSymbols();
    }, [tokenAInstance, tokenBInstance])
  
    const [amount, setAmount] = useState<number>(0);
  
    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(parseInt(event.target.value));
    };
  
    const router = useContext(UniswapV2Router02Context);
    const [exchangeAmount, setExchangeAmount] = useState<string>("0");
  
    useEffect(() => {
      const fetchExchangeAmount = async () => {
        if (!router.instance) {
          console.log("router instance not found");
          return;
        }
  
        if (amount > 0) {
          // router gets angry if you pass in a 0
          const amountsOut = await router.instance.getAmountsOut(
            ethers.utils.parseEther(amount.toString()),
            [tokenA, tokenB]
          );
          setExchangeAmount(ethers.utils.formatUnits(amountsOut[1].toString(), 18));
        }
      };
  
      fetchExchangeAmount();
    }, [router.instance, amount, tokenA, tokenB]);
  
    const [currentAddress] = useContext(CurrentAddressContext);
  
    const handleSwap = async () => {
      if (!router.instance || !tokenAInstance) {
        console.log("router or token instance not found");
        return;
      }
      const time = Math.floor(Date.now() / 1000) + 3600;
  
      await (
        await tokenAInstance.approve(
          router.instance.address,
          ethers.utils.parseEther(amount.toString())
        )
      ).wait();
      await (
        await router.instance.swapExactTokensForTokens(
          ethers.utils.parseEther(amount.toString()),
          0, // we shouldn't leave this as 0, it is dangerous in real trading
          [tokenA, tokenB],
          currentAddress,
          time
        )
      ).wait();
    };

    let z = Number(exchangeAmount) / Number(amount);
    var rate = z.toFixed(2);


    return (
        <div>
            <div className="bg-red-400 p-6 shadow sm:rounded-lg">
                <div className="w-full">
                    <div className="p-1">
                        <label className="p-5 text-gray-800 text-3xl"> {tokenASymbol}</label>
                        <label className="p-5 text-gray-800 text-3xl"> {'--->'} </label>
                        <label className="p-5 text-gray-800 text-3xl">{tokenBSymbol}</label>
                        <label className="p-5 text-gray-800 text-3xl">Amount: </label>
                        <input className="w-20 rounded"
                                type="number"
                                
                                min="1"
                                step="0.01"
                                placeholder="0.01"
                                onChange={handleAmountChange}
                        />

                        <label className="p-3 text-gray-800 text-3xl">Receive:</label>
                        <input
                            type="text"
                            name="Receive"
                            id="receive"
                            className="w-28 rounded"
                            value={exchangeAmount}
                        />


                        <button
                            type="submit"
                            className="mt-3 inline-flex items-center justify-center px-3 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-gray-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={handleSwap}
                        >
                            Swap
                        </button>
                    </div>
                </div>

                <div className="p-2 bg-red-500 shadow sm:rounded-lg">
                    <div className="w-full">
                        <div className="p-1">
                            <label className="text-gray-800 text-2xl"> Connected Address: </label>
                            <label className="text-gray-800 text-2xl"> {currentAddress} </label>
                        </div>
                    </div>
                </div>

                <div className="p-2 bg-black shadow sm:rounded-lg">
                    <div className="w-full">
                        <div className="p-1">
                            <label className="text-white text-2xl"> Exchange Rate: </label>
                            <label className="text-white text-2xl"> {rate} </label>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
};
