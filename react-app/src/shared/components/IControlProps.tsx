import {FieldPath, FieldValues, UseFormStateReturn} from "react-hook-form/dist/types";
import {ControllerFieldState, ControllerRenderProps} from "react-hook-form/dist/types/controller";

export interface IControlProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
}