import { useFormValidator } from "./useFormValidator";
// ------------------ Hook ------------------
export function useMultiStepFormValidator(initial, rules, stepFieldMap, options, externalStep) {
    const base = useFormValidator(initial, rules, options);
    const validateCurrentStep = (customValues) => {
        var _a;
        const valuesToValidate = customValues !== null && customValues !== void 0 ? customValues : base.values;
        const stepToUse = externalStep !== null && externalStep !== void 0 ? externalStep : 1;
        const fieldsToValidate = stepFieldMap[stepToUse];
        const newErrors = {};
        for (const key of fieldsToValidate) {
            const msg = base.validateField(key, valuesToValidate);
            if (msg) {
                newErrors[key] = msg;
            }
        }
        if (((_a = Object.keys(newErrors)) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            base.setErrors(newErrors);
            return { success: false, errors: newErrors };
        }
        return { success: true };
    };
    const isCurrentStepValid = stepFieldMap[(externalStep !== null && externalStep !== void 0 ? externalStep : 1)].every((key) => !base.errors[key]);
    return Object.assign(Object.assign({}, base), { validateCurrentStep,
        isCurrentStepValid });
}
//# sourceMappingURL=useMultiStepFormValidator.js.map