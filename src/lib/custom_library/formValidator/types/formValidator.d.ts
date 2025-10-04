export type ValidationRule = {
    type: "required";
    message?: string;
} | {
    type: "email";
    message?: string;
} | {
    type: "number";
    message?: string;
} | {
    type: "length";
    length: number;
    message?: string;
} | {
    type: "minLength";
    length: number;
    message?: string;
} | {
    type: "maxLength";
    length: number;
    message?: string;
} | {
    type: "match";
    field: string;
    message?: string;
} | {
    type: "confirm";
    field: string;
    message?: string;
} | {
    type: "custom";
    validate: (value: any, allValues: Record<string, any>) => boolean;
    message?: string;
};
export type Rules<T> = Partial<Record<keyof T, ValidationRule[]>>;
export type ErrorMap<T> = Partial<Record<string, string>>;
export interface UseFormValidatorOptions {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    debounce?: number;
}
