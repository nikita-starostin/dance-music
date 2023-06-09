import './App.css';
import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation} from 'wouter';
import {FaFilter, FaUser} from "react-icons/fa";
import AppRouting, {ClientRoutes} from "./appRouting";
import {initSetLocation} from "./state/wouter.state";
import {useLocalization} from "./state/localization.state";
import {useAtom} from "jotai";
import {filterAtom} from "./state/filter.state";
import {useProfile} from "./api/hooks/useProfile";
import {useIsAuth} from "./state/auth.state";
import {TrackDanceTypeTranslations} from "./constants";

function useTimeoutToInitJotaiFromLocalStorage() {
    const [isInit, setIsInit] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsInit(true);
        }, 500);
        return () => {
            clearTimeout(timeout);
        };
    }, []);
    return isInit;
}

export default function App() {
    const [, setLocation] = useLocation();
    useEffect(() => {
        initSetLocation(setLocation);
    }, []);
    const [filter] = useAtom(filterAtom);
    const {l} = useLocalization();
    const {profile} = useProfile();
    const {isAuth} = useIsAuth();
    const isInit = useTimeoutToInitJotaiFromLocalStorage();

    return !isInit ? <></> : (
        <div
            className="p-5 font-rubik gap-5 flex flex-col text-white h-screen gradient-bg">
            <div className="flex gap-4 justify-between">
                <Link to={ClientRoutes.Filter}>
                    <div className="flex hover:bg-opacity-40 hover:cursor-pointer hover:bg-gray">
                        <div className="p-2 bg-gray bg-opacity-30 rounded-tl rounded-bl">
                            <FaFilter />
                        </div>
                        <div
                            className="border-2 border-l-0 rounded-tr rounded-br box-border border-gray border-opacity-40 border-solid italic px-2 text-lg bg-opacity-30">
                            {l(TrackDanceTypeTranslations[filter.trackDanceType])}
                            {filter.tags.length > 0 && `; ${filter.tags.join(',')}`}
                        </div>
                    </div>
                </Link>
                <Link to={ClientRoutes.Profile}>
                    <div className="p-2 py-0 app-attract app-attract-hover  flex gap-2 items-center">
                        {!isAuth && <FaUser/>}
                        {isAuth && profile && profile.name && <span>{profile.name}</span>}
                        {isAuth && !profile && <FaUser/>}
                        {isAuth && profile && !profile.avatar && <FaUser/>}
                        {isAuth && profile && profile.avatar && <img className="rounded-full w-[22px] h-[22px]" src={profile.avatar}/>}
                    </div>
                </Link>
            </div>
            <div className="flex flex-grow flex-col overflow-hidden">
                <AppRouting/>
            </div>
        </div>
    );
}
