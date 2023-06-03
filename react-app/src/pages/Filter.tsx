import React, {useRef} from "react";
import {filterAtom, FilterKindType, IFilter, IgnoredFieldsByDancePattern} from "../state/filter.state";
import {Control, Controller, RegisterOptions, useForm, UseFormRegisterReturn} from "react-hook-form";
import {useLocalization} from "../state/localization.state";
import {ClientRoutes, goToHome} from "../appRouting";
import {useAtomValue, useSetAtom} from "jotai";
import {useOnBackspaceGoHome} from "../shared/hooks/useOnBackspaceGoHome";
import {Link} from "wouter";
import {FaArrowLeft} from "react-icons/all";
import Tabs from "../shared/components/Tabs";
import {
    DancePatternByDanceType,
    DancePatternTranslations,
    DanceTypes,
    DanceTypesTranslations, ListenedBeforeTranslations, TiersTranslations,
    TrackDanceTypesByDanceType,
    TrackDanceTypeTranslations
} from "../constants";
import {Artist, DanceType, ListenedBefore, Tags, Tier} from "../models";
import MultiselectControl, {IControlProps} from "../shared/components/MultiselectControl";
import {FieldValues} from "react-hook-form/dist/types";
import {UseFormRegister} from "react-hook-form/dist/types/form";
import SelectControl from "../shared/components/SelectControl";

function ListenedBeforeControl(props: IControlProps<IFilter, keyof IFilter>) {
    const {l} = useLocalization();
    const items = [
        ListenedBefore.Yes,
        ListenedBefore.No,
        ListenedBefore.LastWeek
    ].map(p => ({value: p, label: l(ListenedBeforeTranslations[p])}));

    return <>
        <SelectControl {...props} items={items}/>
    </>
}

function TagsControl(props: IControlProps<IFilter, keyof IFilter>) {
    const tags = [Tags.Ru, Tags.En].map(p => ({value: p, label: p}));

    return <>
        <MultiselectControl {...props} items={tags}/>
    </>
}

function TiersControl(props: IControlProps<IFilter, keyof IFilter>) {
    const {l} = useLocalization();
    const tiers = [Tier.Free, Tier.Premium].map(p => ({value: p, label: l(TiersTranslations[p])}));

    return <>
        <MultiselectControl {...props} items={tiers}/>
    </>
}

function CollectionsControl(props: IControlProps<IFilter, keyof IFilter>) {
    const {l} = useLocalization();
    const collections = ['Collection 1', 'Collection 2'].map(p => ({value: p, label: p}));

    return <>
        <MultiselectControl {...props} items={collections}/>
    </>
}

function ArtistsControl(props: IControlProps<IFilter, keyof IFilter>) {
    const artists = [Artist.DjMaksy].map(p => ({value: p, label: p}));

    return <>
        <MultiselectControl {...props} items={artists}/>
    </>
}

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
    const {register, watch, handleSubmit} = useForm({
        defaultValues: initialFilter.current,
    });

    const save = (data: IFilter) => {
        setFilter({
            ...data,
            kind: FilterKindType.Basic,
        });
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

function TextField({register, formValues, fieldName, fieldNameEnabled, label}: {
    register: UseFormRegister<IFilter>,
    formValues: FieldValues,
    fieldName: keyof IFilter,
    fieldNameEnabled: keyof IFilter,
    label: string,
}) {
    const {l} = useLocalization();

    return <div className="form-field">
        <label>{label}</label>
        <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
                <input id={fieldNameEnabled} {...register(fieldNameEnabled)} type="checkbox" className="form-input"/>
                <label htmlFor={fieldNameEnabled} className="cursor-pointer">{l('Enabled')}</label>
            </div>
            {formValues[fieldNameEnabled] && <input className="form-input-text" {...register(fieldName)} type="text"/>}
        </div>
    </div>;
}

function SelectField({register, formValues, control, fieldName, fieldNameEnabled, label, fieldControl}: {
    register: UseFormRegister<IFilter>,
    formValues: FieldValues,
    control: Control<IFilter, any>,
    fieldName: keyof IFilter,
    fieldNameEnabled: keyof IFilter,
    label: string,
    fieldControl: (props: IControlProps<IFilter, keyof IFilter>) => JSX.Element,
}) {
    const {l} = useLocalization();

    return <div className="form-field">
        <label>{label}</label>
        <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
                <input id={fieldNameEnabled} {...register(fieldNameEnabled)} type="checkbox" className="form-input"/>
                <label htmlFor={fieldNameEnabled} className="cursor-pointer">{l('Enabled')}</label>
            </div>
            {formValues[fieldNameEnabled] && <Controller render={fieldControl}
                                                         name={fieldName}
                                                         control={control}/>}
        </div>
    </div>;

}

function ArrayField({register, formValues, control, fieldName, fieldNameEnabled, label, fieldControl}: {
    register: UseFormRegister<IFilter>,
    formValues: FieldValues,
    control: Control<IFilter, any>,
    fieldName: keyof IFilter,
    fieldNameEnabled: keyof IFilter,
    label: string,
    fieldControl: (props: IControlProps<IFilter, keyof IFilter>) => JSX.Element,
}) {
    const {l} = useLocalization();

    return <div className="form-field">
        <label>{label}</label>
        <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
                <input id={fieldNameEnabled} {...register(fieldNameEnabled)} type="checkbox" className="form-input"/>
                <label htmlFor={fieldNameEnabled} className="cursor-pointer">{l('Enabled')}</label>
            </div>
            {formValues[fieldNameEnabled] && <Controller render={fieldControl}
                                                         name={fieldName}
                                                         control={control}/>}
        </div>
    </div>;
}

function AdvancedFilter() {
    const {l} = useLocalization();
    const setFilter = useSetAtom(filterAtom);
    const initialFilter = useRef(useAtomValue(filterAtom));
    const {register, watch, handleSubmit, control} = useForm({
        values: initialFilter.current,
    });

    const save = (newFilter: IFilter) => {
        setFilter({
            ...newFilter,
            kind: FilterKindType.Advanced,
        })
        goToHome();
    };

    const formValues = watch();
    const shouldIgnoreTrackDanceType = IgnoredFieldsByDancePattern[formValues.dancePattern].includes('trackDanceType');

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
                <DancePatternOptions danceType={formValues.danceType}/>
            </select>
        </div>
        {!shouldIgnoreTrackDanceType && <div className="form-field">
            <label>{l('Dance')}</label>
            <select {...register('trackDanceType')} className="form-input-select">
                <TrackDanceTypesOptions danceType={formValues.danceType}/>
            </select>
        </div>}
        <ArrayField register={register}
                    formValues={formValues}
                    control={control}
                    fieldName={'tags'}
                    fieldNameEnabled={'tagsEnabled'}
                    label={l('Tags')}
                    fieldControl={TagsControl}/>
        <ArrayField register={register}
                    formValues={formValues}
                    control={control}
                    fieldName={'artists'}
                    fieldNameEnabled={'artistsEnabled'}
                    label={l('Artists')}
                    fieldControl={ArtistsControl}/>
        <ArrayField register={register}
                    formValues={formValues}
                    control={control}
                    fieldName={'tiers'}
                    fieldNameEnabled={'tiersEnabled'}
                    label={l('Tiers')}
                    fieldControl={TiersControl}/>
        <SelectField register={register}
                     formValues={formValues}
                     control={control}
                     fieldName={'listenedBefore'}
                     fieldNameEnabled={'listenedBeforeEnabled'}
                     label={l('ListenedBefore')}
                     fieldControl={TiersControl}/>
        <ArrayField register={register}
                    formValues={formValues}
                    control={control}
                    fieldName={'collections'}
                    fieldNameEnabled={'collectionsEnabled'}
                    label={l('Collections')}
                    fieldControl={CollectionsControl}/>
        <div className="form-field">
            <label>{l('TracksCount')}</label>
            <input className="form-input-text" {...register('tracksCount')} type="number"/>
        </div>
        <TextField register={register}
                   formValues={formValues}
                   fieldName={'averageTrackDurationS'}
                   fieldNameEnabled={'averageTrackDurationEnabled'}
                   label={l('AverateTrackDurationS')}/>
        <TextField register={register}
                   formValues={formValues}
                   fieldName={'totalPlayListDurationS'}
                   fieldNameEnabled={'totalPlayListDurationEnabled'}
                   label={l('TotalPlaylistDurationS')}/>
        <TextField register={register}
                   formValues={formValues}
                   fieldName={'rating'}
                   fieldNameEnabled={'ratingEnabled'}
                   label={l('Rating')}/>
        <button className="btn-primary mt-2">{l('Save')}</button>
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
    const filter = useAtomValue(filterAtom);
    const initialTabIndexRef = useRef({
        [FilterKindType.Basic]: 0,
        [FilterKindType.History]: 3,
        [FilterKindType.Advanced]: 1,
    }[filter.kind]);

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
            <div className="tabs-container h-[700px] max-h-[700px] pb-3 overflow-auto overflow-x-hidden">
                <Tabs initialIndex={initialTabIndexRef.current}
                      tabs={[
                          {tabId: 'standard', component: BasicFilter, label: l('Basic')},
                          {tabId: 'advanced', component: AdvancedFilter, label: l('Advanced')},
                          {tabId: 'pattern', component: Pattern, label: l('Pattern')},
                          {tabId: 'history', component: History, label: l('History')},
                      ]}/>
            </div>
        </div>
    </div>;
}
