import { Schema, model} from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: 'Enter a first name',
    },
    lastName: {
        type: String,
        required: 'Enter a last name',
    },
    email: {
        type: String,
        required: 'Enter a email-id',
    },

    password: {
        type: String,
        required: 'Enter a password for profile',
    },
    middleName: String,
    nickName: String,
    age: Number,
    gender: String,
 });
// tslint:disable: variable-name
export const User = model("Users", userSchema);
