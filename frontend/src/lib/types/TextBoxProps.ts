export interface TextBoxProps {
    name: string,
    label: string,
    type?: string,
    value?: any,
    id: string,
    disabled?: boolean,
    readonly?: boolean,
    error?: string,
    success?: string,
    onChange?: Function,
    validationRule?: string,
    validate?: Function,
    validationArgs?: { min: number, max: number },
    showErrorMessage?: boolean,
    doesErrorContainHtml?: boolean,
    showSuccessMessage?: boolean,
    onErrorChange?: Function,
    autocomplete?: string
}