import {FieldPath, FieldValues, UseFormStateReturn} from "react-hook-form/dist/types";
import {ControllerFieldState, ControllerRenderProps} from "react-hook-form/dist/types/controller";
import React, {useState} from "react";
import {useLocalization} from "../../state/localization.state";

export default function MultiselectControl<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
({
     field: {
         onChange,
         value,
         name
     },
 }: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
}) {
    const items = value as string[];
    const [tag, setTag] = useState<string>('');
    const l = useLocalization();

    return <div>
        <div className="flex items-end gap-1">
            <div className="relative">
                <input
                    className="block rounded-t-lg px-2.5 pb-2.5 pt-5 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 w-48 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    value={tag}
                    id={name}
                    onInput={e => setTag(e.currentTarget.value)}
                    onChange={e => () => setTag(e.target.value)}
                />
                <label htmlFor={name}
                       className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Тег</label>
            </div>
            <button type="button"
                    className="py-2 px-4 rounded border-2 hover:bg-gray-100"
                    onClick={() => {
                        onChange([...items, tag]);
                        setTag('');
                    }}>{l.Add}
            </button>
        </div>
        <div className="flex gap-2">
            {items.map((p, i) => <div key={i} className="flex items-center gap-1 border-2 px-2 py-1 mt-1">
                <div>{p}</div>
                <div className="cursor-pointer" onClick={() => {
                    onChange(items.filter((_, j) => j !== i));
                }}>x
                </div>
            </div>)}
        </div>
    </div>;
}
