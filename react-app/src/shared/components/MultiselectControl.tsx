﻿import {FieldPath, FieldValues, UseFormStateReturn} from "react-hook-form/dist/types";
import {ControllerFieldState, ControllerRenderProps} from "react-hook-form/dist/types/controller";
import React, {useState} from "react";
import {FaPlus} from "react-icons/all";
import {useLocalization} from "../../state/localization.state";

export interface IControlProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
}

export default function MultiselectControl<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
({
     field: {
         onChange,
         value,
         name
     },
     items,
 }: IControlProps<TFieldValues, TName> & {
    items?: Array<{ value: string; label: string }>
}) {
    const {l} = useLocalization();
    const selectedValues = value as string[] || [];
    const [tag, setTag] = useState<string>('');

    const TextInput = () => {
        return <>
            <div className="relative">
                <input
                    className="form-input-text"
                    value={tag}
                    id={name}
                    onInput={e => setTag(e.currentTarget.value)}
                    onChange={e => () => setTag(e.target.value)}/>
            </div>
            <button type="button"
                    className="btn-secondary"
                    onClick={() => {
                        if (!tag) return;
                        onChange([...selectedValues, tag]);
                        setTag('');
                    }}><FaPlus/>
            </button>
        </>
    }

    const SelectInput = () => {
        const notSelectedItems = items!.filter(p => !selectedValues.includes(p.value));
        const allItemsSelected = notSelectedItems.length === 0;
        return <div className="flex flex-col w-full">
            <select className="form-input-select w-full" disabled={allItemsSelected} value={""} onChange={e => {
                onChange([...selectedValues, e.currentTarget.value]);
            }}>
                <option className="hidden" key={""} value={""}></option>
                {notSelectedItems
                    .map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            {allItemsSelected && <div>{l('AllPossibleItemsSelected')}</div>}
        </div>;
    }

    return <div className="w-full">
        <div className="flex items-center gap-1">
            {items ? <SelectInput/> : <TextInput/>}
        </div>
        <div className="flex gap-2">
            {selectedValues.map((p, i) => <div key={i}
                                               className="flex items-center gap-2 rounded border-1 px-2 py-1 mt-1 bg-white text-black border-black">
                <div>{p}</div>
                <div className="cursor-pointer" onClick={() => {
                    onChange(selectedValues.filter((_, j) => j !== i));
                }}>x
                </div>
            </div>)}
        </div>
    </div>;
}
