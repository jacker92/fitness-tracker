export interface CheckboxProps {
    isChecked?: boolean,
    label: string,
    name: string,
    id: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value?: string | number
}
