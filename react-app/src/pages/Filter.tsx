import React, {useCallback, useEffect, useRef} from "react";
import {filterAtom, IFilter, IgnoredFieldsByDancePattern} from "../state/filter.state";
import {Controller, useForm} from "react-hook-form";
import {useLocalization} from "../state/localization.state";
import {ClientRoutes, goToHome, goToView} from "../appRouting";
import MultiselectControl from "../shared/components/MultiselectControl";
import {useAtomValue, useSetAtom} from "jotai";
import {useOnBackspaceGoHome} from "../shared/hooks/useOnBackspaceGoHome";
import {Link} from "wouter";
import {FaArrowLeft} from "react-icons/all";
import Tabs from "../shared/components/Tabs";
import {
    DancePatternByDanceType,
    DancePatternTranslations,
    DanceTypes,
    DanceTypesTranslations, TrackDanceTypesByDanceType,
    TrackDanceTypeTranslations
} from "../constants";
import {DanceType} from "../models";

function DanceTypesOptions() {
    const {l} = useLocalization();

    return <>
        {DanceTypes.map(p => {
            return <option key={p} value={p}>{l(DanceTypesTranslations[p])}</option>
        })}
    </>
}

function DancePatternOptions({danceType}: { danceType: DanceType }) {
    const {l} = useLocalization();
    const dancePatterns = DancePatternByDanceType[danceType];

    return <>
        {dancePatterns.map(p => {
            return <option key={p} value={p}>{l(DancePatternTranslations[p])}</option>
        })}
    </>
}

function TrackDanceTypesOptions({danceType}: { danceType: DanceType }) {
    const {l} = useLocalization();
    const dances = TrackDanceTypesByDanceType[danceType];

    return <>
        {dances.map(p => {
            return <option key={p} value={p}>{l(TrackDanceTypeTranslations[p])}</option>
        })}
    </>
}

function BasicFilter() {
    const {l} = useLocalization();
    const setFilter = useSetAtom(filterAtom);
    const initialFilter = useRef(useAtomValue(filterAtom));
    const {register, watch, handleSubmit, control} = useForm({
        defaultValues: initialFilter.current,
    });

    const save = (data: IFilter) => {
        setFilter(data);
        goToHome();
    };

    const selectedDanceType = watch('danceType');
    const selectedDancePattern = watch('dancePattern');
    const shouldIgnoreTrackDanceType = IgnoredFieldsByDancePattern[selectedDancePattern].includes('trackDanceType');

    return <form className="form-fields p-5 pt-0" onSubmit={handleSubmit(save)}>
        <div className="form-field">
            <label>{l('DancesKind')}</label>
            <select {...register('danceType')} className="form-input-select">
                <DanceTypesOptions/>
            </select>
        </div>
        <div className="form-field">
            <label>{l('Pattern')}</label>
            <select {...register('dancePattern')} className="form-input-select">
                <DancePatternOptions danceType={selectedDanceType}/>
            </select>
        </div>
        {!shouldIgnoreTrackDanceType && <div className="form-field">
            <label>{l('Dance')}</label>
            <select {...register('trackDanceType')} className="form-input-select">
                <TrackDanceTypesOptions danceType={selectedDanceType}/>
            </select>
        </div>}
        <button className="btn-primary mt-2">{l('Save')}</button>
    </form>
}

function AdvancedFilter() {
    const {l} = useLocalization();
    const setFilter = useSetAtom(filterAtom);
    const initialFilter = useRef(useAtomValue(filterAtom));
    const {register, watch, handleSubmit, control} = useForm({
        values: initialFilter.current,
    });
    useOnBackspaceGoHome();

    const values = watch();
    useEffect(() => {
        setFilter(values);
    }, [values.danceType, values.tags.length]);

    const onSubmit = useCallback(() => {
        goToView();
    }, []);
    return <form className="p-5 flex flex-col gap-3 items-start" onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label>{l('DanceType')}</label>
            <select {...register('danceType')}
                    className="form-input-select">
                {DanceTypes.map(p => {
                    return <option key={p} value={p}>{l(TrackDanceTypeTranslations[p])}</option>;
                })}
            </select>
        </div>
        <div className="relative mt-2">
            <label>{l('Tags')}</label>
            <Controller render={props => <MultiselectControl {...props}/>} name="tags" control={control}/>
        </div>
        <div className="mt-2 flex gap-2">
            <button type="submit" className="btn-primary">
                {l('Save')}
            </button>
        </div>
    </form>

}

function Pattern() {
    return <div>Pattern</div>
}

function History() {
    return <div>History</div>
}

export default function Filter() {
    const {l} = useLocalization();
    useOnBackspaceGoHome();

    return <div className="fixed-layout-container">
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <Link to={ClientRoutes.Home}>
                    <div role="button" className="cursor-pointer text-2xl">
                        <FaArrowLeft/>
                    </div>
                </Link>
                {l('TracksFilter')}
            </div>
            <div className="tabs-container h-[500px]">
                <Tabs tabs={[
                    {tabId: 'standard', component: BasicFilter, label: l('Basic')},
                    {tabId: 'advanced', component: AdvancedFilter, label: l('Advanced')},
                    {tabId: 'pattern', component: Pattern, label: l('Pattern')},
                    {tabId: 'history', component: History, label: l('History')},
                ]}/>
            </div>
        </div>
    </div>;
}
