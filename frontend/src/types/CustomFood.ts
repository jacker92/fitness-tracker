export interface CustomFood {
    id: number,
    userId?: string,
    name: string,
    calories?: number,
    protein?: number,
    carbohydrates?: number,
    fat?: number,
    sugar?: number,
    isAlcoholic: boolean,
    isPublic: boolean,
}
