GradeTrack

GradeTrack is a web-based application designed for students to track their academic performance, calculate CGPA, and manage semester records efficiently.

📖 Use Case: Track and Calculate CGPA
Use Case Name: gradeTrack
Primary Users: Student (user of the app)
Stakeholders and Interests:
Student: Wants to track academic performance, calculate cumulative GPA, and view semester results.
University/College: Indirectly benefits when students monitor performance and plan better academically.

Preconditions:
Student has signed up and logged into GradeTrack.
Student has access to a device with internet or local storage capabilities.

Postconditions:
Student can view their current CGPA and grade classification.
Student can view and manage details of each semester.
Student can calculate future CGPA using the calculator.

Main Flow:
Student logs in to GradeTrack.
Dashboard displays current CGPA, grade classification, and saved semesters.

Student can:
View semester details (courses, grades, units).
Delete a semester record.
Navigate to the CGPA Calculator.
Student can log out or delete their account.

Alternative Flows:
No Semester Data: Dashboard shows placeholders and prompts to add semester results.
Delete Account: All data is removed from local storage and/or the backend database.

Exceptions:
If the delete API fails, a toast message informs the user.
If the student is not logged in, the system redirects to the login page.
Special Requirements:
Responsive design for mobile and desktop.
Secure storage of user credentials.
Use Bootstrap toasts and modals for user interactions.

🚀 Features
Dashboard: View current CGPA, grade classification, and saved semesters.
CGPA Calculator: Calculate semester or cumulative GPA.
Semester Management: Add, view, and delete semesters and courses.
Profile Management: Logout or delete account.
User Feedback: Interactive toasts and modals.
Responsive Design: Works on mobile, tablet, and desktop.
🛠 Technologies Used
HTML5, CSS3
JavaScript 
Bootstrap 5 (UI & responsiveness)
Bootstrap Icons
LocalStorage (data persistence)
Backend API (for account management)

⚙️ Installation
Clone the repository:
git clone 
Navigate to the project folder:
cd GradeTrack
Open dashboard.html or index.html in your browser.
If using the backend API, ensure it is running for signup/login/delete features.

📌 Usage
Sign up or log in.
On the Dashboard, view your current CGPA and saved semesters.
Use the CGPA Calculator to compute GPA.
View semester details using the eye icon.
Delete semesters using the trash icon.
Manage your account via the profile dropdown.

Toasts and Modals
Toasts display success/error notifications (e.g., semester deleted, account deleted).
Modals display semester details and confirmation dialogs.

Contributing
Fork the repository.
Create a branch: git checkout -b feature/your-feature.
Commit changes: git commit -m 'Add new feature'.
Push to branch: git push origin feature/your-feature.
<<<<<<< HEAD
Submit a pull request.
=======
Submit a pull request.
>>>>>>> 5691e27 (update changes)
