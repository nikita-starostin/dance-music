import {FieldPath, FieldValues, UseFormStateReturn} from "react-hook-form/dist/types";
import {ControllerFieldState, ControllerRenderProps} from "react-hook-form/dist/types/controller";
import React from "react";

export interface IControlProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
}

export default function SelectControl<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
({
     field: {
         onChange,
         value,
         name
     },
     items,
 }: IControlProps<TFieldValues, TName> & {
    items: Array<{ value: string; label: string }>
}) {
    const selectedValue = value as string;

    return <div className="w-full">
        <div className="flex gap-2">
            <select className="form-input-select w-full" value={value} onChange={e => {
                onChange(e.currentTarget.value);
            }}>
                {items.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
        </div>
    </div>;
}
