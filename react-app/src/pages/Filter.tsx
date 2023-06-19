import React, {useRef, useState} from "react";
import {filterAtom, FilterKindType, IFilter} from "../state/filter.state";
import {Control, Controller, useFieldArray, useForm} from "react-hook-form";
import {useLocalization} from "../state/localization.state";
import {ClientRoutes, goToHome} from "../appRouting";
import {useAtomValue, useSetAtom} from "jotai";
import {useOnBackspaceGoHome} from "../shared/hooks/useOnBackspaceGoHome";
import {Link} from "wouter";
import {FaArrowLeft, FaEdit} from "react-icons/all";
import Tabs from "../shared/components/Tabs";
import {
    DanceTypes,
    DanceTypesTranslations,
    ListenedBeforeTranslations,
    TiersTranslations,
    TrackDanceTypesByDanceType,
    TrackDanceTypeTranslations
} from "../constants";
import {Artist, DanceType, ListenedBefore, Tags, Tier, TrackDanceType} from "../models";
import MultiselectControl from "../shared/components/MultiselectControl";
import {FieldPath, FieldValues} from "react-hook-form/dist/types";
import {UseFormRegister} from "react-hook-form/dist/types/form";
import SelectControl from "../shared/components/SelectControl";
import {IPattern, patternsAtom, patternTitlesAtom, usePatternActions} from "../state/patterns.state";
import {IControlProps} from "../shared/components/IControlProps";

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
    const {lOrKey} = useLocalization();
    const dancePatternTitles = useAtomValue(patternTitlesAtom);
    const dancePatternTitlesForDanceType = dancePatternTitles
        .filter(p => p.danceTypes.includes(danceType))
        .map(p => p.title);

    return <>
        {dancePatternTitlesForDanceType.map(p => {
            return <option key={p} value={p}>{lOrKey(p)}</option>
        })}
    </>
}

function TrackDanceTypesControl(props: IControlProps<IPattern, `phases.${number}.value.trackDanceTypes`>) {
    const {l} = useLocalization();
    const trackDanceTypes = [
        TrackDanceType.Waltz,
        TrackDanceType.Tango,
        TrackDanceType.VienneseWaltz,
        TrackDanceType.Foxtrot,
        TrackDanceType.Quickstep
    ];

    return <>
        <MultiselectControl {...props}
                            items={trackDanceTypes.map(p => ({value: p, label: l(TrackDanceTypeTranslations[p])}))}/>
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
    const patterns = useAtomValue(patternsAtom);
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

    const formValues = watch();
    const pattern = patterns.find(p => p.title === formValues.dancePattern);
    if (!pattern) {
        return <></>;
    }

    const shouldIgnoreTrackDanceType = pattern.ignoreFields.includes('trackDanceType');

    return <form className="p-5 pt-0 form-fields" onSubmit={handleSubmit(save)}>
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
        <button className="mt-2 btn-primary">{l('Save')}</button>
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
    control: Control<IFilter, IFilter>,
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
    control: Control<IFilter, IFilter>,
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
    const patterns = useAtomValue(patternsAtom);
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
    const pattern = patterns.find(p => p.title === formValues.dancePattern);
    if (!pattern) {
        return <></>;
    }

    const shouldIgnoreTrackDanceType = pattern.ignoreFields.includes('trackDanceType');

    return <form className="p-5 pt-0 form-fields" onSubmit={handleSubmit(save)}>
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
                     fieldControl={ListenedBeforeControl}/>
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
                   label={l('AverageTrackDurationS')}/>
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
        <button className="mt-2 btn-primary">{l('Save')}</button>
    </form>
}

function Pattern() {
    const {l} = useLocalization();
    const {
        patterns,
        addPattern,
        removePattern,
        updatePattern
    } = usePatternActions();
    const initialFilter = useRef(patterns[0]);
    const {register, watch, handleSubmit, control, reset, setValue} = useForm<IPattern>({
        values: initialFilter.current,
    });
    const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

    const submit = (pattern: IPattern) => {
        if (pattern.id) {
            updatePattern(pattern);
        } else {
            addPattern(pattern);
        }
    }

    const setFormWithExistingPatternFromTitle = (title: string) => {
        const pattern = patterns.find(p => p.title === title);
        reset(pattern);
        setActivePhaseIndex(0);
    }

    const setFormWithEmptyPattern = () => {
        reset({
            title: '',
            canBeDeleted: true,
            phases: [],
            danceTypes: [],
            ignoreFields: [],
        });
        setActivePhaseIndex(0);
    }

    const addPhase = () => {
        setValue('phases', [...formValues.phases, {
            title: '',
            value: {
                trackDanceTypes: [],
            }
        }]);
        setActivePhaseIndex(formValues.phases.length);
    }

    const patternTitles = patterns.map(p => p.title);

    const formValues = watch();

    const currentPatternCanBeDeleted = (formValues.id && formValues.canBeDeleted);

    // @ts-ignore
    // @ts-ignore
    return <form className="p-5 pt-0 form-fields" onSubmit={handleSubmit(submit)}>
        <div className="form-field">
            <label>{l('Pattern')}</label>
            <div className="flex gap-2">
                <select className="form-input-select" onChange={(e) => {
                    setFormWithExistingPatternFromTitle(e.target.value)
                }}>
                    {patternTitles.map(title => <option key={title} value={title}>{title}</option>)}
                </select>
                <button className="btn-primary" onClick={setFormWithEmptyPattern}>{l('New')}</button>
                {currentPatternCanBeDeleted && <button className="btn-secondary"
                                                       onClick={() => removePattern(formValues.id)}>{l('Delete')}</button>}
            </div>
        </div>
        <div className="form-field">
            <label>{l('Title')}</label>
            <input className="form-input-text" {...register('title')} type="text"/>
        </div>
        <div className="form-field">
            <label>{l('DanceType')}</label>
            <Controller render={props => <MultiselectControl {...props}/>} name={'danceTypes'} control={control}/>
        </div>
        <label>{l('Phases')}</label>
        <div className="flex gap-3">
            <div className="flex flex-col border-b-white border-b-2 border-b-solid w-[300px]">
                {formValues.phases.map((phase, index) => (
                    <div key={index}
                         className="p-3 flex items-center gap-2 cursor-pointer"
                         data-active={index === activePhaseIndex}>
                        <input className="form-input-text w-[100%]"
                               type="text" {...register(`phases.${index}.title`)} />
                        <div onClick={() => setActivePhaseIndex(index)}><FaEdit/></div>
                    </div>
                ))}
                <button type="button" className="btn-secondary" onClick={() => addPhase()}>{l('Add')}</button>
            </div>
            <div className="flex flex-col gap-2 w-[100%]">
                <div className="form-field">
                    <label>{l('DanceType')}</label>
                    <Controller render={TrackDanceTypesControl}
                                name={`phases.${activePhaseIndex}.value.trackDanceTypes`} control={control}/>
                </div>
            </div>
        </div>

        <button className="mt-2 btn-primary">{l('Save')}</button>
    </form>
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
                    <div role="button" className="text-2xl cursor-pointer">
                        <FaArrowLeft/>
                    </div>
                </Link>
                {l('TracksFilter')}
            </div>
            <div className="tabs-container min-w-[500px] h-[700px] max-h-[700px] pb-3 overflow-auto overflow-x-hidden">
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
