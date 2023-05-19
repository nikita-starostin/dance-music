import {Route, Switch} from "wouter";
import View from "./pages/View";
import Edit from "./pages/Edit";
import Filter from "./pages/Filter";
import React from "react";
import {navigate} from "./state/wouter.state";
import TrackDetails from "./pages/TrackDetails";

const ClientRoutes = {
    Home: '/',
    Filter: '/filter',
    View: '/view',
    Edit: '/edit',
    TrackDetails: '/view/:trackId'
}

export function goToFilter() {
    navigate(ClientRoutes.Filter);
}

export function goToView() {
    navigate(ClientRoutes.View);
}

export function goToEdit() {
    navigate(ClientRoutes.Edit);
}

export function goToHome() {
    navigate(ClientRoutes.Home);
}

export default function AppRouting() {
    return <Switch>
        <Route path={ClientRoutes.View}>
            <View/>
        </Route>
        <Route path={ClientRoutes.TrackDetails}>
            <TrackDetails />
        </Route>
        <Route path={ClientRoutes.Edit}>
            <Edit/>
        </Route>
        <Route path={ClientRoutes.Filter}>
            <Filter/>
        </Route>
        <Route path={ClientRoutes.Home}>
            <View/>
        </Route>
    </Switch>
}
