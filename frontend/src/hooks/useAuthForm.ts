import { useState } from "react";

type FormData = Record<string, string>;
type FormErrors = Record<string, string>

export const useAuthForm = (fields: string[]) => {
    const [formData, setFormData] = useState<FormData>(
        fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
    )
    const [errors, setErrors] = useState<FormErrors>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    }

    const validate = (extraValidation?: () => FormErrors): boolean => {
        const newErrors: FormErrors = {};
        for (const field of fields) {
            if (!formData[field]) {
                const capitalField = field.charAt(0).toUpperCase() + field.slice(1);
                newErrors[field] = `${capitalField} cannot be empty`;
            }
            if (field === 'confirmPassword' && !formData[field]) {
                newErrors[field] = `Please confirm the password`
            }
        }
        if (extraValidation) {
            Object.assign(newErrors, extraValidation());
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    return { formData, handleChange, errors, validate };
}