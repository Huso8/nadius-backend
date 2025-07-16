import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
	user?: mongoose.Types.ObjectId;
	rating: number;
	comment: string;
	guestName?: string;
	guestEmail?: string;
	guestPhone?: string;
	createdAt: Date;
}

const reviewSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: false
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
	},
	guestName: {
		type: String,
		trim: true
	},
	guestEmail: {
		type: String,
		trim: true
	},
	guestPhone: {
		type: String,
		trim: true
	}
}, {
	timestamps: { createdAt: true, updatedAt: false }
});

export default mongoose.model<IReview>('Review', reviewSchema); 