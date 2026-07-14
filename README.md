# 📚 FableForge

A modern full-stack eBook platform that enables users to discover, purchase, read, and manage digital books with a seamless reading experience. FableForge provides an interactive EPUB reader with highlights, notes, reading history, authentication, payments, and author management.

---

##  Live Demo

# 📚 FableForge

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://fableforge.vercel.app)


---

# ✨ Features

### 👤 Authentication

* Email verification using Mailtrap
* Secure JWT Authentication
* HTTP-only cookie based sessions
* Role-based authorization (User & Author)

### 📖 EPUB Reader

* Smooth EPUB rendering
* Adjustable font size
* Dark & Light themes
* Table of Contents navigation
* Page navigation
* Resume reading from last location

### 📝 Notes & Highlights

* Highlight text with different colors
* Save highlights permanently
* View all saved notes
* Jump directly to highlighted text

### 📚 Book Management

* Browse available books
* Search by title
* View book details
* Reading progress tracking
* Reading history

### 🛒 Shopping Experience

* Shopping cart
* Secure checkout
* Razorpay payment integration
* Order history
* Purchased books library

### ✍️ Author Dashboard

* Upload EPUB books
* Upload cover images
* Edit book information
* Delete books
* Manage published books

---

# 🛠 Tech Stack

## Frontend

* React
* TypeScript
* Vite
* HeroUI
* Tailwind CSS
* Axios
* EPUB.js

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* Zod Validation
* Razorpay
* AWS S3
* Mailtrap

---

# 📸 Screenshots

## Home Page



```md
![Home](./screenshots/home.png)
```

---

## Book Details

```md
![Book Details](./screenshots/book-details.png)
```

---

## Reader

```md
![Reader](./screenshots/reader.png)
```

---

## Notes & Highlights

```md
![Notes](./screenshots/notes.png)
```

---

## Author Dashboard

```md
![Dashboard](./screenshots/dashboard.png)
```

---

## Shopping Cart

```md
![Cart](./screenshots/cart.png)
```

---

## Orders

```md
![Orders](./screenshots/orders.png)
```

---

# 🏗 Project Structure

```
FableForge
│
├── client
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── api
│   └── utils
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── validators
│   ├── config
│   └── utils
│
└── README.md
```

---

# ⚙️ Environment Variables

## Backend

Create a `.env` file inside the `server` folder.

```env
PORT=
MONGO_URI=

JWT_SECRET=

APP_URL=
VERIFICATION_LINK=

MAILTRAP_TOKEN=

AWS_BUCKET_NAME=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

## Frontend

Create a `.env` file inside the `client` folder.

```env
VITE_API_BASE_URL=
VITE_RAZORPAY_KEY_ID=
```

---

#  Installation

Clone the repository

```bash
git clone https://github.com/9-Sujal/FableForge.git
```

Move into the project

```bash
cd FableForge
```

### Install Frontend

```bash
cd client
npm install
npm run dev
```

### Install Backend

```bash
cd server
npm install
npm run dev
```

---

#  Security

* JWT Authentication
* HTTP-only Cookies
* Password Hashing using bcrypt
* Zod Request Validation
* Protected Routes
* Role-based Authorization

---

#  Future Improvements

* Bookmarks
* AI-powered recommendations
* Reading statistics dashboard
* Wishlist
* Reviews and ratings
* Social reading
* Offline reading
* Multi-language support

---

# 👨 Author

**Sujal Ghorse**

GitHub: https://github.com/9-Sujal

LinkedIn: *Add your LinkedIn profile*

---

#  Support

If you found this project useful, consider giving it a ⭐ on GitHub. It helps others discover the project and motivates future improvements.
