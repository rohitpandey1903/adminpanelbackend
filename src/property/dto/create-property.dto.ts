export class CreatePropertyDto {
    name: string;
    location: string;
    client?: string;
    price: number;
    saleType: 'sale' | 'rent';
    tenure: string;
    position: string;
    details: string;
    photos: string[];
}
