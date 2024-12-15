import mongoose from 'mongoose';
import { CONTACT_TYPE_LIST } from '../../constants/types.js';

const { Schema, model } = mongoose;

const contactFields = {
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name should have at least 3 characters'],
    maxlength: [20, 'Name can have at most 20 characters'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [
      /^\+380\d{9}$/,
      'Phone number must be in the format +380XXXXXXXXXX',
    ],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    enum: {
      values: CONTACT_TYPE_LIST,
      message:
        'Contact type must be one of the following: work, home, personal',
    },
    default: 'personal',
  },
};

const contactSchema = new Schema(contactFields, {
  versionKey: false,
  timestamps: true,
});

contactSchema.post('save', (error, data, next) => {
  error.status = 400;
  next(error);
});

contactSchema.pre('findOneAndUpdate', function (next) {
  this.options.runValidators = true;
  this.options.new = true;
  next();
});

contactSchema.post('findOneAndUpdate', (error, data, next) => {
  error.status = 400;
  next(error);
});

export const ContactsCollection = model('Contact', contactSchema);
