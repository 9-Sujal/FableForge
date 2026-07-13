/* 
user should have id, email, role, name, signedUp(true false), avatar,
author id, books, orders......
*/

import { Model, model, Types, Schema } from "mongoose";
import { hashSync, compareSync, genSaltSync } from "bcrypt";

export interface UserDoc {
    _id: Types.ObjectId;
    email: string; 
    password: string;
    role: 'user' | 'author' ;
    name?:string; 
    signedUp:boolean; 
    avatar?:{url:string; id: string}; 
    authorId?: Types.ObjectId; 
    books: Types.ObjectId[];
    orders?: Types.ObjectId[]; 

}
interface UserMethods {
    comparePassword(password: string): boolean;
}

type UserModelType = Model<UserDoc, {}, UserMethods>;


const userSchema = new Schema<UserDoc, UserModelType, UserMethods>({
   name:{type:String, trim: true,},
   email:{type:String, trim: true, required:true, unique: true, lowercase: true },
   password:{type:String, required: true,},
   role:{type: String, enum:["user", "author"], default:"user",}, // enum  = allowed values only to improve  data consistency. 
    signedUp:{type: Boolean, default: false,},
    avatar:{type: Object, url: String, id: String},
    authorId:{type: Schema.Types.ObjectId, ref:"Author"},
    books:[{type: Schema.Types.ObjectId, ref:"Book"}],
    orders:[{type: Schema.Types.ObjectId, ref:"Order"}],
}); 





userSchema.pre("save", function (next) {
  if (this.isModified("password") && this.password) {

    const salt = genSaltSync(10);
    this.password = hashSync(this.password, salt);
  }
  next;
});

userSchema.methods.comparePassword = function (password: string) {

  return compareSync(password, this.password);
};

const UserModel = model<UserDoc, UserModelType>("User", userSchema);

export default UserModel;