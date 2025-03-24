import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PropertyDocument = Property & Document;

@Schema()
export class Property{
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    location: string;

    @Prop()
    client: string;

    @Prop({required: true})
    price: number;

    @Prop({enum: ['sale', 'rent'], required: true})
    saleType: string;

    @Prop({required: true})
    tenure: string;

    @Prop({required: true})
    position: string;

    @Prop({required: true})
    details: string;

    @Prop({type: [String]})
    photos: string[];

    @Prop({default: Date.now})
    createdAt: Date;
}

export const PropertySchema = SchemaFactory.createForClass(Property);