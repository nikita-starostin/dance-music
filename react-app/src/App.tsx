import './App.css';
import React, {useEffect, useRef} from "react";
import {Link, useLocation} from 'wouter';
import {FaFilter, FaUser} from "react-icons/fa";
import AppRouting from "./appRouting";
import {initSetLocation} from "./state/wouter.state";
import {filterState} from "./state/filter.state";
import {useLocalization} from "./state/localization.state";
import {DanceTypeTranslations} from "./models";


export default function App() {
    const [, setLocation] = useLocation();
    useEffect(() => {
        initSetLocation(setLocation);
    }, []);
    const filter = useRef(filterState.get());
    const { l } = useLocalization();

    return (
        <div className="p-5 font-rubik gap-5 flex flex-col text-white h-screen bg-gradient-to-b from-[#4e376c] via-[#222441] to-[#1D1E35]">
            <div className="flex gap-4 items-center">
                <div className="italic text-lg rounded bg-opacity-30">
                    {l(DanceTypeTranslations[filter.current.danceType])}
                </div>
                <Link to="/filter" >
                    <div className="p-2 app-attract app-attract-hover">
                        <FaFilter/>
                    </div>
                </Link>
                <div className="p-2 app-attract app-attract-hover">
                    <FaUser/>
                </div>
            </div>
            <div className="flex flex-grow flex-col overflow-hidden">
                <AppRouting/>
            </div>
        </div>
    );
}
