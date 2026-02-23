# Internal Marks Calculator

A comprehensive system for calculating internal marks based on various activities and achievements using **React + Node.js + SQLite**.

## 📋 Components

1. **Community Service** - Up to 40 marks
2. **Patent Filing and Prototyping** - Up to full FA marks (240)
3. **Scopus-Indexed Papers** - Up to full FA marks (240)
4. **Hackathons and Contests** - Up to full FA marks (240)
5. **Workshops and Seminars** - Up to 20 marks
6. **Online Courses** - Up to 80 marks
7. **Entrepreneurship** - Up to full FA marks (240)
8. **Coding Competitions** - Up to 120 marks
9. **Minor Projects** - Up to 160 marks

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Install Backend Dependencies**

```bash
npm install
```

2. **Install Frontend Dependencies**

```bash
cd client
npm install
cd ..
```

3. **Create Environment File**
   Create a `.env` file in the root directory:

```
PORT=5000
DB_PATH=./database/internal_marks.db
NODE_ENV=development
```

4. **Start the Application**

**Option 1: Development Mode (Recommended)**
Run both backend and frontend concurrently:

```bash
npm run dev
```

**Option 2: Backend Only**

```bash
npm run server
```

Then in another terminal:

```bash
cd client
npm start
```

**Option 3: Production Mode**

```bash
# Build frontend
cd client
npm run build
cd ..

# Start server
npm start
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: Auto-created at `./database/internal_marks.db`

## 📱 Features

### Student Management

- ✅ Add/Edit/Delete student records
- ✅ Search and filter students
- ✅ View student details and marks breakdown

### Activity Entry Forms

- ✅ Community Service entries
- ✅ Patent filing and prototyping
- ✅ Scopus-indexed publications
- ✅ Project competitions
- ✅ Hackathons participation
- ✅ Workshop attendance
- ✅ Online course certifications
- ✅ Entrepreneurship activities
- ✅ Coding platform achievements (HackerRank, CodeChef, LeetCode)
- ✅ Minor project submissions

### Automatic Calculations

- ✅ Semester-wise marks calculation
- ✅ Platform-specific rubrics (HackerRank, CodeChef, LeetCode)
- ✅ Automatic capping of marks per category
- ✅ Full FA marks allocation (best of Patent/Scopus/Competition/Hackathon/Entrepreneurship)

### Reports & Analytics

- ✅ Summary dashboard
- ✅ Detailed marks breakdown
- ✅ Export to CSV
- ✅ Semester-wise filtering

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router, Axios, React Toastify
- **Backend**: Node.js, Express
- **Database**: SQLite3
- **Styling**: Custom CSS

## 📊 Database Schema

The system uses SQLite with the following tables:

- `students` - Student information
- `community_service` - Community service activities
- `patent_filing` - Patent applications
- `scopus_papers` - Research publications
- `project_competitions` - Project presentations
- `hackathons` - Hackathon participation
- `workshops_seminars` - Workshop attendance
- `online_courses` - Online certifications
- `entrepreneurship` - Startup activities
- `coding_platforms` - Coding achievements
- `minor_projects` - Minor projects

## 🔌 API Endpoints

### Students

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Activity Endpoints

Each activity type has similar CRUD endpoints:

- `GET /api/{activity}/student/:studentId` - Get entries
- `POST /api/{activity}` - Create entry
- `PUT /api/{activity}/:id` - Update entry
- `DELETE /api/{activity}/:id` - Delete entry

Activities: `community-service`, `patents`, `scopus`, `project-competitions`, `hackathons`, `workshops`, `online-courses`, `entrepreneurship`, `coding-platforms`, `minor-projects`

### Calculations

- `GET /api/calculations/:studentId` - Get marks calculation
- `GET /api/calculations/report/summary` - Get summary report

## 📝 Marks Calculation Logic

### Capped Categories

- Community Service: Max 40 marks
- Workshops & Seminars: Max 20 marks
- Online Courses: Max 80 marks
- Coding Platforms: Max 120 marks
- Minor Projects: Max 160 marks

### Full FA Marks (240)

Only the **highest** value from these categories counts:

- Patent Filing & Prototyping
- Scopus-Indexed Papers
- Major Project Competitions (if ≥160 marks)
- Major Hackathons (if ≥240 marks)
- Entrepreneurship

### Semester-wise Coding Platform Rubrics

**HackerRank (HackOS)**

- Semester 2: 200-400 (20-60 marks)
- Semester 3: 500-2000 (20-80 marks)
- Semester 4: 2500-5000 (20-120 marks)
- Semester 5-7: 6000-12500 (20-40 marks)

**CodeChef (Rating)**

- Semester 3: 200-400 (20-80 marks)
- Semester 4: 500-600 (20-80 marks)
- Semester 5: 800-1800 (20-120 marks)
- Semester 6-7: 2000-2600 (20-40 marks)

**LeetCode (Problems Solved)**

- Semester 3: 2-4 (20-40 marks)
- Semester 4: 5-12 (20-80 marks)
- Semester 5: 30-80 (20-80 marks)
- Semester 6: 90-140 (20-120 marks)
- Semester 7: 160-250 (20-120 marks)

## 🔧 Development

### Project Structure

```
INTERNAL-MARKS/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── forms/     # Entry forms for all activities
│   │   │   ├── Dashboard.js
│   │   │   ├── Students.js
│   │   │   ├── StudentDetails.js
│   │   │   └── Reports.js
│   │   ├── services/      # API service
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── database.js        # Database setup
│   └── index.js          # Server entry point
├── database/              # SQLite database (auto-created)
├── .env                   # Environment variables
├── package.json
└── README.md
```

### Adding New Features

1. **Add a new activity type**: Create route in `server/routes/`, add table in `database.js`, create form component in `client/src/components/forms/`

2. **Modify calculation logic**: Update `server/routes/calculations.js`

3. **Add new student fields**: Modify `students` table in `database.js` and update forms

## 🐛 Troubleshooting

**Database not created?**

- Ensure `database/` directory exists or will be auto-created
- Check write permissions

**Port already in use?**

- Change PORT in `.env` file
- Kill existing processes on ports 3000/5000

**API connection failed?**

- Ensure backend is running on port 5000
- Check `proxy` setting in `client/package.json`

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
