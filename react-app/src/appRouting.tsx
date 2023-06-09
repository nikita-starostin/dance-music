﻿import {Route, Switch} from "wouter";
import Playlist from "./pages/Playlist";
import Filter from "./pages/Filter";
import React from "react";
import {navigate} from "./state/wouter.state";
import TrackDetails from "./pages/TrackDetails";
import Profile from "./pages/Profile";

export const ClientRoutes = {
    Home: '/',
    Filter: '/filter',
    Playlist: '/playlist',
    TrackDetails: '/playlist/:trackId',
    Profile: '/profile',
}

export function goToFilter() {
    navigate(ClientRoutes.Filter);
}

export function goToView() {
    navigate(ClientRoutes.Playlist);
}

export function goToHome() {
    navigate(ClientRoutes.Home);
}

export function goToProfile() {
    navigate(ClientRoutes.Profile);
}

export default function AppRouting() {
    return <Switch>
        <Route path={ClientRoutes.Playlist}>
            <Playlist/>
        </Route>
        <Route path={ClientRoutes.TrackDetails}>
            <TrackDetails />
        </Route>
        <Route path={ClientRoutes.Filter}>
            <Filter/>
        </Route>
        <Route path={ClientRoutes.Home}>
            <Playlist/>
        </Route>
        <Route path={ClientRoutes.Profile}>
            <Profile />
        </Route>
    </Switch>
}
