# Setup and Installation Guide

## Prerequisites

- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)

## Installation Steps

### Step 1: Install Dependencies

Open a terminal in the project root directory and run:

```powershell
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 2: Verify Configuration

The `.env` file should contain:

```
PORT=5000
DB_PATH=./database/internal_marks.db
NODE_ENV=development
```

### Step 3: Start the Application

You have two options:

#### Option A: Run Both Together (Development Mode)

```powershell
npm run dev
```

This runs both backend and frontend concurrently.

#### Option B: Run Separately

Terminal 1 - Backend:

```powershell
npm run server
```

Terminal 2 - Frontend:

```powershell
npm run client
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: SQLite file at `database/internal_marks.db`

## Application Features

### 1. Dashboard

- Overview of all students
- Quick statistics
- Recent activities

### 2. Student Management

- Add new students
- View all students
- Search and filter students

### 3. Entry Forms (9 Components)

#### Component 1: Community Service (Up to 40 marks)

- Workshop/Coding Session activities
- School/NGO/Industry engagement
- Team-based activities (max 3 members)

#### Component 2: Patents & Prototypes (Full FA marks)

- Patent filing
- Prototype development
- Technology transfer
- Commercialization

#### Component 3: Scopus Papers (Full FA marks)

- Conference publications
- Journal publications
- With faculty and students

#### Component 4: Hackathons & Contests (Full FA marks)

- Participation levels
- NIRF-ranked institutions
- Industry/Government events
- Winning achievements

#### Component 5: Workshops & Seminars (Up to 20 marks)

- Top 200 NIRF institutions
- Duration tracking

#### Component 6: Online Courses (Up to 80 marks)

- MOOC platforms (Coursera, Udemy)
- NPTEL courses (4-week, 8-week)

#### Component 7: Entrepreneurship (Full FA marks)

- Udyam Registration
- DPIIT Recognition
- Funding/Incubation

#### Component 8: Coding Platforms (Up to 120 marks)

Semester-wise scoring for:

- **HackerRank** (HackOS scores)
- **CodeChef** (Ratings)
- **LeetCode** (Problems solved)

#### Component 9: Minor Projects (Up to 160 marks)

- Industry/NGO/Community projects
- Uniqueness assessment

### 4. Automatic Marks Calculation

The system automatically calculates marks based on:

- Activity type
- Achievement level
- Semester
- Platform scores
- Rubrics defined in the system

### 5. Reports

- Student-wise mark sheets
- Component-wise analysis
- Semester-wise reports
- Export functionality

## API Endpoints

### Students

- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Component Entries

Each component has similar endpoints:

- `GET /api/[component]/:studentId`
- `POST /api/[component]`
- `DELETE /api/[component]/:id`

Components:

- `community-service`
- `patents`
- `scopus`
- `project-competitions`
- `hackathons`
- `workshops`
- `online-courses`
- `entrepreneurship`
- `coding-platforms`
- `minor-projects`

### Calculations

- `GET /api/calculations/student/:studentId` - Get calculated marks
- `GET /api/calculations/total/:studentId` - Get total marks

## Database Schema

The SQLite database contains 11 tables:

1. `students` - Student information
2. `community_service` - Community service activities
3. `patents` - Patents and prototypes
4. `scopus_papers` - Research publications
5. `hackathons` - Hackathon participations
6. `workshops` - Workshop attendances
7. `online_courses` - Online certifications
8. `entrepreneurship` - Startup activities
9. `coding_scores` - Coding platform scores
10. `minor_projects` - Project submissions
11. `project_competitions` - Project competitions

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

```powershell
# Find process using port
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID [PID] /F
```

### Database Issues

If database errors occur:

```powershell
# Delete and recreate database
Remove-Item database\internal_marks.db
# Restart the server to auto-create tables
```

### Module Not Found

```powershell
# Reinstall dependencies
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install

cd client
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

## Development Tips

### Adding New Fields

1. Update database schema in `server/database.js`
2. Update API routes in `server/routes/`
3. Update form components in `client/src/components/forms/`
4. Update calculation logic in `server/routes/calculations.js`

### Modifying Marks Calculation

Edit `server/routes/calculations.js` to adjust rubrics and scoring logic.

### Styling Changes

- Main styles: `client/src/App.css`
- Global styles: `client/src/index.css`

## Support

For issues or questions:

1. Check console for error messages
2. Verify all dependencies are installed
3. Ensure database file has write permissions
4. Check that ports 3000 and 5000 are available

## Production Deployment

### Build Frontend

```powershell
cd client
npm run build
```

### Serve with Backend

Update `server/index.js` to serve static files from `client/build`

### Environment Variables

Update `.env` for production:

```
NODE_ENV=production
PORT=80
```

## License

MIT

## Contributors

Developed for Internal Marks Calculation System
