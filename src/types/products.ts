export interface ProductVariant {
    id: string;
    title: string;
    prices?: { amount: number; currency_code: string }[];
    inventory_quantity?: number;
    calculated_price?: {
        original_amount: number;
        calculated_amount: number;
        difference: number;
        percentage_diff: number;
    } | null;
}

export interface ProductCollection {
    id: string;
    title: string;
    handle: string;
    products: Product[];
}

export interface Product {
    id?: string;
    title?: string;
    description?: string | null;
    thumbnail?: string | null;
    variants?: ProductVariant[];
    collection?: ProductCollection;
    collection_id?: string | null;
}

export interface MenuSection {
    collection: ProductCollection;
    products: Product[];
}
