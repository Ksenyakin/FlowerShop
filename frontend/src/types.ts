export interface IProduct {
    id: number;
    name: string;
    image_url: string;
    price: number;
    top_product?: boolean | string;
    // Дополнительные поля для страницы товара:
    category_id?: number;
    description?: string;
    stock?: number;
    createdAt?: string;
    updatedAt?: string;
}
