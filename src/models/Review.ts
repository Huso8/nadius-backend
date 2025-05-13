import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
	product: mongoose.Types.ObjectId;
	user: mongoose.Types.ObjectId;
	rating: number;
	comment: string;
	createdAt: Date;
}

const reviewSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5
	},
	comment: {
		type: String,
		trim: true,
		default: ''
	}
}, {
	timestamps: { createdAt: true, updatedAt: false }
});

export default mongoose.model<IReview>('Review', reviewSchema); 