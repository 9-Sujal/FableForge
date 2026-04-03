import AuthorModel from "@/models/author";
import { BookDoc } from "@/models/book";
import UserModel from "@/models/user";
import { RequestAuthorHandler } from "@/types";
import { formatUserProfile, sendErrorResponse } from "@/utils/helper";
import { RequestHandler } from "express";
import slugify  from "slugify";


export const registerAuthor: RequestHandler = async(req, res) =>{
    
    const {body, user} = req; 

    if(!user.signedUp){
        return sendErrorResponse({
            message:"Please complete your profile to register as author",
            status:401,
            res,
        })


    }

    // Check if the user is already an author
    // here we are checking if the user is already an author by looking for an existing author document with the same userId.
    //  If such a document exists, it means the user is already registered as an author, and we return an error response indicating
    //  that the user cannot register again.

    const newAuthor = new AuthorModel({
        name: body.name,
        about: body.about,
        userId: user.id,
        socialLinks: body.socialLinks,
    })
    // create new author document using the AuthorModel with the provided name, about, userId, and socialLinks from the request body.

    const uniqueSlug = slugify(`${newAuthor.name} ${newAuthor._id}`,
         {lower: true, 
          replacement: "-",
        });

    newAuthor.slug = uniqueSlug;
    // generate a unique slug for the author using the slugify library. 
    // The slug is created by combining the author's name and their unique ID, ensuring that it is unique even if multiple authors have the same name.
    //  The slug is formatted in lowercase and uses hyphens as separators.
          
    await newAuthor.save();

    const updatedUser = await UserModel.findByIdAndUpdate(
        user.id,
        { role: "author",
            authorId: newAuthor._id, 
        },
        { new: true }
    ); 


    let userResult;
// formatuserprofile is a utility function that formats the user profile data before sending it in the response.
//  It takes the updated user document as input and returns a formatted version of the user profile, which is then included in the response sent back to the client.
    if(updatedUser){
        userResult = formatUserProfile(updatedUser);
    }
    
    res.json({
        message:"Author registered successfully",
        user: userResult,
    });

};


export const updateAuthor: RequestHandler = async(req, res) =>{
    const {body, user} = req;

    await AuthorModel.findOneAndUpdate({ _id: user.authorId },
        {
            name: body.name,
            about: body.about,
            socialLinks: body.socialLinks,
        }
    )
    res.json({
        message:"Author profile updated successfully",
    });
}

export const getAuthorDetails:RequestHandler = async(req, res) =>{
    const {id} = req.params;
    const author = await AuthorModel.findById(id).populate<{books: BookDoc[]}>(
        "books",
    );
    if(!author){
        return sendErrorResponse({
            res,
            message:"Author not found",
            status:404,
        });
    }

    res.json({
        id: author._id,
        name: author.name,
        about: author.about,
        socialLinks: author.socialLinks,
        books: author.books.map((book)=>{
            return {
                id: book._id?.toString(),
                title: book.title,
                slug: book.slug, 
                genre: book.genre,
                price:{
                    mrp: (book.price.mrp / 100).toFixed(2),
                    sale: (book.price.sale / 100).toFixed(2),
                },
                cover: book.cover?.url, 
                rating:book.averageRating?.toFixed(1) || "0.0",
            }
        })
    });
}

export const getBooks: RequestHandler = async(req, res) =>{
    const {authorId} = req.params;
    
    const author = await AuthorModel.findById(authorId).populate<{books: BookDoc[]}>(
        "books",
    );

    if(!author){
        return sendErrorResponse({
           message:"unauthorized access",
            res,
           status:403,
        });
    }

    res.json({
        books: author.books.map((book)=>{
            return {
                id: book._id?.toString(),
                title: book.title,
                slug: book.slug,
                status: book.status,
            }
        })
    });
}