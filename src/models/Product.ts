import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
	name: string;
	description: string;
	price: number;
	image: string;
	category: string;
}

const ProductSchema: Schema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	image: { type: String, required: true },
	category: { type: String, required: true },
}, {
	timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema); 