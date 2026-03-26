/* 
in this we are making system to verify token
use cases:
email verification
forget password reset link
otp token store
secure login verification 

*/

import {Model, Schema, model} from "mongoose";

import { hashSync, compareSync, genSaltSync } from "bcrypt"

interface VerificationToken{
    userId:string; 
    token: string; 
    expires:Date; 
}

interface Methods {
    compare(token: string):boolean; 

}
type VerificationTokenModel = Model<
  VerificationToken,
  {},
  Methods 
>;

const verificationTokenSchema = new Schema<VerificationToken, VerificationTokenModel, Methods>({
   userId:{type:String, required: true},
   token: {type:String, required: true},
   expires:{type: Date, default: Date.now(), expires:60*60*24, },
}); 

//pre save hook to when the document will be saved this function will run
// if new token or modified
// then generate salt and hash the token and save the hashed token in database.
// this will make sure that even if someone get access to database they will not get the actual token.
// and when user will try to verify the token we will hash the token they provide and compare with the hashed token in database.
// this will add a method to our model to compare the token
// we will use this method to compare the token when user will try to verify the token.
// this will add a method to our model to compare the token
// we will use this method to compare the token when user will try to verify the token.

verificationTokenSchema.pre("save", async function(next: any){
    if(this.isModified("token")){
        const salt = genSaltSync(10); // it will take 10 rounds to generate salt or password
        this.token = hashSync(this.token, salt); // it will hash the token with the salt and save the hashed token in database.
    }
    next(); 
})

// custom method to compare at time of login. 
/* flow
-> user ko email me token mila, 
-> user ne token send kiya backend ko 
-> backend db se record niklega
-> compare() call karega,




*/

verificationTokenSchema.methods.compare = function(token: string){
  return compareSync(token, this.token); //this will compare the token provided by user with the hashed token in database and return true if match otherwise false.
}

const VerificationTokenModel = model<
  VerificationToken,
  VerificationTokenModel
>("VerificationToken", verificationTokenSchema);

export default VerificationTokenModel; 


