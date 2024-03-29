import React, { useState,useEffect, useTransition } from "react";
import { ethers } from 'ethers';    

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI , signer);
    return transactionContract;

    console.log({
        provider,
        signer,
        transactionContract
    })
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    let [formData, setFormData ] =useState({ addressTo:'',amount:'',keyword:'',message:''});
    const [transactionCount , setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [isLoading , setIsLoading]=useState(false);

    const handleChange= (e,name) => {
        setFormData=((prevState) => ({...prevState,[name]:e.target.value}));
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");

        const accounts = await ethereum.request({method: 'eth_accounts'});

        if(accounts.length){
            setCurrentAccount(accounts[0]);

            //getAllTransactions();
        }
        else 
        {
            console.log("No Accounts Found");
        }
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object');
        }
        
    }
    const connectWallet=async () =>{
        try {
            if(!ethereum) return alert("Please install metamask");

            const accounts = await ethereum.request({method: 'eth_requestAccounts'});

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum objects.");
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum ) return alert("please install metamask.");

            //data from the form;
            const {addressTo,amount,keyword,message }= formData.value;
            const transactionContract = getEthereumContract();   
            const parsedAmount= ethers.utils.parseEther(amount);
            
            await ethereum.request({
                method: 'eth_sendTransactions',
                param: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',
                    value: parsedAmount._hex,                     
                }]

            });
            const transactionHash = await transactionContract.addToBlockchain(addressTo,parsedAmount,message,keyword); 
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getEthereumCount();

            setTransactionCount(transactionCount.toNumber());


        } catch (error) {
            console.log(error);

            throw new Error("No ethereum objects.");
        }
    }

    

    useEffect(() => {
        checkIfWalletIsConnected();
    },[] );
    
    return (
        <TransactionContext.Provider value={{ connectWallet , currentAccount , formData , setFormData , handleChange,sendTransaction}}>
            {children}
        </TransactionContext.Provider>
    );
}