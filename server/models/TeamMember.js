import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    position: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    bio: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    image: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    department: {
        type: String,
        enum: ['management', 'medical', 'support', 'marketing', 'technical'],
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create indexes
teamMemberSchema.index({ department: 1 });
teamMemberSchema.index({ order: 1 });
teamMemberSchema.index({ isActive: 1 });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
