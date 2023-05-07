import {DanceType} from "../models";
import React, {useCallback} from "react";
import {filterState, IFilter} from "../state/filter.state";
import {Controller, useForm} from "react-hook-form";
import {useLocalization} from "../state/localization.state";
import {goToView} from "../shared/appRouting";
import {ILocaleStrings} from "../shared/localization/ILocaleStrings";
import MultiselectControl from "../shared/components/MultiselectControl";

const DanceTypes = [
    DanceType.Foxtrot,
    DanceType.Waltz,
    DanceType.Tango,
    DanceType.VienneseWaltz,
    DanceType.Quickstep,
];

const DanceTypeTranslations: Record<DanceType, keyof ILocaleStrings> = {
    [DanceType.Foxtrot]: 'Foxtrot',
    [DanceType.Waltz]: 'Waltz',
    [DanceType.Tango]: 'Tango',
    [DanceType.VienneseWaltz]: 'VienneseWaltz',
    [DanceType.Quickstep]: 'Quickstep',
};

export default function Filter() {
    const {register, handleSubmit, control} = useForm({
        values: filterState.get()
    });

    const l = useLocalization();

    const onSubmit = useCallback((data: IFilter) => {
        filterState.set(data);
        goToView();
    }, []);

    return <div className="p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
            <select {...register('danceType')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 w-48 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {DanceTypes.map(p => {
                    return <option key={p} value={p}>{l[DanceTypeTranslations[p]]}</option>;
                })}
            </select>
            <div className="relative mt-2">
                <input type="text"
                       id="artist"
                       className="block rounded-t-lg px-2.5 pb-2.5 pt-5 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 w-48 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                       {...register('artist')}
                       placeholder=" "/>
                <label htmlFor="artist"
                       className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Artist</label>
            </div>
            <div className="relative mt-2">
                <Controller render={props => <MultiselectControl {...props}/>} name="tags" control={control}/>
            </div>
            <button type="submit" className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {l.Save}
            </button>
        </form>
    </div>;
}
