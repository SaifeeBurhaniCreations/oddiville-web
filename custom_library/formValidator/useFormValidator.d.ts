import { ErrorMap, Rules, UseFormValidatorOptions } from "./types/formValidator";
export declare function useFormValidator<T extends Record<string, any>>(initial: Partial<T>, rules: Rules<T>, options?: UseFormValidatorOptions): {
    values: any;
    errors: any;
    setField: (key: string, value: any) => void;
    setFields: (updates: Partial<T>) => void;
    validateForm: (customValues?: T) => {
        success: true;
        data: T;
    } | {
        success: false;
        errors: ErrorMap<T>;
    };
    validateField: (key: string, customValues?: T) => string | undefined;
    setError: (key: string, message: string) => void;
    setErrors: (allErrors: ErrorMap<T>) => void;
    resetForm: () => void;
    isValid: boolean;
};
