export interface ConfirmProps {
    visible: boolean,
    text: string,
    yesButtonText?: string,
    noButtonText?: string,
    width?: number,
    height?: string | number,
    onConfirm: () => void,
    onCancel: () => void
}
