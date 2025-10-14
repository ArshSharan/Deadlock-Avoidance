# College Fest Resource Allocation System
## Deadlock Avoidance using Banker's Algorithm

**Team: The Kernel Crew**
- Arsh Sharan
- Keshav Gujrathi

---

## Project Overview

An interactive web-based simulation demonstrating **Deadlock Avoidance** using the **Banker's Algorithm**. Multiple student clubs (processes) compete for limited resources (Stage, Projector, Sound System), and the system ensures safe resource allocation to prevent deadlocks.

### Key Features
- [ ] Real-time resource allocation simulation
- [ ] Visual representation of safe/unsafe states
- [ ] Interactive UI with smooth animations
- [ ] Request logging and export functionality
- [ ] Educational visualization of OS concepts

---

## Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Axios** - API communication

### Backend
- **Python 3.8+** - Core logic
- **Flask** - REST API framework
- **Flask-CORS** - Cross-origin support

---

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- pip (Python package manager)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Deadlock-Avoidance
```

#### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on: `http://localhost:5000`

#### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

---

## How to Use

1. **Set Available Resources**: Enter total Stage, Projector, and Sound System units
2. **Add Clubs**: Define clubs with their maximum resource needs
3. **Allocate Resources**: Set current allocation for each club
4. **Make Requests**: Select a club and request additional resources
5. **Run Algorithm**: Click "Check Safety & Allocate" to run Banker's Algorithm
6. **View Results**: See safe sequence or unsafe state warning
7. **Export Logs**: Download allocation history as CSV

---

## OS Concepts Demonstrated

### Deadlock Avoidance
- **Banker's Algorithm**: Ensures system never enters unsafe state
- **Safe State**: System can allocate resources to all processes in some order
- **Unsafe State**: Potential for deadlock exists

### Four Conditions for Deadlock
1. **Mutual Exclusion**: Resources cannot be shared
2. **Hold and Wait**: Processes hold resources while waiting for others
3. **No Preemption**: Resources cannot be forcibly taken
4. **Circular Wait**: Circular chain of processes waiting for resources

---

## Project Structure

```
Deadlock-Avoidance/
├── backend/
│   ├── app.py                 # Flask server & API endpoints
│   ├── bankers_algorithm.py   # Core Banker's Algorithm logic
│   ├── requirements.txt       # Python dependencies
│   └── logs/                  # Request logs storage
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API service layer
│   │   ├── App.js            # Main application
│   │   └── index.js          # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── README.md
└── LICENSE
```

---

## API Endpoints

### POST `/api/run-bankers`
Run Banker's Algorithm for a resource request.

**Request Body:**
```json
{
  "allocation": [[0, 1, 0], [2, 0, 0], [3, 0, 2]],
  "max_need": [[7, 5, 3], [3, 2, 2], [9, 0, 2]],
  "available": [3, 3, 2],
  "request": {
    "club_id": 0,
    "resources": [0, 2, 0]
  }
}
```

**Response:**
```json
{
  "safe": true,
  "safe_sequence": ["Club 1", "Club 2", "Club 3"],
  "message": "Request granted safely",
  "need_matrix": [[7, 4, 3], [1, 2, 2], [6, 0, 0]],
  "new_available": [3, 1, 2]
}
```

### GET `/api/logs`
Retrieve all allocation logs.

### POST `/api/reset`
Reset system state and clear logs.

---


## Example Scenario

**Initial State:**
- Available: [10, 5, 7] (Stage, Projector, Sound)
- 3 Clubs with different resource needs

**Club 1 Requests:** [0, 2, 0]
- System checks if granting keeps state safe
- If safe → allocate and show safe sequence
- If unsafe → deny and explain why

---

## Visualization Components

1. **Resource Dashboard**: Shows available vs. total resources
2. **Allocation Matrix**: Current resource allocation per club
3. **Need Matrix**: Remaining resource needs
4. **Safe Sequence**: Order of safe execution
5. **Request Log**: Historical allocation decisions

---

## Development

### Running Tests
```bash
# Backend tests
cd backend
python app.py

# Frontend tests
cd frontend
npm start
```

### Building for Production
```bash
cd frontend
npm run build
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**The Kernel Crew**
- [Arsh Sharan](mailto:arshsharan06@gmail.com) 
- [Keshav Gujrathi](mailto:gujrathikeshav9@gmail.com) 


