import {DanceTypes, DanceTypeTranslations} from "../models";
import {useCallback, useEffect, useRef} from "react";
import {filterAtom, IFilter} from "../state/filter.state";
import {Controller, useForm} from "react-hook-form";
import {useLocalization} from "../state/localization.state";
import {goToView} from "../appRouting";
import MultiselectControl from "../shared/components/MultiselectControl";
import {useAtom, useAtomValue, useSetAtom} from "jotai";

export default function Filter() {
    const setFilter = useSetAtom(filterAtom);
    const initialFilter = useRef(useAtomValue(filterAtom));
    const {register, watch, handleSubmit, control} = useForm({
        values: initialFilter.current,
    });

    const values = watch();
    useEffect(() => {
        setFilter(values);
    }, [values.danceType, values.tags.length]);

    const {l} = useLocalization();

    const onSubmit = useCallback(()  => {
        goToView();
    }, []);

    const cancel = useCallback(() => {
        setFilter(initialFilter.current);
        goToView();
    }, []);

    return <form className="app-attract p-5 flex flex-col gap-3 items-start" onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label>Танец</label>
            <select {...register('danceType')}
                    className="border border-white text-black text-sm rounded-lg focus:ring-blue-500 w-48 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {DanceTypes.map(p => {
                    return <option key={p} value={p}>{l(DanceTypeTranslations[p])}</option>;
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
            <button type="button" className="btn-secondary" onClick={cancel}>
                {l('Cancel')}
            </button>
        </div>
    </form>;
}
