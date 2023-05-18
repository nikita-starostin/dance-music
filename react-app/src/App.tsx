import './App.css';
import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation} from 'wouter';
import {FaFilter, FaUser} from "react-icons/fa";
import AppRouting from "./appRouting";
import {initSetLocation} from "./state/wouter.state";
import {useLocalization} from "./state/localization.state";
import {DanceTypeTranslations} from "./models";
import {useAtom} from "jotai";
import {filterAtom} from "./state/filter.state";


export default function App() {
    const [, setLocation] = useLocation();
    useEffect(() => {
        initSetLocation(setLocation);
    }, []);
    const [filter] = useAtom(filterAtom);
    const {l} = useLocalization();

    return (
        <div
            className="p-5 font-rubik gap-5 flex flex-col text-white h-screen bg-gradient-to-b from-[#4e376c] via-[#222441] to-[#1D1E35]">
            <div className="flex gap-4 items-center">
                <Link to="/filter">
                    <div className="flex hover:bg-opacity-40 hover:cursor-pointer hover:bg-gray">
                        <div
                            className="border-2 border-r-0 rounded-tl rounded-bl box-border border-gray border-opacity-40 border-solid italic px-2 text-lg bg-opacity-30">
                            {l(DanceTypeTranslations[filter.danceType])}
                            {filter.tags.length > 0 && `; ${filter.tags.join(',')}`}
                        </div>
                        <div className="p-2 bg-gray bg-opacity-30 rounded-tr rounded-br">
                            <FaFilter/>
                        </div>
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
