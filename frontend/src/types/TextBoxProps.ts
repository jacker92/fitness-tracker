export interface TextBoxProps {
    name: string,
    label: string,
    type?: string,
    value?: string | number,
    id: string,
    disabled?: boolean,
    readonly?: boolean,
    error?: string,
    success?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    validationRule?: string,
    validate?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    validationArgs?: { min: number, max: number },
    showErrorMessage?: boolean,
    doesErrorContainHtml?: boolean,
    showSuccessMessage?: boolean,
    onErrorChange?: (error: string) => void,
    autocomplete?: string,
    ref?: React.Ref<HTMLInputElement>,
}
