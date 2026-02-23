# Quick Start Guide ⚡

## Get Started in 3 Steps

### 1️⃣ Install Dependencies (First Time Only)

```powershell
npm run install-all
```

### 2️⃣ Start the Application

```powershell
npm run dev
```

### 3️⃣ Open in Browser

- Frontend: **http://localhost:3000**
- Backend API: **http://localhost:5000**

---

## Usage Flow

### Step 1: Add a Student

1. Click "Students" in navigation
2. Click "Add New Student"
3. Fill in: Roll Number, Name, Email, Semester, Department
4. Click "Add Student"

### Step 2: Add Entries for Components

Click on the student to view details, then add entries for any of the 9 components:

**1. Community Service** (40 marks max)

- Add workshops, coding sessions, or similar activities
- Specify organization and team size (max 3)

**2. Patents & Prototypes** (Full FA marks)

- Add patent details
- Mark if commercialized or technology transferred

**3. Scopus Papers** (Full FA marks)

- Add conference/journal publications
- Include DOI and Scopus ID

**4. Hackathons** (Full FA marks)

- Add participation or winning details
- Specify NIRF rank if applicable

**5. Workshops & Seminars** (20 marks max)

- Add workshop attendance
- Top 200 NIRF institutions get full marks

**6. Online Courses** (80 marks max)

- MOOC: 20 marks
- NPTEL 4-week: 40 marks
- NPTEL 8-week: 80 marks

**7. Entrepreneurship** (Full FA marks)

- Add startup details
- Udyam, DPIIT, Funding information

**8. Coding Platforms** (120 marks max)

- HackerRank (HackOS scores)
- CodeChef (Ratings)
- LeetCode (Problems solved)
- **Marks based on semester and score**

**9. Minor Projects** (160 marks max)

- Add project details
- Industry/NGO/Community engagement

### Step 3: View Calculated Marks

- Marks are automatically calculated based on rubrics
- View in student details page
- Check "Reports" section for comprehensive views

---

## Key Features

✅ **Automatic Marks Calculation** - Based on defined rubrics  
✅ **Semester-wise Tracking** - Different criteria for each semester  
✅ **Multiple Entries** - Add multiple activities per component  
✅ **Proof Documents** - Attach evidence for verification  
✅ **Real-time Updates** - Instant calculation updates  
✅ **Export Reports** - Generate mark sheets

---

## Component Directory Structure

```
INTERNAL-MARKS/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Main components
│   │   │   ├── Dashboard.js
│   │   │   ├── Students.js
│   │   │   ├── StudentDetails.js
│   │   │   ├── Reports.js
│   │   │   └── forms/        # Entry forms (9 forms)
│   │   ├── services/         # API calls
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                    # Node.js Backend
│   ├── routes/               # API routes (13 files)
│   ├── database.js           # SQLite setup
│   └── index.js             # Server entry
├── database/                 # SQLite DB (auto-created)
├── .env                     # Configuration
└── package.json             # Root dependencies
```

---

## Scoring Reference

### Semester-wise HackerRank HackOS

| Semester | Score | Marks |
| -------- | ----- | ----- |
| II       | 200   | 20    |
| II       | 300   | 40    |
| II       | 400   | 60    |
| III      | 1500  | 60    |
| III      | 2000  | 80    |
| IV       | 3000  | 40    |
| IV       | 5000  | 120   |
| V        | 10000 | 60    |
| VI       | 12000 | 40    |
| VII      | 12500 | 20    |

### CodeChef Ratings

| Semester | Rating | Marks |
| -------- | ------ | ----- |
| III      | 400+   | 80    |
| IV       | 600+   | 80    |
| V        | 1800+  | 120   |
| VI       | 2300+  | 80    |
| VII      | 2600+  | 40    |

### LeetCode Problems

| Semester | Solved | Marks |
| -------- | ------ | ----- |
| IV       | 12     | 80    |
| V        | 80     | 80    |
| VI       | 140    | 120   |
| VII      | 250    | 120   |

---

## Common Commands

```powershell
# Install all dependencies
npm run install-all

# Run both frontend and backend
npm run dev

# Run only backend
npm run server

# Run only frontend
npm run client

# Build for production
cd client
npm run build
```

---

## Tips

💡 **Multiple Activities**: Add multiple entries for each component to maximize marks  
💡 **Proof Documents**: Always add proof document links for verification  
💡 **Semester Matters**: For coding platforms, ensure correct semester is selected  
💡 **Team Activities**: Community service allows team of up to 3 members  
💡 **Regular Updates**: Keep coding platform scores updated throughout semester

---

## Need Help?

- Check [SETUP.md](SETUP.md) for detailed installation guide
- Check [README.md](README.md) for API documentation
- Check browser console for error messages
- Check terminal for backend errors

---

## System Requirements

- ✅ Node.js v14+
- ✅ Modern web browser (Chrome, Firefox, Edge)
- ✅ 100 MB free disk space
- ✅ Ports 3000 and 5000 available

---

**Happy Calculating! 🎓📊**
