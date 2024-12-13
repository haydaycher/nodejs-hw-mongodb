import { Schema, model } from 'mongoose';
// import { SORT_ORDER } from '../../constants/index.js';
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
