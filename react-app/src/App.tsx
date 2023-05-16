import './App.css';
import React, {useEffect} from "react";
import {Link, useLocation} from 'wouter';
import {FaFilter, FaUser} from "react-icons/fa";
import {AppRouting} from "./shared/appRouting";
import {initSetLocation} from "./state/wouter.state";


export default function App() {
    const [, setLocation] = useLocation();
    useEffect(() => {
        initSetLocation(setLocation);
    }, []);

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
