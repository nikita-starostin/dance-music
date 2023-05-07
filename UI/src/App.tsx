import './App.css';
import React, {useEffect} from "react";
import {Link, useLocation} from 'wouter';
import {FaFilter, FaUser} from "react-icons/fa";
import {AppRouting} from "./shared/appRouting";
import {initSetLocation} from "./state/wouter.state";
import {useRemote} from "./shared/useRemote";


export default function App() {
    const [, setLocation] = useLocation();
    useEffect(() => {
        initSetLocation(setLocation);
    }, []);
    const {data} = useRemote("api/test");
    console.log('app rendered, next line is data:');
    console.log(data);

    return (
        <>
            <div className="flex p-5 justify-between">
                <Link to="/filter">
                    <FaFilter/>
                </Link>
                <div>
                    <FaUser/>
                </div>
            </div>
            <hr/>
            <AppRouting/>
        </>
    );
}
