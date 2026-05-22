# 🏪 SmartStore AI

SmartStore AI is a modern, AI-powered e-commerce admin dashboard designed to streamline product management, automate content generation, and provide intelligent sales insights.

## ✨ Features

- **Modern Dashboard:** Track revenue, sales, and inventory with beautiful, interactive charts (Chart.js).
- **AI Studio:** Leverage the power of Google's Gemini AI to instantly generate SEO-optimized product descriptions, tags, and marketing captions.
- **Product Management:** Full CRUD operations for your inventory, with search, stock-level filtering, and low-stock alerts.
- **Analytics:** Visualize product performance, revenue trends, and conversion funnels.
- **Secure Authentication:** JWT-based user authentication and secure password hashing with `bcryptjs`.
- **Premium UI:** Built with Tailwind CSS v4 featuring a dark glassmorphism aesthetic, micro-animations, and responsive design.

## 🛠️ Tech Stack

### Frontend
- React 19 (Vite)
- Tailwind CSS v4
- React Router DOM
- Chart.js & react-chartjs-2
- Lucide React (Icons)
- Axios

### Backend
- Node.js & Express v5
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- @google/genai (Gemini API Integration)

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine
- A MongoDB Atlas account and cluster
- A Google Gemini API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd smartstore
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

You need to create a `.env` file in the `backend` directory.

Create `backend/.env` and add the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### ⚠️ IMPORTANT: MongoDB Atlas IP Whitelisting

If you encounter connection timeouts or `500 Internal Server Error` when trying to register or log in, it is highly likely that your IP address is not whitelisted in MongoDB Atlas.

**To fix this:**
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Select your project/cluster.
3. In the left-hand sidebar under **Security**, click on **Network Access**.
4. Click the green **+ Add IP Address** button.
5. Click **Allow Access from Anywhere** (or explicitly add your current IP address).
6. Click **Confirm** and wait ~30 seconds for the changes to deploy.

### Running the Application

You need to run both the backend server and the frontend development server concurrently.

**1. Start the Backend Server:**
Open a terminal and run:
```bash
cd backend
npm run dev
```
*(The server will run on http://localhost:5000)*

**2. Start the Frontend Server:**
Open a new terminal window and run:
```bash
cd frontend
npm run dev
```
*(The app will be accessible at http://localhost:5173)*

## 📝 License

This project is open-source and available under the MIT License.
