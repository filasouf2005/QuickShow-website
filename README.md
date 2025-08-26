# Movie Ticket Booking Website (MERN Stack)

A **Full Stack Movie Ticket Booking Website** built with the **MERN Stack**. Users can sign up, explore movies, and book tickets with preferred seats. An **Admin Dashboard** allows admins to add new movies and manage bookings.  

This project demonstrates **full stack development**, **user authentication**, **background jobs**, and **email notifications**.

---

## Features

### User Features
- User signup with **Clerk** (Email, Social, Phone Number signup)
- Multi-session support (switch between profiles without signing out)
- Browse movies and select preferred seats
- Book tickets online
- Automatic email notifications for:
  - New movies
  - Booking confirmations
  - Booking reminders
- Temporary seat reservation for 10 minutes if payment fails

### Admin Features
- Add new movies
- Manage movie bookings
- Send notifications to users using **Inngest** background jobs

---

## Technologies Used
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Clerk
- **Background Jobs:** Inngest
- **Deployment:** TBD (can add Vercel/Heroku/Netlify links)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/USERNAME/REPO.git
cd REPO
Install dependencies for frontend and backend:

cd client
npm install

cd ../server
npm install
Create .env file in server folder and add your environment variables:

MONGO_URI=<your_mongodb_uri>
CLERK_API_KEY=<your_clerk_api_key>
Run the project:

# Start backend
cd server
npm run server

# Start frontend
cd client
npm start

#fullstack #fullstackproject #fullstackwebdevelopment #mernstack #mernstackproject #collegeprojects #coding

## Contact

If you have any questions, suggestions, or want to collaborate, feel free to reach out:

- **Email:** nefsiabdelouahab@gmail.com
- **GitHub:** [https://github.com/filasouf2005]  
