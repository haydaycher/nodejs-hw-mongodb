import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    isFavourite: {
      type: Boolean,
      required: true,
    },
    contactType: {
      type: String,
      enum: ['work', 'personal', 'home'],
      default: 'personal',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const ContactCollection = model('contact', contactSchema);
