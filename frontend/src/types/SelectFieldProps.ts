export interface SelectFieldProps {
    name: string,
    label: string,
    value?: string | number,
    id: string,
    error?: string,
    success?: string,
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    requiredField?: boolean,
    showErrorMessage?: boolean,
    doesErrorContainHtml?: boolean,
    showSuccessMessage?: boolean,
    valueList: Array<{ value: number | string, text: string}>,
    includeBlank?: boolean
}
