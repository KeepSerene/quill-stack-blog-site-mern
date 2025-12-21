# QuillStack 📝

<div align="center">

![QuillStack Banner](https://quill-stack.onrender.com/screenshots/quill-stack.png)

**A Modern MERN Stack Blogging Platform with Studio Ghibli-Inspired Design**

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248)](https://www.mongodb.com/)

[Live Demo](https://quill-stack.onrender.com/) · [Report Bug](https://github.com/KeepSerene/quill-stack-blog-site-mern/issues) · [Request Feature](https://github.com/KeepSerene/quill-stack-blog-site-mern/issues)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 About

QuillStack is a feature-rich, full-stack blogging platform built with the MERN stack and TypeScript. Inspired by the whimsical aesthetics of Studio Ghibli, it offers a delightful user experience with a warm, inviting interface in both light and dark themes.

This project serves as a comprehensive portfolio piece, demonstrating modern web development practices, including authentication, authorization, file uploads, rich text editing, and responsive design.

**Key Highlights:**

- 🎨 Studio Ghibli-inspired design system with custom light/dark themes
- 📝 Rich text editor powered by Tiptap
- 🔐 Secure JWT-based authentication with refresh tokens
- 🖼️ Image upload and management via Cloudinary
- 👨‍💼 Comprehensive admin dashboard for content management
- 📱 Fully responsive design across all devices
- ⚡ Optimized performance with compression and rate limiting
- 🛡️ Security-first approach with Helmet.js and input validation

---

## ✨ Features

### For Users

- 📖 **Browse Blogs**: Explore published blog posts with pagination
- 🔍 **Search & Filter**: Find blogs by title or content
- 📄 **Blog Details**: Read full blog posts with formatted content
- 🌓 **Theme Switching**: Toggle between light, dark, and system themes
- 📱 **Responsive Design**: Seamless experience across all devices

### For Admins

- 📊 **Dashboard**: Overview of site statistics and metrics
- ✍️ **Blog Management**: Create, edit, and delete blog posts
- 🖼️ **Image Uploads**: Upload and manage blog banner images via Cloudinary
- 👥 **User Management**: View and manage registered users
- 💬 **Comment Moderation**: Review and manage blog comments
- 📝 **Rich Text Editor**: Tiptap-powered WYSIWYG editor with:
  - Multiple heading levels
  - Text formatting (bold, italic, strikethrough)
  - Lists (ordered, unordered, task lists)
  - Blockquotes and code blocks
  - Links and horizontal rules
  - Tables
- 📋 **Draft System**: Save blogs as drafts before publishing

### Security & Performance

- 🔒 **Secure Authentication**: JWT-based auth with HTTP-only cookies
- 🛡️ **Authorization**: Role-based access control (Admin/User)
- ⚡ **Rate Limiting**: Protection against brute-force attacks
- 🗜️ **Compression**: Gzip compression for faster load times
- 🧹 **Input Sanitization**: XSS protection with DOMPurify
- 🔐 **Password Hashing**: Bcrypt for secure password storage
- 🌐 **CORS Protection**: Whitelisted origins only

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19
- **Language**: TypeScript 5.9
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4 with custom Ghibli-inspired theme
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Rich Text Editor**: Tiptap 3
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Animations**: Motion (Framer Motion)
- **Notifications**: Sonner
- **Build Tool**: Vite 7

### Backend

- **Runtime**: Node.js
- **Framework**: Express 5
- **Language**: TypeScript 5.9
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer + Cloudinary
- **Validation**: Express Validator
- **Security**: Helmet.js, bcryptjs
- **Logging**: Winston
- **Rate Limiting**: express-rate-limit
- **Compression**: compression middleware

### DevOps & Tools

- **Package Manager**: pnpm 10
- **Deployment**: Render (Free Tier)
- **Version Control**: Git
- **Runtime Execution**: tsx (for TypeScript)

---

## 📸 Screenshots

### Admin Dashboard

![Admin Dashboard](./frontend/public/screenshots/quill-stack.png)
_Comprehensive admin dashboard with metrics_

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.24.0)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/KeepSerene/quill-stack-blog-site-mern.git
   cd quill-stack-blog-site-mern
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   pnpm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   pnpm install
   cd ..
   ```

### Environment Variables

#### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Database
DB_URI=mongodb://localhost:27017/quill-stack-db
# Or use MongoDB Atlas:
# DB_URI=mongodb+srv://username:password@cluster.mongodb.net/quill-stack-db

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=1w

# Admin Emails (comma-separated)
ADMIN_EMAILS=admin@example.com,another@example.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Logging
WINSTON_LOG_LEVEL=info
```

#### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Running the Application

#### Development Mode

1. **Start the backend server**

   ```bash
   cd backend
   pnpm dev
   ```

2. **Start the frontend dev server** (in a new terminal)

   ```bash
   cd frontend
   pnpm dev
   ```

3. **Open your browser**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`

#### Production Build

```bash
# Build both frontend and backend
pnpm build

# Start the production server
pnpm start
```

---

## 📁 Project Structure (Tentative!)

```
quill-stack/
├── backend/
│   ├── src/
│   │   ├── configs/          # Configuration files
│   │   ├── controllers/      # Request handlers
│   │   │   └── v1/
│   │   │       ├── auth/     # Authentication controllers
│   │   │       ├── blogs/    # Blog controllers
│   │   │       ├── comments/ # Comment controllers
│   │   │       ├── likes/    # Like controllers
│   │   │       ├── users/    # User controllers
│   │   │       └── views/    # View controllers
│   │   ├── lib/              # Utility libraries
│   │   │   ├── cloudinary.ts # Cloudinary integration
│   │   │   ├── jwt.ts        # JWT utilities
│   │   │   ├── mongoose.ts   # MongoDB connection
│   │   │   └── winston.ts    # Logging configuration
│   │   ├── middlewares/      # Express middlewares
│   │   │   ├── authenticate.middleware.ts
│   │   │   ├── authorize.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   └── validation-errors.middleware.ts
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Blog.ts
│   │   │   ├── Comment.ts
│   │   │   ├── Like.ts
│   │   │   └── View.ts
│   │   ├── routes/           # API routes
│   │   │   └── v1/
│   │   │       ├── auth.route.ts
│   │   │       ├── blogs.route.ts
│   │   │       ├── comments.route.ts
│   │   │       ├── likes.route.ts
│   │   │       ├── users.route.ts
│   │   │       ├── views.route.ts
│   │   │       └── index.ts
│   │   ├── @types/           # TypeScript type definitions
│   │   └── server.ts         # Express app entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── screenshots/      # App screenshots
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   └── ...           # Custom components
│   │   ├── layouts/          # Layout components
│   │   │   ├── Root.tsx
│   │   │   └── Admin.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── auth/         # Authentication pages
│   │   │   ├── users/        # User pages
│   │   │   ├── admins/       # Admin pages
│   │   │   └── errors/       # Error pages
│   │   ├── routes/           # React Router configuration
│   │   │   ├── actions/      # Form actions
│   │   │   ├── loaders/      # Data loaders
│   │   │   └── router.ts
│   │   ├── lib/              # Utilities
│   │   │   └── api/          # API client setup
│   │   ├── types/            # TypeScript types
│   │   ├── index.css         # Global styles
│   │   └── main.tsx          # App entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── package.json              # Root package.json
└── README.md
```

---

## 📡 API Documentation

### Base URL

- **Development**: `http://localhost:3000/api/v1`
- **Production**: `https://quill-stack.onrender.com/api/v1`

### Authentication Endpoints

| Method | Endpoint              | Description          | Auth Required |
| ------ | --------------------- | -------------------- | ------------- |
| POST   | `/auth/register`      | Register a new user  | No            |
| POST   | `/auth/login`         | Login user           | No            |
| POST   | `/auth/refresh-token` | Refresh access token | Yes (Cookie)  |
| POST   | `/auth/logout`        | Logout user          | Yes           |

### Blog Endpoints

| Method | Endpoint       | Description             | Auth Required | Role  |
| ------ | -------------- | ----------------------- | ------------- | ----- |
| GET    | `/blogs`       | Get all published blogs | No            | -     |
| GET    | `/blogs/:slug` | Get blog by slug        | No            | -     |
| POST   | `/blogs`       | Create a new blog       | Yes           | Admin |
| PUT    | `/blogs/:slug` | Update blog by slug     | Yes           | Admin |
| DELETE | `/blogs/:slug` | Delete blog by slug     | Yes           | Admin |

### User Endpoints

| Method | Endpoint               | Description         | Auth Required | Role       |
| ------ | ---------------------- | ------------------- | ------------- | ---------- |
| GET    | `/users`               | Get all users       | Yes           | Admin      |
| GET    | `/users/current`       | Get current user    | Yes           | User/Admin |
| GET    | `/users/:userId`       | Get user by ID      | Yes           | Admin      |
| PUT    | `/users/current`       | Update current user | Yes           | User/Admin |
| DELETE | `/users/current`       | Delete current user | Yes           | User/Admin |
| DELETE | `/users/:userId`       | Delete user by ID   | Yes           | Admin      |
| GET    | `/users/:userId/blogs` | Get blogs by user   | Yes           | User/Admin |

### Comment Endpoints

| Method | Endpoint                  | Description          | Auth Required | Role       |
| ------ | ------------------------- | -------------------- | ------------- | ---------- |
| GET    | `/comments`               | Get all comments     | Yes           | Admin      |
| GET    | `/comments/blogs/:blogId` | Get comments by blog | Yes           | User/Admin |
| POST   | `/comments/blogs/:blogId` | Create a comment     | Yes           | User/Admin |
| DELETE | `/comments/:commentId`    | Delete a comment     | Yes           | User/Admin |

### Like & View Endpoints

| Method | Endpoint               | Description         | Auth Required | Role       |
| ------ | ---------------------- | ------------------- | ------------- | ---------- |
| POST   | `/likes/blogs/:blogId` | Like a blog         | Yes           | User/Admin |
| DELETE | `/likes/blogs/:blogId` | Unlike a blog       | Yes           | User/Admin |
| POST   | `/views/blogs/:blogId` | Increment blog view | Yes           | User/Admin |

### Request/Response Examples (may change!)

#### Register User

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "role": "user"
}

# Response
{
  "message": "Registration successful!",
  "accessToken": "eyJhbGc...",
  "user": {
    "username": "user",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### Create Blog

```bash
POST /api/v1/blogs
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

title: My First Blog Post
content: <p>This is the content...</p>
status: published
banner-image: <file>

# Response
{
  "message": "Blog created successfully!",
  "blog": {
    "_id": "...",
    "title": "My First Blog Post",
    "slug": "my-first-blog-post",
    "author": {...},
    "banner": {
      "url": "https://res.cloudinary.com/...",
      "publicId": "...",
      "width": 1920,
      "height": 1080
    },
    "status": "published",
    "publishedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

## 🚢 Deployment

QuillStack is deployed on [Render](https://render.com) using the free tier. The deployment configuration is optimized for a monorepo structure where both frontend and backend are served from a single service.

### Deployment Configuration

1. **Build Command**: `pnpm build`

   - Installs and builds both backend and frontend
   - Frontend static files are copied to `backend/dist/frontend/dist`

2. **Start Command**: `pnpm start`

   - Runs the backend server with `tsx`
   - Serves frontend static files in production

3. **Environment Variables**: Set all required environment variables in Render dashboard

### Deployment Steps

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure build settings**:
   - Build Command: `pnpm build`
   - Start Command: `pnpm start`
4. **Add environment variables** (same as local `.env`)
5. **Deploy!**

### Production Considerations

- Frontend assets are served from the Express backend
- Client-side routing is handled with a catch-all route
- Static file compression is enabled
- Security headers are set with Helmet.js
- Rate limiting is active to prevent abuse

---

## 🔮 Future Enhancements

The following features are planned for future releases:

### Frontend

- [ ] **Likes Functionality**: Complete implementation of blog liking system
- [ ] **Views Tracking**: Display and track blog view counts
- [ ] **User Profiles**: Public user profile pages
- [ ] **Comment System**: Frontend interface for commenting on blogs
- [ ] **Search Enhancement**: Advanced search with filters (author, date, tags)
- [ ] **Bookmarks**: Save favorite blogs for later reading
- [ ] **Reading Progress**: Track reading progress on long articles
- [ ] **Blog Categories/Tags**: Organize blogs with categories and tags

### Backend

- [ ] **Email Notifications**: Notify users of new comments, likes, etc.
- [ ] **Blog Categories**: Full category system implementation
- [ ] **Blog Tags**: Tagging system for better organization
- [ ] **Analytics**: Detailed analytics for admins
- [ ] **API Rate Limiting Per User**: More granular rate limiting

### Performance & UX

- [ ] **Progressive Web App (PWA)**: Offline support and installability
- [ ] **Infinite Scroll**: Replace pagination with infinite scroll
- [ ] **Skeleton Loaders**: Better loading states
- [ ] **Optimistic Updates**: Immediate UI feedback for user actions
- [ ] **Code Splitting**: Lazy load routes and components

### Security

- [ ] **Two-Factor Authentication**: Optional 2FA for admins
- [ ] **Account Verification**: Email verification on registration
- [ ] **Content Moderation**: Automated content filtering

---

## 🤝 Contributing

Contributions are welcome! This is a portfolio project, but I'm open to suggestions and improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow existing code patterns
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

```
Copyright 2025 Dhrubajyoti Bhattacharjee

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---

## 📧 Contact

**_[Dhrubajyoti Bhattacharjee](https://github.com/KeepSerene)_**

**Live Demo**: [https://quill-stack.onrender.com](https://quill-stack.onrender.com)

---

## 🙏 Acknowledgments

- [Studio Ghibli](https://www.ghibli.jp/) for the beautiful aesthetic inspiration
- [shadcn/ui](https://ui.shadcn.com/) for the amazing UI component library
- [Tiptap](https://tiptap.dev/) for the powerful rich text editor
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Render](https://render.com/) for reliable free hosting
- [Cloudinary](https://cloudinary.com/) for image hosting and optimization
- All the amazing open-source contributors whose libraries made this possible

---

<div align="center">

**⭐ Star this repository if you found it helpful! ⭐**

Made with ❤️ and 🍁 by Dhrubajyoti Bhattacharjee

</div>
