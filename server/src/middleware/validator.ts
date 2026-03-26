


// creating email validation middleware. 

import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import {z,ZodObject, ZodRawShape} from "zod";

export const emailValidationSchema = z.object({
email: z

.email({

       error:"Invalid email", 
    })
    .nonempty({
            message:"Email is missing"
    })


    
})
export const newUserSchema = z.object({
  name: z
    .string({
      error: "Name is missing!",
      
    })
   
    .min(3, "Name must be 3 characters long!")
    .trim(),
});
export const newAuthorSchema = z.object({
  name: z
    .string({
      error: "Name is missing!",
      
    })
   
    .trim()
    .min(3, "Invalid name"),
  about: z
    .string({
      error: "About is missing!",
     
    })
    
    .trim()
    .min(100, "Please write at least 100 characters about yourself!"),
  socialLinks: z
    .array(z.string().url("Social links can only be list of  valid URLs!"))
    .optional(),
});

const commonBookSchema = {
  uploadMethod: z.enum(["aws", "local"], {
     message: "uploadMethod needs to be either aws or local" ,
  }),
  status: z.enum(["published", "unpublished"], {
    message: "Please select at least one status." ,
  }),
  title: z
    .string({
      error: "Title is missing!",
      
    })
  
    .trim(),
  description: z
    .string({
      error: "Description is missing!",
     
    })
    
    .trim(),
  language: z
    .string({
      error: "Language is missing!",
      
    })
   
    .trim(),
  publishedAt: z.coerce.date({
    error: "Publish date is missing!",
  
  }),
  
  publicationName: z
    .string({
      error: "Publication name is missing!",
    
    })
    .trim(),
  genre: z
    .string({
      error: "Genre is missing!",
      
    })
    .trim(),
  price: z
    .string({
      error: "Price is missing!",
     
    })
    .transform((value, ctx) => {
      try {
        return JSON.parse(value);
      } catch (error) {
        ctx.addIssue({ code: "custom", message: "Invalid Price Data!" });
        return z.NEVER;
      }
    })
    .pipe(
      z.object({
        mrp: z
          .number({
            error: "MRP is missing!",
            
          })
          .nonnegative("Invalid mrp!"),
        sale: z
          .number({
            error: "Sale price is missing!",
            
          })
          .nonnegative("Invalid sale price!"),
      })
    )
    // if the validator function returns false the error will be thrown
    .refine(
      (price) => price.sale <= price.mrp,
      "Sale price should be less then mrp!"
    ),
};
const fileInfo = z
  .string({
    error: "File info is missing!",
   
  })
  .transform((value, ctx) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      ctx.addIssue({ code: "custom", message: "Invalid File Info!" });
      return z.NEVER;
    }
  })
  .pipe(
    z.object({
      name: z
        .string({
          error: "fileInfo.name is missing!",
          
        })
        .trim(),
      type: z
        .string({
          error: "fileInfo.type is missing!",
         
        })
        .trim(),
      size: z
        .number({
          error: "fileInfo.size is missing!",
        
        })
        .nonnegative("Invalid fileInfo.size!"),
    })
  );
export const newBookSchema = z.object({
  ...commonBookSchema,
  fileInfo,
});

export const updateBookSchema = z.object({
  ...commonBookSchema,
  slug: z
    .string({
      message: "Invalid slug!",
    })
    .trim(),
  fileInfo: fileInfo.optional(),
});

export const newReviewSchema = z.object({
  rating: z
    .number({
      error: "Rating is missing!",
     
    })
    .nonnegative("Rating must be within 1 to 5.")
    .min(1, "Minium rating should be 1")
    .max(5, "Maximum rating should be 5"),
  content: z
    .string({
      error: "Invalid rating!",
    })
    .optional(),
  bookId: z
    .string({
      error: "Book id is missing!",
     
    })
    .transform((arg, ctx) => {
      if (!isValidObjectId(arg)) {
        ctx.addIssue({ code: "custom", message: "Invalid book id!" });
        return z.NEVER;
      }

      return arg;
    }),
});
export const historyValidationSchema = z.object({
  bookId: z
    .string({
      error: "Book id is missing!",
      
    })
    .transform((arg, ctx) => {
      if (!isValidObjectId(arg)) {
        ctx.addIssue({ code: "custom", message: "Invalid book id!" });
        return z.NEVER;
      }

      return arg;
    }),
  lastLocation: z
    .string({
      error: "Invalid last location!",
    })
    .trim()
    .optional(),
  highlights: z
    .array(
      z.object({
        selection: z
          .string({
            error: "Highlight selection is missing",
           
          })
          .trim(),
        fill: z
          .string({
            error: "Highlight fill is missing",
           
          })
          .trim(),
      })
    )
    .optional(),
  remove: z.boolean({
    error: "Remove is missing!",
   
  }),
});

//  = [{ product: idOf the product, count: how many products that our users wants to purchase }]

export const cartItemsSchema = z.object({
  items: z.array(
    z.object({
      product: z
        .string({
          error: "Product id is missing!",
         
        })
        .transform((arg, ctx) => {
          if (!isValidObjectId(arg)) {
            ctx.addIssue({ code: "custom", message: "Invalid product id!" });
            return z.NEVER;
          }

          return arg;
        }),
      quantity: z.number({
        error: "Quantity is missing!",
        
      }),
    })
  ),
});

export const validate = <T extends ZodRawShape>(
  schema: ZodObject<T>
): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (result.success) {
      req.body = result.data;
      next();
    } else {
      const errors = result.error.flatten().fieldErrors;
      return res.status(422).json({ errors });
    }
  };
};

