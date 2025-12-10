import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read'], default: 'new' }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;



