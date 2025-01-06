import mongoose, { Document, Schema, CallbackError } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    username: string;
    password?: string; // Optional to handle situations where it's undefined
    savedRecipes: mongoose.Types.ObjectId[];

    correctPassword(
        candidatePassword: string,
        userPassword: string
    ): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: [true, "Please provide a password"],
        select: false,
    },
    savedRecipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            default: [],
        },
    ],
});

userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();

    try {
        // Hash the password before saving
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        // Handle the error properly by passing it to the next middleware
        next(error as Error | CallbackError);
    }
});

userSchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
