export interface SelectFieldProps {
    name: string,
    label: string,
    value?: any,
    id: string,
    error?: string,
    success?: string,
    onChange?: Function,
    requiredField?: boolean,
    showErrorMessage?: boolean,
    doesErrorContainHtml?: boolean,
    showSuccessMessage?: boolean,
    valueList: any,
    includeBlank?: boolean
}
