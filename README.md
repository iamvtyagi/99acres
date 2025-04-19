# 99acres Clone

A full-stack real estate platform inspired by 99acres, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication (signup, login, email verification)
- Property listing with advanced search and filters
- Property details with image gallery and amenities
- Wishlist functionality
- Real-time chat between users
- User dashboard for managing properties and leads
- Admin panel for property approvals and user management
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js with Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Socket.io Client for real-time communication
- Formik and Yup for form validation
- React Dropzone for image uploads
- Mapbox for location maps

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt.js for password encryption
- Socket.io for real-time communication
- Multer for file uploads
- Cloudinary for image storage
- Nodemailer for email services

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/99acres-clone.git
cd 99acres-clone
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Install frontend dependencies
```
cd ../frontend
npm install
```

4. Set up environment variables
   - Create a `.env` file in the backend directory (use the existing one as reference)
   - Create a `.env` file in the frontend directory (use the existing one as reference)

5. Start the backend server
```
cd backend
npm run dev
```

6. Start the frontend development server
```
cd ../frontend
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
99acres-clone/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-details` - Update user details
- `PUT /api/auth/update-password` - Update password

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `PUT /api/properties/:id/images` - Upload property images
- `GET /api/properties/radius/:zipcode/:distance` - Get properties in radius

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/:propertyId` - Add property to wishlist
- `DELETE /api/wishlist/:propertyId` - Remove property from wishlist

### Messages
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversations/:conversationId` - Get messages for a conversation
- `POST /api/messages` - Send a message
- `DELETE /api/messages/:id` - Delete a message

### Leads
- `POST /api/leads` - Create a lead
- `GET /api/leads` - Get user's leads
- `PUT /api/leads/:id` - Update lead status
- `GET /api/properties/:propertyId/leads` - Get leads for a property

## License

This project is licensed under the MIT License.

## Acknowledgements

- [99acres](https://www.99acres.com/) for inspiration
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
