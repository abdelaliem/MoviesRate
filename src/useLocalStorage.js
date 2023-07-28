import { useEffect, useState } from "react";

export function useLocalStorageState(initialState,key){
    const [value,setvalue] = useState(function(){
        const storedValue = localStorage.getItem(key)
        return JSON.parse(storedValue)
    })
    useEffect(function(){
        localStorage.setItem('watched',JSON.stringify(key))
    },[value,key])
    return [value,setvalue]
}