import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Референс до колекції `User`
      required: [true, 'User ID is required'],
    },
    accessToken: {
      type: String,
      required: [true, 'Access token is required'],
    },
    refreshToken: {
      type: String,
      required: [true, 'Refresh token is required'],
    },
    accessTokenValidUntil: {
      type: Date,
      required: [true, 'Access token expiration date is required'],
    },
    refreshTokenValidUntil: {
      type: Date,
      required: [true, 'Refresh token expiration date is required'],
    },
  },
  {
    timestamps: true, // Автоматичне додавання createdAt і updatedAt
    versionKey: false,
  },
);

export const Session = model('Session', sessionSchema);
