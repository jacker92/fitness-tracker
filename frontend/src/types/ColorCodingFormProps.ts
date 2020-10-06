export interface ColorCodingFormProps {
    mode: string,
    error?: string,
    yellowStart: number,
    greenStart: number,
    greenEnd: number,
    yellowEnd: number,
    onYellowStartChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    onYellowEndChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    onGreenStartChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    onGreenEndChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
}
