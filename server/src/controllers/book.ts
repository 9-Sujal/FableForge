import { RequestHandler } from "express";
import BookModel, {BookDoc} from "@/models/book";
import { isValidObjectId, ObjectId, Types } from "mongoose";
import { formatBook, formatFileSize, generateS3ClientPublicUrl, sendErrorResponse } from "@/utils/helper";
import slugify  from "slugify";
import s3Client from "@/cloud/aws";
import { generateFileUploadUrl, uploadBookToAws } from "@/utils/fileIpload";
import AuthorModel from "@/models/author";
import UserModel from "@/models/user";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import HistoryModel, { Settings } from "@/models/history";

export const createNewBook: RequestHandler = async(req, res) =>{
    const {body,files,user} = req; 
  
     const {
    title,
    description,
    genre,
    language,
    fileInfo,
    price,
    publicationName,
    publishedAt,
    uploadMethod,
    status,
  } = body;

  const {cover, book} = files ?? {};

  const newBook = new BookModel<BookDoc>({
    title,
    description,
    genre,
    language,
    fileInfo: { size: formatFileSize(fileInfo.size), id: "" },
    price,
    publicationName,
    publishedAt,
    slug: "",
    author: new Types.ObjectId(user.authorId),
    status,
    copySold: 0,
  });

  let fileUploadUrl = "";

    newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
    lower: true,
    replacement: "-",
  });
  
   const fileName = slugify(`${newBook._id} ${newBook.title}.epub`, {
    lower: true,
    replacement: "-",
  });
  

  if (uploadMethod === "aws") {
    // if you are using AWS use the following logic
    fileUploadUrl = await generateFileUploadUrl(s3Client, {
      bucket: process.env.AWS_PRIVATE_BUCKET!,
      contentType: fileInfo.type,
      uniqueKey: fileName,
    });

    // this will upload cover to the cloud
    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.png`, {
        lower: true,
        replacement: "-",
      });

      newBook.cover = await uploadBookToAws(cover.filepath, uniqueFileName, cover.mimetype || "image/jpeg");
    }
  }
    newBook.fileInfo.id = fileName;
  await AuthorModel.findByIdAndUpdate(user.authorId, {
    $push: {
      books: newBook._id,
    },
  });
  await newBook.save();

  await UserModel.findByIdAndUpdate(req.user.id, {
    $push: { books: newBook._id },
  });
  res.json({ fileUploadUrl, slug: newBook.slug });

    
}
//...

export const updateBook: RequestHandler = async(req, res) =>{

  const {body, files, user}= req; 
    const {
    title,
    description,
    genre,
    language,
    fileInfo,
    price,
    publicationName,
    publishedAt,
    uploadMethod,
    slug,
    status,
  } = body;

   const {cover,book: newBookFile} = files;

  const book = await BookModel.findOne({
    slug,
    author: user.authorId,
  });
  
   if (!book) {
    return sendErrorResponse({
      message: "Book not found!",
      status: 404,
      res,
    });
  }
   book.title = title;
  book.description = description;
  book.language = language;
  book.publicationName = publicationName;
  book.genre = genre;
  book.publishedAt = publishedAt;
  book.price = price;
  book.status = status;

  

  let fileUploadUrl = "";
   if (uploadMethod === "aws") {
    if (fileInfo?.type === "application/epub+zip") {
      // remove the old book from cloud (bucket)
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_PRIVATE_BUCKET,
        Key: book.fileInfo.id,
      });
      await s3Client.send(deleteCommand);
  // generate (sign) new url to upload book
      const fileName = slugify(`${book._id} ${book.title}.epub`, {
        lower: true,
        replacement: "-",
      });
      fileUploadUrl = await generateFileUploadUrl(s3Client, {
        bucket: process.env.AWS_PRIVATE_BUCKET!,
        contentType: fileInfo?.type,
        uniqueKey: fileName,
      });

      book.fileInfo = { id: fileName, size: formatFileSize(fileInfo.size) };


    }
       if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      // remove old cover from the cloud (bucket)
      if (book.cover?.id) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_PUBLIC_BUCKET,
          Key: book.cover.id,
        });
        await s3Client.send(deleteCommand);
      }
      // upload new cover to the cloud (bucket)
      
      const uniqueFileName = slugify(`${book._id} ${book.title}.png`, {
        lower: true,
        replacement: "-",
      });

      book.cover = await uploadBookToAws(cover.filepath, uniqueFileName,cover.mimetype || "image/jpeg" );
    }

   



   }

     await book.save();

  // we are trying to make our app backward compatible
  if (!user.books?.includes(book._id.toString())) {
    await UserModel.findByIdAndUpdate(user.id, {
      $push: { books: book._id },
    });
  }

  res.send(fileUploadUrl);


}
// ........get books list purchased

export const getAllPurchasedBooks: RequestHandler = async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate<{
    books: PopulatedBooks[];
  }>({
    path: "books",
    select: "author title cover slug",
    populate: { path: "author", select: "slug name" },
  });

  if (!user) return res.json({ books: [] });

  res.json({
    books: user.books.map((book) => ({
      id: book._id,
      title: book.title,
      cover: book.cover?.url,
      slug: book.slug,
      author: {
        name: book.author.name,
        slug: book.author.slug,
        id: book.author._id,
      },
    })),
  });
};

//...........
export const generateBookAccessUrl: RequestHandler = async (req, res) => {
  const { slug } = req.params;

  const book = await BookModel.findOne({ slug });
  if (!book)
    return sendErrorResponse({ res, message: "Book not found!", status: 404 });

  const user = await UserModel.findOne({ _id: req.user.id, books: book._id });
  if (!user)
    return sendErrorResponse({ res, message: "User not found!", status: 404 });

  const history = await HistoryModel.findOne({
    reader: req.user.id,
    book: book._id,
  });

  const settings: Settings = {
    lastLocation: "",
    highlights: [],
  };

  if (history) {
    settings.highlights = history.highlights.map((h) => ({
      fill: h.fill,
      selection: h.selection,
    }));
    settings.lastLocation = history.lastLocation;
  }

  // generate access url if you are using aws
  const bookGetCommand = new GetObjectCommand({
    Bucket: process.env.AWS_PRIVATE_BUCKET,
    Key: book.fileInfo.id,
  });
  const accessUrl = await getSignedUrl(s3Client, bookGetCommand);

  res.json({ settings, url: accessUrl });
};

//get books by genre
export const getBookByGenre: RequestHandler = async (req, res) => {
  const books = await BookModel.find({
    genre: req.params.genre,
    status: { $ne: "unpublished" },
  }).limit(5);

  books.map(formatBook);
  res.json({
    books: books.map(formatBook),
  });
};

//get book public details
interface PopulatedBooks {
  cover?: {
    url: string;
    id: string;
  };
  _id: ObjectId;
  author: {
    _id: ObjectId;
    name: string;
    slug: string;
  };
  title: string;
  slug: string;
}
export const getBooksPublicDetails: RequestHandler = async (req, res) => {
  const book = await BookModel.findOne({ slug: req.params.slug }).populate<{
    author: PopulatedBooks["author"];
  }>({
    path: "author",
    select: "name slug",
  });

  if (!book)
    return sendErrorResponse({
      status: 404,
      message: "Book not found!",
      res,
    });

  const {
    _id,
    title,
    cover,
    author,
    slug,
    description,
    genre,
    language,
    publishedAt,
    publicationName,
    price: { mrp, sale },
    fileInfo,
    averageRating,
    status,
  } = book;

  res.json({
    book: {
      id: _id,
      title,
      genre,
      status,
      language,
      slug,
      description,
      publicationName,
      fileInfo,
      publishedAt: publishedAt.toISOString().split("T")[0],
      cover: cover?.url,
      rating: averageRating?.toFixed(1),
      price: {
        mrp: (mrp / 100).toFixed(2), // $1 100C/100 = $1
        sale: (sale / 100).toFixed(2), // 1.50
      },
      author: {
        id: author._id,
        name: author.name,
        slug: author.slug,
      },
    },
  });
};


// recommended books


interface RecommendedBooks {
  id: string;
  title: string;
  genre: string;
  slug: string;
  cover?: string;
  rating?: string;
  price: {
    mrp: string;
    sale: string;
  };
}

export interface AggregationResult {
  _id: Types.ObjectId;
  title: string;
  genre: string;
  price: {
    mrp: number;
    sale: number;
    _id: ObjectId;
  };
  cover?: {
    url: string;
    id: string;
    _id: ObjectId;
  };
  slug: string;
  averageRating?: number;
}

export const getRecommendedBooks: RequestHandler = async (req, res) => {
  const { bookId } = req.params;

  if (!isValidObjectId(bookId)) {
    return sendErrorResponse({ message: "Invalid book id!", res, status: 422 });
  }

  const book = await BookModel.findById(bookId);
  if (!book) {
    return sendErrorResponse({ message: "Book not found!", res, status: 404 });
  }

  const recommendedBooks = await BookModel.aggregate<AggregationResult>([
    {
      $match: {
        genre: book.genre,
        _id: { $ne: book._id },
        status: { $ne: "unpublished" },
      },
    },
    {
      $lookup: {
        localField: "_id",
        from: "reviews",
        foreignField: "book",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: { $avg: "$reviews.rating" },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        genre: 1,
        price: 1,
        cover: 1,
        averageRating: 1,
      },
    },
  ]);

  const result = recommendedBooks.map<RecommendedBooks>(formatBook);

  res.json(result);
};




// https://ebook-private.s3.eu-north-1.amazonaws.com/69ede67bc24afe9e8f89cf9e-harry-potter-and-the-prisoner-of-azkaban.epub
export const getFeaturedBooks: RequestHandler = async (req, res) => {
  const books = [
     {
    title: "Harry Potter and the Prisoner of Azkaban",
    slogan: "Magic awaits beyond every every page.",
    subtitle: "A thrilling journey through the wizarding world.",
   cover: generateS3ClientPublicUrl(
        process.env.AWS_PUBLIC_BUCKET!,
        "69ede67bc24afe9e8f89cf9e-harry-potter-and-the-prisoner-of-azkaban.png"
      ),
    slug: "harry-potter-and-the-prisoner-of-azkaban-69ede67bc24afe9e8f89cf9e",
  },

     {
    title: "Harry Potter and the Prisoner of Azkaban",
    slogan: "Magic awaits beyond every every page.",
    subtitle: "A thrilling journey through the wizarding world.",
   cover: generateS3ClientPublicUrl(
        process.env.AWS_PUBLIC_BUCKET!,
        "69ede67bc24afe9e8f89cf9e-harry-potter-and-the-prisoner-of-azkaban.png"
      ),
    slug: "harry-potter-and-the-prisoner-of-azkaban-69ede67bc24afe9e8f89cf9e",
  },

    {
    title: "Harry Potter and the Prisoner of Azkaban",
    slogan: "Magic awaits beyond every every page.",
    subtitle: "A thrilling journey through the wizarding world.",
   cover: generateS3ClientPublicUrl(
        process.env.AWS_PUBLIC_BUCKET!,
        "69ede67bc24afe9e8f89cf9e-harry-potter-and-the-prisoner-of-azkaban.png"
      ),
    slug: "harry-potter-and-the-prisoner-of-azkaban-69ede67bc24afe9e8f89cf9e",
  },

   {
    title: "Harry Potter and the Prisoner of Azkaban",
    slogan: "Magic awaits beyond every every page.",
    subtitle: "A thrilling journey through the wizarding world.",
   cover: generateS3ClientPublicUrl(
        process.env.AWS_PUBLIC_BUCKET!,
        "69ede67bc24afe9e8f89cf9e-harry-potter-and-the-prisoner-of-azkaban.png"
      ),
    slug: "harry-potter-and-the-prisoner-of-azkaban-69ede67bc24afe9e8f89cf9e",
  },

  ];

  res.json({ featuredBooks: books });
};





//////....

export const deleteBook: RequestHandler = async (req, res) => {
  const { bookId } = req.params;
  const { user } = req;
  const deleteMethodAddedDate = 1722704247287;

  if (!isValidObjectId(bookId)) {
    return sendErrorResponse({ message: "Invalid book id!", res, status: 422 });
  }

  const book = await BookModel.findOne({ _id: bookId, author: user.authorId });
  if (!book) {
    return sendErrorResponse({ message: "Book not found!", res, status: 404 });
  }

  const bookCreationTime = book._id.getTimestamp().getTime();
  if (deleteMethodAddedDate >= bookCreationTime) {
    return res.json({ success: false });
  }

  if (book.copySold >= 1) {
    return res.json({ success: false });
  }

  await BookModel.findByIdAndDelete(book._id);
  const author = await AuthorModel.findById(user.authorId);
  if (author) {
    author.books = author.books.filter((id) => id.toString() !== bookId);
    await author.save();
  }

  const coverId = book.cover?.id;
  const bookFileId = book.fileInfo.id;

  if (coverId) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_PUBLIC_BUCKET,
      Key: coverId,
    });
    await s3Client.send(deleteCommand);
  }

  if (bookFileId) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_PRIVATE_BUCKET,
      Key: bookFileId,
    });
    await s3Client.send(deleteCommand);
  }

  res.json({ success: true });
};
