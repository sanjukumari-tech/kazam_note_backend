import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  // id: { type: Number, required: true },
  text: { type: String, required: true },
  // createdAt: { type: Date, default: Date.now }
});

export const Note = mongoose.model('Assignment_sanju', noteSchema); 
