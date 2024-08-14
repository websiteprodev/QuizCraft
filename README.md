QuizCraft 
 A Customizable Quiz Platform

Project Description

QuizCraft is an innovative platform designed for creating, sharing, and participating in quizzes. It is a comprehensive solution for educators, recruiters, and enthusiasts to craft quizzes tailored to their needs. The platform has features like public and private quiz settings, a searchable quiz database, and a scoreboard for participant rankings.

The application has two main parts:
Organizational – here, the application educators can create and manage quizzes.
For students – everyone is welcome to register and to participate in quizzes. Students can be invited from educators to become educators.


Functional Requirements
Entities

•	Authentication is handled by Firebase, there is no need for auth entity.
•	Each user must have a username, email, phone number and a photo. Users should have a first name and a last name. Users can either be organizers or students.
o	Username must be unique and between 3 and 30 characters. 
o	First and last names must be between 1 and 30 characters and must include only uppercase and lowercase letters (X Æ A-12 is not a valid personal name). 
o	Phone numbers must have 10 digits and be unique in the system.   
o	A user could have an address. 

•	Quizzes must have an id, title, category, type of the quiz – open or invitational, a set of questions, options for answers and a scoring mechanism. Additional requirements are provided further in the description,
o	Title must be between 3 and 30 characters and unique.
o	The quiz must know who its creator is.
o	Category could be reused from previous quizzes. 
o	There must be an option to include a timer for quiz completion.
o	Each quiz should indicate the total points available.
o	Quizzes should include a scoreboard - a system to rank users based on their scores on the quiz.
o	Quizzes should be able to be marked as public or private.
•	Scoreboard: There could also be scoreboards for users, who completed quizzes in different categories
•	Search Functionality: There should be a feature to search available public quizzes by keywords, categories, or tags.
•	You might need to create a few more documents in the database depending on what your interpretation and implementation of the assignment requires.
•	Groups of educators: Educators should be able to participate in groups. Each educator has the right to modify tests made by educators from their group and is not able to modify tests made by educators outside their group.


Public Part
The public part must be accessible without authentication i.e. for anonymous users.
Landing page (must) – you can show the latest quiz based on a certain criteria or something else that might be compelling for people to register.
Login form (must) – redirects to the private area of the application. Login requires username and password.
Register form (must) – registers someone as an Educator or a Student (you must consider a way to verify that you are a teacher). Requires username, first name, last name, and password.
Quiz Browsing: Anonymous users should be able to browse and search for public quizzes.
Sample Quiz: There must be a feature for users to try out a sample quiz to get to know the platform without registering.
Private Part
Accessible only to authenticated users.
All Quizzes Page
Quizzes page (must) is different for Educators and Students.
For Educators: (any of the below can be either a new page, or directly on the dashboard)
o	There must be a way to set up a new Quiz with a custom set of questions and answers.
o	There must be a way for quiz management: Educators can manage the quizzes they created, including editing, or deleting them.
o	There must be a way for educators to invite students to take quizzes.
o	There must be a way to view Quizzes which are Ongoing.
o	There must be a way to view Quizzes which are Finished.
o	There must be a way to view students.
•	(If scoring is implemented) ordered by ranking (should)
For Students:
o	There must be a way to view active quizzes.
o	There must be a way to view quizzes that the student currently participates in.
o	There should be a way to view quizzes contests that the student participated in.
o	Students should be able to view scoreboards of quizzes they participated in.
o	(If scoring is implemented) Display current points and ranking and how much until next ranking at a visible place. (should) 

Profile Editing: All users must be able to see and edit their profile information but cannot change their username.
Quiz Requirements:
o	Quiz Participation (must): A user can participate in multiple quizzes and see their results on the respective scoreboards.
o	Invitation Acceptance (must): Users can accept or reject invitations to private quizzes.
o	Quiz Settings (must): Creators can set time limits, question order randomization, and passing scores for their quizzes.
Quiz page
o	The quiz’s status is always visible. It is one of the two:
o	Ongoing (must)
•	Remaining time until the quiz is active for participating.
•	Students see the enroll button if the quiz is ongoing and they are not participating.
•	If they are participating and have not answered the questions yet, they see a timer as an alert.

o	Finished (must)
•	Educators can now see and review the answers. There must be a way to add a comment to the exact answer. (must)
•	Participants can view their score and comments. (must)
Create Quiz Page
Create Quiz Form (must) – either a new page, or on the educator’s dashboard. The following must be easy to setup.
o	Title – text field (required and unique)
o	Category – text field (required). Multiple choice between the categories of the other tests could be provided.
o	Open (must) or Invitational (should) Contest. Open means that everyone can join.
•	If invitational – a list of users should be available, along with the option to select them (should)
o	Time limit (for the ongoing phase) (must) – anything from half hour to whatever the need of the quiz is.
o	Questions and answers (must) – the educator must be able to add several questions that can be open-ended or closed. The educator can also adjust the number of points each question gives.
Administrative Part
Accessible to users with administrative rights (Admins).
User Management: Admins must be able to search for users by username, first and last name, email. Lists of users should support pagination or infinite scroll functionality. Admin users must be able to block and unblock individual users. Blocked users must not be able to login.
Quiz Management: Admins can edit or delete any quiz.
Scoreboard Moderation: Admins could be able to oversee scoreboards for tests and address any discrepancies.
Accessible to educators
Educator Groups: Educators should be separated into groups. Educators in the same group can edit or delete any quiz, that is created by someone on their team. 
Other Optional Features
Email verification – In order for the registration to be completed, the user could verify their email by clicking on a link sent to their email by the application.
Question banks – Instead of writing each question for a test individually, there could be a functionality that provides access to a question bank. Educators can add questions to the question bank, and when they are creating a test, they can take questions from the bank directly, and add them to their new test. 
The client could be implemented as a desktop application with tools such as Electron or NW.js.
Quiz subscriptions – The user could subscribe to see other people’s public quizzes and instantly be able to participate in them. Research .ics files.
To-do functionality – The client could be able to mark quizzes and add them in a to-do list.
Dark mode – The client could have a dark mode theme.
Diverse colours – You could add diverse colours or fun icons to quizzes, e.g., black for deadlines, yellow for important events, blue for work events, green for sports, etc. Be creative!
Easter eggs – Creativity is always welcome and appreciated. Find a way to add something fun and/or interesting, maybe an Easter egg or two to your project to add some variety. 
You could use external libraries like Redux or Zustand for state management.
You could use Typescript.
You could implement an AI helper for educators to assist them in writing questions or multiple-choice options for the questions.
Firebase Realtime Database
All data should be stored in the document (NoSQL) database hosted by Google Firebase. You must think of a way to organize your documents to achieve the functionalities described above.
Use Cases
Evlogi’s Quiz Preparation Journey:
Evlogi, a student, registers on QuizCraft to enhance his preparation. He explores public quizzes, searching by keywords or categories. He participates in sample quizzes to understand the platform. Then he enrols in quizzes created by educators. Views his scores on respective scoreboards. Receives invitations to private quizzes and decides whether to accept or reject them.
Ms. Johnson Quiz Creation and Oversight:
Ms. Johnson, an educator, joins QuizCraft to create custom quizzes for her students. She creates and publishes quizzes with various question types. She sets time limits, randomises question order, and defines the points each question gives. She manages end edits the quizzes she created. She invites students to participate in her quizzes. Then she can review quiz scoreboards and provides feedback to students based on their performance.
Technical Requirements 
General 
•	Follow KISS, SOLID, DRY principles when coding.
•	Follow the principles of functional programming wherever applicable.
•	Use tiered project structure (separate the application in layers, if applicable).
•	You should implement proper exception handling and propagation.
•	Try to think ahead. When developing something, think – “How hard would it be to change/modify this later?” 
Git 
Commits in the GitHub repository should give a good overview of how the project was developed, which features were created first and the people who contributed. Contributions from all team members must be evident through the git commit history! The repository must contain the complete application source code and any scripts (database scripts, for example). 
Provide a link to a GitHub repository with the following information in the README.md file: 
•	Project description 
•	Link to the hosted project (if hosted online) 
•	Instructions on how to setup and run the project locally.
 
Optional Requirements 
Besides all requirements marked as should and could, here are some more optional requirements: 
•	Use branches while working with Git. 
•	Host your application with Firebase Hosting or any other hosting service.
Teamwork Guidelines 
Please see the Teamwork Guidelines document.  
Appendix 
•	Git commits - an effective style guide 
•	How to Write a Git Commit Message 
Legend 
•	Must – Implement these first. 
•	Should – if you have time left, try to implement these. 
•	Could – only if you are ready with everything else give these a go. 
•	 else give these a go.
