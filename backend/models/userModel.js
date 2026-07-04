import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,      // enforces uniqueness at the DB level (creates an index)
            lowercase: true,   // normalize so Foo@x.com and foo@x.com are the same account
            trim: true
        },
        password: {
            type: String,
            required: true,
            select: false      // never returned by default; opt in with .select('+password')
        }
    },
    { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
