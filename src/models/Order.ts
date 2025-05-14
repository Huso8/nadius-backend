import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
	product: mongoose.Types.ObjectId;
	quantity: number;
	price: number;
}

export interface IOrder extends Document {
	user: mongoose.Types.ObjectId;
	items: IOrderItem[];
	totalAmount: number;
	status: 'pending' | 'processing' | 'completed' | 'cancelled';
	createdAt: Date;
	updatedAt: Date;
}

const orderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	items: [{
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true
		},
		quantity: {
			type: Number,
			required: true,
			min: 1
		},
		price: {
			type: Number,
			required: true,
			min: 0
		}
	}],
	totalAmount: {
		type: Number,
		required: true,
		min: 0
	},
	status: {
		type: String,
		enum: ['pending', 'processing', 'completed', 'cancelled'],
		default: 'pending'
	}
}, {
	timestamps: true
});

export default mongoose.model<IOrder>('Order', orderSchema); 