import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
	product: mongoose.Types.ObjectId;
	quantity: number;
	price: number;
}

export interface ICoordinates {
	lat: number;
	lon: number;
}

export interface IContactInfo {
	name: string;
	email: string;
	phone: string;
}

export interface IOrder extends Document {
	user: mongoose.Types.ObjectId;
	products: IOrderItem[];
	totalAmount: number;
	status: 'pending' | 'processing' | 'completed' | 'cancelled';
	deliveryAddress: {
		address: string;
		coordinates: ICoordinates | null;
	};
	contactInfo: IContactInfo;
	comment?: string;
	createdAt: Date;
	updatedAt: Date;
}

const orderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	products: [{
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
	},
	deliveryAddress: {
		address: {
			type: String,
			required: true
		},
		coordinates: {
			lat: Number,
			lon: Number
		}
	},
	contactInfo: {
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		phone: {
			type: String,
			required: true
		}
	},
	comment: {
		type: String
	}
}, {
	timestamps: true
});

export default mongoose.model<IOrder>('Order', orderSchema); 