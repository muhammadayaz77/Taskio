# Re-theme Blood Bank thesis XML to Taskio (workspace/project/task management).
# Preserves WordprocessingML structure; only replaces literal text in document.xml.
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
if (-not (Test-Path (Join-Path $root "Blood Bank Application Thesis.docx"))) {
    $root = "d:\Coding World\Taskio"
}
$docxPath = Join-Path $root "Blood Bank Application Thesis.docx"
$workDir = Join-Path $root "thesis_taskio_work"
$zipPath = Join-Path $workDir "pack.zip"

if (-not (Test-Path $docxPath)) { throw "Thesis docx not found: $docxPath" }

Remove-Item $workDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $workDir | Out-Null
Copy-Item $docxPath $zipPath -Force
Expand-Archive -LiteralPath $zipPath -DestinationPath $workDir -Force
Remove-Item $zipPath -Force

$xmlPath = Join-Path $workDir "word\document.xml"
$s = [IO.File]::ReadAllText($xmlPath)
# Word often uses U+2013 en dash in "donor–receiver"; normalize for pattern matching.
$s = $s.Replace(('donor' + [char]0x2013 + 'receiver'), 'donor-receiver')
$s = $s.Replace(('Donor' + [char]0x2013 + 'Receiver'), 'Donor-Receiver')
$da = [char]0x2192  # matches Word's arrow (→) in DFD lines
$apos = [char]0x2019  # Word's curly apostrophe in contractions

# Longest / most specific first to avoid partial collisions.
$pairs = @(
    @('Blood Bank Application with Real-Time Donor-Receiver Map Tracking', 'Taskio: Web-Based Workspace, Project, and Task Management'),
    @('Blood Bank Application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) provides a seamless, scalable, and real-time solution.', 'Taskio is built using MongoDB, Express.js, React (Vite), and Node.js, providing a scalable web platform for teams to organize work in shared workspaces and projects.'),
    @('This web-based system enables donors and receivers to register, update medical and donation information, and communicate instantly. One of its core features is a ', 'This web-based system enables authenticated users to create workspaces and projects, manage tasks with priorities and due dates, assign collaborators, and communicate in real time. A core feature is '),
    @('real-time interactive map', 'real-time workspace chat powered by Socket.IO'),
    @(' that displays the current locations of nearby donors and receivers, allowing faster decision-making in emergency situations. Additional modules—including blood inventory management, request handling, automated notifications, and donor history tracking—ensure a smooth and reliable experience for hospitals, donors, and patients alike.', ', keeping distributed teams aligned. Additional modules—including kanban task boards, comments and attachments, sub-tasks, workspace invitations with roles (manager, contributor, viewer), email verification and password reset, dashboards, and archiving—support dependable delivery for teams and organizations.'),
    @('By leveraging the power of modern JavaScript technologies and real-time tracking, this MERN-based Blood Bank application simplifies the process of finding compatible donors, enhances emergency response speed, and contributes to a more connected and efficient healthcare support system.', 'By leveraging modern JavaScript, REST APIs, and real-time messaging, Taskio simplifies planning and execution, improves visibility of work in progress, and contributes to a more connected and efficient collaborative environment.'),
    @('The healthcare sector is witnessing a growing need for fast, reliable, and technology-driven solutions—especially in critical areas like blood availability. In emergency situations, finding a compatible blood donor quickly can make the difference between life and death. To address this challenge, the Blood Bank Application with Real-Time Donor-Receiver Map Tracking (built using the MERN Stack', 'Organizations and student teams increasingly need fast, reliable, and technology-driven ways to coordinate tasks across projects. Missed handoffs and unclear ownership slow delivery. To address this, Taskio (built using the MERN-style stack'),
    @(') provides an innovative and efficient platform.', ') provides a focused workspace and task management platform.'),
    @('The increasing reliance on digital health solutions highlights the importance of connecting donors and receivers seamlessly through real-time technology. With interactive live-location ', 'The shift toward distributed collaboration highlights the importance of keeping members aligned through centralized projects and transparent status. With '),
    @('tracking, instant communication.', 'task boards, comments, and instant workspace chat.'),
    @('The Blood Bank Website focuses on providing a centralized digital platform that connects blood donors, receivers. Its scope includes donor registration, blood request management, real-time donor-receiver location tracking, and a searchable database of available blood types. The system also supports secure login, automated notifications, and donor history management to ensure fast and efficient coordination during emergencies.', 'Taskio focuses on providing a centralized digital platform for workspaces, projects, and tasks. Its scope includes user registration with email verification, workspace and project creation, task lifecycle management (To Do, In Progress, Done), priorities, assignees, due dates, sub-tasks, attachments, member management with roles, workspace invitations, dashboard summaries, My Tasks and Archive views, profile and workspace settings, and real-time chat per workspace. Secure authentication, password reset, and session handling support day-to-day team coordination.'),
    @('The purpose of the Blood Bank Website is to provide a fast and reliable platform that connects blood ', 'The purpose of Taskio is to provide a fast and reliable platform that connects '),
    @('donors, receivers', 'team members across workspaces and projects'),
    @('. It enables real-time donor tracking, blood request management, and instant notifications, ensuring efficient coordination during emergencies and improving timely access to blood.', '. It enables clear ownership of tasks, progress tracking, and instant notifications through chat, improving coordination and reducing friction in collaborative work.'),
    @('Blood Bank', 'Taskio'),
    @('blood bank website', 'Taskio web application'),
    @('blood bank system', 'Taskio system'),
    @('Blood Bank Website', 'Taskio application'),
    @('Blood Bank System', 'Taskio system'),
    @('blood bank website', 'Taskio web application'),
    @('comprehensive blood bank website', 'comprehensive Taskio web application'),
    @('blood bank website', 'Taskio application'),
    @('blood bank management', 'workspace and task management'),
    @('Blood Bank Management System', 'Taskio workspace management system'),
    @('We hereby recommend that the project entitled "title of project" Submitted by ', 'We hereby recommend that the project entitled "Taskio: Web-Based Workspace, Project, and Task Management" Submitted by '),
    @('Blood Bank:', 'Taskio workspace:'),
    @('An organization or system that collects, stores, and distributes blood for medical use.', 'A shared digital area where teams create projects, tasks, and collaborate.'),
    @('Receiver/Recipient:', 'Project viewer or assignee:'),
    @('A person who voluntarily provides blood for transfusion.', 'A user who creates or updates tasks, comments, and assignments within shared projects.'),
    @(' A person in need of blood for medical treatment.', ' A user who participates in projects and consumes or contributes to task updates.'),
    @('Real-Time Tracking:', 'Real-time collaboration:'),
    @(' The process of monitoring donor and receiver locations instantaneously on a digital map.', ' Keeping workspace members informed through live chat and up-to-date task status on shared boards.'),
    @('Donor &amp; Receiver Registration', 'User registration'),
    @('Donor or Receiver attempts to register a new account with the system to gain access to personalized features.', 'A new user registers an account to access workspaces, projects, and tasks.'),
    @('Donor, Receiver', 'Authenticated user'),
    @(' System presents the registration form (Name, Contact, Blood Group, Role (Donor/Receiver), Password, etc.). ', ' System presents the registration form (name, email, password, etc.). '),
    @('The Donor or Receiver account is successfully created in the system, and the user is either logged in or redirected to the login page.', 'The user account is successfully created, and the user verifies email when required or is redirected to sign in.'),
    @('Request Blood', 'Create Task'),
    @('Receiver Requests Blood', 'Member Creates Task'),
    @('A logged-in Receiver attempts to submit a request for a specific blood group and unit amount to the system.', 'A signed-in project member creates a task within a project, specifying title, description, priority, due date, and optional assignees.'),
    @('Receiver', 'Project member'),
    @('The Receiver must be registered and logged in to the system.', 'The user must be registered, verified where applicable, and signed in with access to the project.'),
    @(' Receiver navigates to the "Request Blood" module. ', ' Member opens the project and chooses to create a new task. '),
    @(' System presents the blood request form (Required Blood Group, Units Needed, Location, Urgency, Contact Details, etc.). ', ' The system presents the task form (title, description, status, priority, due date, assignees, tags, etc.). '),
    @(' Receiver fills out the necessary details and submits the request. ', ' The member completes the task details and saves the task. '),
    @(' System saves the request and makes it visible to potential Donors (e.g., on a "View Requests" page).', ' The task is stored and appears on the project kanban board and task lists for permitted members.'),
    @('Validation fails if the required blood group or unit amount is not specified.', 'Validation fails if required fields such as the task title are missing or invalid.'),
    @('The system fails to save the request due to a database error.', 'The system fails to save the task due to a database or network error.'),
    @('A new blood request is successfully created and is available for Donors to view and respond to.', 'A new task is created and visible to project members according to their permissions.'),
    @('View Blood Requests', 'View Project Tasks'),
    @('Donor Views Requests', 'Member views task board'),
    @('A logged-in Donor views a list of pending blood requests posted by Receivers.', 'A signed-in member views tasks for a workspace or project with filters such as status or assignment.'),
    @(' Donor clicks on the "View Blood Requests" link/module. ', ' Member opens a workspace or project and views the task board or task list. '),
    @(' System displays the list of active blood requests, showing details like blood group, units needed, and location. ', ' The system lists tasks with title, status, priority, due date, and assignees. '),
    @(' Donor may apply filters (e.g., by blood group, distance, or urgency).', ' The member may filter tasks (for example by status, assignee, or priority).'),
    @(' No active blood requests are found in the system (Record Not Found).', ' No tasks match the selected filters (empty state).'),
    @('The Donor has successfully viewed the available blood requests and can proceed to the next action (e.g., Offer to Donate).', 'The member has viewed tasks and can update status, comment, or self-assign where allowed.'),
    @('Offer to Donate', 'Update Task / Collaborate'),
    @('Donor Offers Help', 'Member updates assignment or progress'),
    @('A logged-in Donor selects a specific request and offers their blood donation.', 'A signed-in member selects a task and updates fields such as status, assignees, sub-tasks, or comments to move work forward.'),
    @(' Donor must be logged into the system and have viewed the list of blood requests.', ' The member must be signed in and have access to the project task list.'),
    @(' Donor selects a specific blood request from the list. ', ' The member selects a task from the board or list. '),
    @(' Donor clicks on an "Offer to Donate" or "Respond" button. ', ' The member opens the task detail view or uses inline controls to edit fields. '),
    @(' The system presents a confirmation/contact form (optional details like preferred contact time, note). ', ' The system may present dialogs for comments, attachments, or assignee changes. '),
    @(' Donor clicks on the "Confirm Offer" button. ', ' The member saves changes to persist updates. '),
    @(' System sends a notification to the Receiver of the request with the Donor''s details.', ' Activity such as assignment or comments is visible to other members; chat messages notify participants in the workspace channel.'),
    @('The Receiver of the request is notified of the Donor''s offer, and the Donor''s response is recorded.', 'Other members see the updated task state and conversation history associated with the work item.'),
    @('A Donor or Receiver can change their account password.', 'An authenticated user can change their account password.'),
    @('Donor or Receiver must be logged in to the system.', 'The user must be signed in.'),
    @('A Donor or Receiver attempts to safely end their session and log out of the system.', 'An authenticated user ends the session and signs out of the application.'),
    @('For Location:   ', 'For real-time features:   '),
    @('Google Maps API', 'Socket.IO (WebSockets)'),
    @('Windows Server with SQL Server Database', 'Node.js server with MongoDB'),
    @('Implementation using SQL Server to ensure secure, reliable, and scalable data storage.', 'Implementation using MongoDB with Mongoose for flexible, scalable document storage.'),
    @("In today${apos}s digital era, technology has transformed the way healthcare services operate, including blood donation and management. Blood is a vital resource, and timely access to it can save countless lives. However, managing blood banks manually is a challenging and time-consuming task. Donors often face difficulties in registering or finding the nearest blood bank, while blood bank administrators struggle to track blood inventory, donor information, and blood requests efficiently.", 'In today''s digital era, teams rely on software to plan work, share context, and track progress. Manual spreadsheets and ad hoc messaging often lose tasks and obscure accountability. Contributors struggle to see priorities, while leads lack visibility into status across projects.'),
    @('To address these issues, a ', 'To address these issues, a '),
    @(' can be developed to streamline the entire process. This platform allows users to register as donors, request blood, and receive timely notifications, while administrators can manage blood inventory, track donations, and maintain an organized database. The digital approach ensures that both donors and recipients are connected seamlessly, ultimately improving the efficiency of blood management and saving more lives.', ' centralizes collaboration: users authenticate, join workspaces, create projects and tasks, assign work, and discuss in real time. Workspace managers configure members and invitations while contributors update tasks. The digital approach improves transparency, reduces duplicated effort, and supports consistent delivery practices.'),
    @('Currently, many blood banks rely on ', 'Many teams still rely on '),
    @('manual record-keeping systems', 'informal tracking (messages, documents, spreadsheets)'),
    @('. All donor details, blood inventories, and requests are maintained in registers or traditional files. While feasible for small-scale operations, this system faces major challenges as the volume of records increases:', '. Tasks, owners, and deadlines are scattered across channels, which becomes costly as work volume and collaborators grow:'),
    @('Manual systems often lead to inconsistencies in record management. There is no proper linkage between donor information, blood inventory, and blood requests, which can result in errors and confusion.', 'Informal systems produce inconsistent records. Tasks are not linked to projects or owners in one place, which increases errors and rework.'),
    @('Keeping manual records is extremely time-consuming. Searching for a donor''s details or checking available blood types requires significant effort and slows down emergency responses.', 'Searching across threads and files is slow. Finding who owns a deliverable or its latest status delays decisions.'),
    @('Manual blood bank operations demand more personnel to manage records, track donations, and handle requests. This not only increases labor costs but also raises the risk of human errors.', 'Manual coordination requires more overhead from leads and administrators to chase updates, raising labor cost and human error.'),
    @('Paper-based systems cannot provide real-time updates on blood inventory or donor availability. As a result, blood banks may struggle to respond to urgent blood requests efficiently.', 'Static documents do not reflect live progress. Teams struggle to respond quickly when priorities shift.'),
    @('Maintaining physical files and registers occupies a significant amount of space. As the number of donors and records grows, storing documents becomes cumbersome and reduces operational efficiency.', 'As the number of initiatives grows, fragmented artifacts become harder to navigate and archive.'),
    @('Updating or modifying records in a manual system is difficult and prone to mistakes. Each change often requires creating a new copy of the record, which slows down administrative processes.', 'Updating scattered records is difficult; duplicated copies diverge and slow administration.'),
    @('Paper records are vulnerable to loss, theft, or unauthorized access. Sensitive donor information and patient details are at risk, whereas a digital system can implement robust security measures, including password protection and encrypted databases.', 'Informal stores lack fine-grained access control. A web application can enforce authentication, roles, and secure handling of credentials and data at rest and in transit.'),
    @('The objective of the proposed system is to develop a ', 'The objective of the proposed system is to develop a '),
    @(' that streamlines blood donation, donor management, and blood request processes. This system is designed to facilitate donors, recipients, and administrators by providing an online platform where users can register as donors, request blood, and manage inventory ', ' that streamlines workspace setup, project tracking, and task execution. The system supports members and workspace leads through an online platform where users authenticate, organize projects, create and assign tasks, '),
    @('efficiently.', 'and collaborate efficiently.'),
    @('By leveraging web technologies, the website ensures real-time updates on blood availability, donor eligibility, and request status. The system aims to reduce manual effort, improve operational efficiency, and enhance accessibility for all users involved in the blood donation process.', 'Using a client-server architecture with MongoDB persistence, the application keeps task state and messages current. The goal is to reduce manual coordination, improve operational efficiency, and make work visible to every authorized participant.'),
    @('The proposed blood bank website consists of the following core modules:', 'Taskio consists of the following core modules:'),
    @('Donor Account:', 'User profile and authentication:'),
    @(' Allows donors to register, update profiles, and schedule donations.', ' Supports sign-up, email verification, password reset, sign-in, and profile settings.'),
    @('Recipient Account:', 'Workspace and membership:'),
    @(' Enables patients or hospitals to request blood based on blood type and location.', ' Enables creating workspaces, inviting members, assigning roles, and accepting invitations.'),
    @('Blood Inventory Management:', 'Project and task management:'),
    @(' Tracks the availability of various blood types in real-time.', ' Organizes projects and tasks with kanban columns, priorities, due dates, progress, and archiving.'),
    @('Request Information:', 'Collaboration and artifacts:'),
    @(' Records all blood requests and their statuses.', ' Supports comments, sub-tasks, file attachments, watchers, and workspace-scoped chat.'),
    @('Location Details: Stores and displays donor and recipient locations.', 'Notifications and activity: Surfaces meaningful updates through the UI and email flows where implemented.'),
    @('Integration with Google Maps:', 'Real-time transport:'),
    @(' Provides location-based search for nearby blood banks and donors.', ' Uses Socket.IO for workspace chat alongside REST APIs for CRUD operations.'),
    @('The blood bank website caters to three primary user roles: Administrator, Donor, and Recipient. Functional requirements for each user are as follows:', 'Taskio centers on authenticated users within workspaces. Typical responsibilities map to workspace roles (manager, contributor, viewer) and project membership. Functional highlights include:'),
    @('Register and update donor profile.', 'Register, verify email when required, and maintain profile settings.'),
    @('View donation history and eligibility status.', 'View assigned tasks, workspace projects, and personal dashboards such as My Tasks.'),
    @('Receive notifications for urgent blood requests.', 'Participate in workspace chat and see task updates relevant to the user.'),
    @('View available blood types and banks.', 'Browse projects and task boards within permitted workspaces.'),
    @('Place blood requests.', 'Create and edit tasks, including status transitions and assignments when authorized.'),
    @('Track the status of requests.', 'Track task lifecycle from To Do through In Progress to Done, including archive retrieval.'),
    @('The website must be intuitive and user-friendly. Minimal effort should be required to learn and navigate the platform. Features should be clearly accessible, and the process of registering, requesting blood, or updating inventory should be simple and efficient.', 'The application must be intuitive. Common flows—sign-in, joining a workspace, creating a task, moving cards on the board, and messaging—should require minimal training.'),
    @('The system is designed to minimize errors caused by manual record-keeping. Accurate tracking of donors, blood inventory, and requests ensures dependable operations.', 'The system reduces ambiguity by centralizing tasks and history, improving reliability of planning data.'),
    @('The system supports all modern web browsers and devices. It should be easily maintainable and scalable for future enhancements.', 'The React client targets modern browsers; the modular Express codebase should remain maintainable and extensible.'),
    @('Determines whether the system effectively addresses blood bank operational challenges.', 'Determines whether the system addresses common collaboration pain points.'),
    @('Confirms that administrators, donors, and recipients can interact with the system effectively.', 'Confirms that workspace leads and members can complete their primary workflows effectively.'),
    @('Evaluates potential benefits, such as reduced labor, improved efficiency, and increased donor participation.', 'Evaluates benefits such as reduced coordination overhead and clearer accountability.'),
    @('Entity-Relationship (ER) modeling for donors, recipients, blood inventory, and requests.', 'Entity-relationship modeling for users, workspaces, projects, tasks, comments, and related documents.'),
    @('In the context of a blood bank website, system design ensures efficient management of donors, recipients, blood inventory, and requests while maintaining data integrity, security, and real-time accessibility.', 'For Taskio, system design ensures coherent management of users, workspaces, projects, and tasks while preserving data integrity, security, and responsive user experience.'),
    @('Example: In a blood bank system, donor details like blood type, donation history, and contact information are captured while ignoring non-essential data.', 'Example: Task entities capture title, status, priority, assignees, and dates while omitting unrelated personal data.'),
    @('Example: The blood request module can be divided into sub-modules for request creation, approval, tracking, and notifications.', 'Example: Task management divides into creation, assignment, status updates, comments, attachments, and notifications.'),
    @('Modules include Donor Management, Recipient Management, Blood Inventory, Request Processing, and Notifications.', 'Modules include authentication, workspace administration, project management, task board, chat, and shared utilities.'),
    @('Example: Administrator module controls donor and recipient modules, while notifications are triggered automatically based on actions.', 'Example: Workspace settings control membership; the UI triggers API calls that persist changes and refresh views.'),
    @('Example: Relational database tables for donors, recipients, blood inventory, and requests.', 'Example: MongoDB collections and references between users, workspaces, projects, tasks, and messages.'),
    @('Sensitive information within modules (like donor personal details) is hidden from modules that do not require access.', 'Role-based access hides workspace or project data from users who are not members.'),
    @('The proposed blood bank website is designed to:', 'Taskio is designed to:'),
    @('Facilitate ', 'Facilitate '),
    @('team member registration', 'user onboarding'),
    @(' and management.', ' and membership management across workspaces.'),
    @('Enable ', 'Enable '),
    @('recipients and hospitals', 'project teams'),
    @(' to request blood efficiently.', ' to plan and execute tasks efficiently.'),
    @('Provide ', 'Provide '),
    @('real-time updates', 'timely updates'),
    @(' on blood inventory and donor availability.', ' on task status and team discussion through chat.'),
    @('Integrate with ', 'Integrate with '),
    @('location-based services', 'WebSocket-based messaging'),
    @(' for easy identification of nearby donors or blood banks.', ' for synchronous collaboration alongside REST endpoints.'),
    @('The blood bank website follows a ', 'Taskio follows a '),
    @('Handles user interface and interactions for donors, recipients, and administrators.', 'Handles UI interactions for authenticated users across dashboards, workspaces, projects, and tasks.'),
    @('Technologies: HTML5, CSS3, JavaScript, Bootstrap.', 'Technologies: HTML5, CSS3, JavaScript, React, Tailwind CSS, and shadcn-style UI primitives.'),
    @('Contains business logic for managing donors, requests, and blood inventory.', 'Contains business logic for users, workspaces, projects, tasks, comments, uploads, and invitations.'),
    @('Implements request validation, notification triggers, and workflow management.', 'Implements validation with Zod, JWT-based sessions or tokens as designed, and consistent API responses.'),
    @('Technologies: PHP, ASP.NET, or Node.js (depending on chosen stack).', 'Technologies: Node.js with Express.js (chosen stack).'),
    @('Stores all donor, recipient, and inventory data securely.', 'Stores documents for users, workspaces, projects, tasks, and chat messages securely.'),
    @('Implements relational tables with constraints for data integrity.', 'Uses Mongoose schemas with validation rules and references for integrity.'),
    @('Technologies: MySQL, SQL Server, or PostgreSQL.', 'Technology: MongoDB.'),
    @('Handles third-party services like ', 'May integrate services such as '),
    @(' for location tracking and email/SMS gateways for notifications.', ' SendGrid (or similar) for transactional email and Socket.IO for chat.'),
    @('Provides APIs for future integration with hospital management systems.', 'Provides REST APIs suitable for future mobile clients or integrations.'),
    @('Donor Module:', 'Task and project UI module:'),
    @('Functions: Registration, Profile Update, Donation History, Eligibility Check.', 'Functions: View and edit tasks, manage assignees, priorities, due dates, sub-tasks, attachments.'),
    @('Security: Password encryption, data validation.', 'Security: Password hashing, input validation, authenticated routes on the server.'),
    @('Recipient Module:', 'Workspace administration module:'),
    @('Functions: Blood Request Creation, Tracking Request Status, Notifications.', 'Functions: Manage workspace settings, members, invitations, and linked projects.'),
    @('Features: Urgent request alert system, priority handling.', 'Features: Role-based permissions and workspace-scoped chat.'),
    @('Administrator Module:', 'Cross-cutting services:'),
    @('Functions: Approve/Reject Requests, Manage Donors &amp; Recipients, Generate Reports.', 'Functions: Authentication, authorization checks, persistence, and logging as implemented in controllers.'),
    @('Features: Dashboard for real-time blood inventory, analytics for decision-making.', 'Features: Dashboard widgets summarizing task distribution and progress where enabled in the UI.'),
    @('Blood Inventory Module:', 'Persistence layer:'),
    @('Tracks incoming donations and available stock.', 'Stores authoritative records for tasks, projects, and workspaces.'),
    @('Ensures automatic updates upon donation or request fulfillment.', 'Ensures updates propagate after API mutations and client cache invalidation.'),
    @('Notification System:', 'Email and session flows:'),
    @('Sends alerts via email or SMS to donors for urgent blood requests.', 'Supports flows such as verification and password reset via email provider integration.'),
    @('Reminders for upcoming donation eligibility.', 'Session management for secure sign-in and sign-out.'),
    @('Location Services Module:', 'Real-time messaging module:'),
    @('Uses Google Maps API to display donor and recipient locations.', 'Uses Socket.IO for bi-directional chat within a workspace context.'),
    @('Helps in finding nearest available blood group in real time.', 'Helps distributed members stay aligned without refreshing the entire page unnecessarily.'),
    @("Donors input their information $da Stored in database $da Available for recipient searches.", "Users authenticate $da Workspace and project data persist in MongoDB $da Members query via APIs and React Query on the client."),
    @('Entities:', 'Entities (conceptual):'),
    @(' Donor, Recipient, Blood Inventory, Blood Request, Notifications.', ' User, Workspace, Project, Task, Comment, Message, Invitation, Attachment metadata.'),
    @("Donor $da Blood Inventory (One-to-Many)", "User $da Workspace membership (Many-to-Many through membership records)"),
    @("Recipient $da Blood Request (One-to-Many)", "Project $da Task (One-to-Many)"),
    @("Blood Request $da Inventory Update (One-to-One)", "Task $da Comments / Sub-tasks (One-to-Many)"),
    @('Donor: Name, Contact, Blood Type, Last Donation Date', 'User: credentials, profile fields, workspace roles'),
    @('Recipient: Name, Hospital, Required Blood Type', 'Project: title, description, status, dates, members'),
    @('Inventory: Blood Type, Quantity, Expiry Date', 'Task: title, status, priority, assignees, due date, estimates'),
    @('Request: Request ID, Donor Assigned, Status', 'Workspace: name, settings; Chat: channel per workspace'),
    @('Data encryption for sensitive donor and recipient information.', 'Transport security (HTTPS in deployment) and careful handling of secrets and tokens.'),
    @('for your Taskio Website focuses on creating simple, efficient, and reliable interactive screens.', 'for Taskio focuses on clear navigation between workspaces, projects, boards, and detail views.'),
    @(' To quickly register, view urgent requests, and schedule donations.', ' To join workspaces, triage assigned tasks, and update status quickly.'),
    @(' To easily post requests, track status, and view critical updates.', ' To create tasks, monitor board columns, and follow discussion on work items.'),
    @('UI design ensures vital information (like blood type and urgency) is clear and accessible, building trust in the system', 'UI design highlights task state, ownership, and deadlines to build confidence in shared planning'),
    @('Receiver Registration', 'Sign-up screens'),
    @('<w:t>Donar</w:t>', '<w:t>Members</w:t>'),
    @('<w:t xml:space="preserve"> Panel</w:t>', '<w:t xml:space="preserve"> dashboard</w:t>'),
    @('<w:t>Receiver Panel</w:t>', '<w:t>Kanban board</w:t>'),
    @('<w:t>Location</w:t>', '<w:t>Workspace chat</w:t>'),
    @('Based Login for ', 'Workspace login for '),
    @('System Testing is the comprehensive, end-to-end evaluation of the integrated Taskio application, designed to ensure the entire application functions as specified in the requirements. This testing phase follows Unit and Integration Testing and is performed on the complete, operational system to evaluate its compliance with both functional and non-functional requirements.', 'System testing is the comprehensive evaluation of the integrated Taskio application against requirements, following unit and integration testing where applied.'),
    @('The goal is to detect defects arising from the interaction between major components (e.g., how the Donor module interacts with the ', 'The goal is to detect defects from interactions between major parts of the stack (for example, how the React client interacts with the '),
    @('module) and to verify that the system as a whole meets the critical business need of facilitating safe and timely blood donations.', 'API) and to verify end-to-end workflows such as authentication, task updates, and chat.'),
    @('The testing process for the Taskio system is driven by several key purposes:', 'Testing Taskio is driven by purposes such as:'),
    @(' especially those related to system-level logic (e.g., incorrect urgency flag processing, failed notification delivery).', ' including validation failures, authorization errors, and failed integrations.'),
    @('Building confidence in the system''s ability to reliably manage user accounts, blood requests, and donation records.', 'Building confidence in user lifecycle flows, task CRUD, and collaborative features.'),
    @('Business Requirement Specification (BRS)', 'requirements brief'),
    @(' (e.g., only compatible blood groups are matched) and ', ' (for example, role rules are enforced) and '),
    @(' (e.g., system response time is acceptable).', ' (for example, acceptable interactive performance for typical boards).'),
    @('Ensuring critical functions like user authentication, data security, and request-to-donation workflows are robust to prevent service failure in urgent situations.', 'Ensuring authentication, authorization, and task update paths behave predictably under normal use.'),
    @('Delivering a reliable and intuitive product to Donors and Receivers, which is paramount in a life-saving application.', 'Delivering a dependable experience for everyday team coordination.'),
    @('The primary objective is to finalize the Taskio application by rigorously validating its completeness and performance against established specifications. This involves:', 'Objectives include validating completeness and stability against specifications, including:'),
    @('Ensuring every feature, from user registration to logging a completed donation, works correctly.', 'Ensuring primary flows—from registration and workspace access through task updates—behave correctly.'),
    @('Confirming the system can handle concurrent users and requests without significant delay (especially during "critical" urgency scenarios).', 'Confirming reasonable behavior under multiple concurrent users for chat and routine API usage.'),
    @('Verifying that the Donor and Receiver interfaces are intuitive and accessible, minimizing errors in request submission or donation acceptance.', 'Verifying that task forms and board interactions reduce user error and communicate validation messages clearly.'),
    @('For the ', 'For the '),
    @('units', 'estimated hours'),
    @(' field (min: 1), test inputs would include 0 (invalid), 1 (boundary/valid), 5 (mid-range/valid), and a large number like 100 (stress/valid).', ' or similar numeric fields, exercise invalid, boundary, typical, and large values according to schema rules.'),
    @(' field at the minimum limit (e.g., 18 or 17), and the maximum reasonable limit.', ' fields at minimum and maximum allowed values per validation rules.'),
    @(' field in the ', ' field in the '),
    @('BloodRequest', 'Task'),
    @(' schema.', ' document or DTO schema.'),
    @('Testing the transition from ''pending''', 'Testing transitions between task statuses such as ''To Do'''),
    @(' ''accepted'' ', ' ''In Progress'' '),
    @(' ''completed'', and ensuring illegal transitions (e.g., ''completed'' ', ' ''Done'', and ensuring illegal transitions (for example from ''Done'' '),
    @(' ''pending'') are prevented.', ' back to disallowed states) are prevented when business rules require it.'),
    @('Testing the logic that checks if ', 'Testing logic that enforces '),
    @('donor.availability', 'assignee permissions'),
    @(' if the Donor''s blood type is compatible with the ', ' project membership before updates to sensitive fields such as '),
    @('bloodRequest.bloodGroup', 'task.assignees'),
    @(' For matching logic, ensuring separate tests for (a) correct blood group, (b) correct location, and (c) Donor availability.', ' For authorization, ensuring tests for permitted versus forbidden workspace or project actions.'),
    @('Utility Functions:', 'Utility functions:'),
    @('Testing helper functions like password hashing, date formatting, and geographical distance calculation.', 'Testing helpers such as password hashing, date handling, and progress calculations used by the UI.'),
    @('createRequest', 'createTask'),
    @('updateDonorProfile', 'updateUserProfile'),
    @('Request Creation', 'Task creation'),
    @(' Notification', ' downstream updates'),
    @(' records for matching Donors.', ' or refreshed views for project members as designed.'),
    @(' status is set to ''completed'', the system successfully calls the ', ' is set to ''Done'', related fields such as '),
    @(' API to update ', ' may update '),
    @('lastDonationDate', 'completedAt'),
    @('The following test cases cover the core business processes for the Donor and Receiver roles:', 'The following illustrative test cases map to Taskio workflows:'),
    @('A Donor attempts to log in, and then tries to access a ', 'A user signs in and then attempts to access a '),
    @('Project member-only dashboard page.', 'resource outside their workspace membership.'),
    @('Successful login, but access is denied to the Receiver-only page, ', 'Successful authentication but authorization prevents viewing the restricted page, '),
    @('showing a correct authorization error.', 'with an appropriate error response or UI message.'),
    @('Critical Blood Request Lifecycle', 'Task lifecycle update'),
    @('A Receiver posts a request with ', 'A member creates or updates a task with '),
    @('urgency: ''critical''', 'priority: ''High'''),
    @(' for ''O-''.', ' and moves it across the board.'),
    @('Request is successfully submitted; ', 'Changes persist; '),
    @(' all', ' relevant'),
    @(' Team members with compatible blood types (O-, O+, A-, B-, AB-) receive an immediate notification/email.', ' members see updates after refresh or cache invalidation; chat messages reach room subscribers when Socket.IO is connected.'),
    @('Incompatible Donor Exclusion', 'Unauthorized task access'),
    @('A Donor with blood type ''A+'' searches for ''B-'' blood requests.', 'A user without membership attempts to open another workspace''s private project.'),
    @('The ''B-'' request is not visible or flagged as incompatible, preventing the Donor from accepting it.', 'The server rejects the request or the UI hides the resource, preventing unauthorized edits.'),
    @('Post-Donation Profile Update', 'Task completion metadata'),
    @('A Donor completes a donation. The system processes the ', 'A member marks a task Done. The system processes '),
    @(' record.', ' updates.'),
    @('The Donor''s profile field ', 'Fields such as '),
    @(' is updated to the current date, and ', ' may be set, and '),
    @('availability', 'status'),
    @(' is set to FALSE (if required by business rules).', ' reflects the completed workflow.'),
    @('Geolocation Accuracy', 'Authorization on workspace routes'),
    @('The system calculates the distance between a Donor''s location and the hospital location provided in the request.', 'The server verifies JWT or session context against workspace membership for protected endpoints.'),
    @('The calculated distance is accurate within a specified tolerance (e.g., 50 meters).', 'Unauthorized calls return 401/403 consistently.'),
    @('Request Cancellation', 'Task archival or deletion'),
    @('The Receiver or an authorized user cancels a ', 'A member with permission archives or deletes a '),
    @(' that is currently ', ' that is currently '),
    @('''accepted'' by a Donor.', '''In Progress''.'),
    @('The ', 'The '),
    @(' status changes to ''cancelled'', and a notification is sent to the ', ' status changes accordingly, and collaborators see the updated state in the UI or chat where implemented.'),
    @('assigned Donor informing them of the cancellation.', ''),
    @('The system must allow users (Donor/Receiver) to register and securely authenticate.', 'The system must allow users to register, verify email when enabled, and authenticate securely.'),
    @('Receivers must be able to post urgent blood requests, specifying type, units, and hospital.', 'Members must be able to create and update tasks with appropriate metadata and permissions.'),
    @('Donors must only be matched with and notified of compatible blood requests within a 50km radius.', 'Users must only access workspaces and projects for which they are members with the correct role.'),
    @('Upon completion of a donation, the Donor''s last donation date must be updated to reflect the business rule for next eligibility.', 'Upon task completion, timestamps and derived progress views should remain consistent with stored data.'),
    @('Users must be notified of critical status changes to their requests or scheduled donations.', 'Users should see meaningful feedback when tasks they follow change state or when chat events occur.'),
    @('This project set out to address the limitations of traditional, manual blood bank systems, which often suffer from slow processes, inconsistent records, and limited accessibility. To overcome these issues, we developed a web-based Taskio workspace management system designed to streamline donor registration, blood inventory tracking, and request handling.', 'This project addresses fragmented manual coordination by implementing Taskio, a web-based workspace and task management system for teams.'),
    @('The proposed website provides a centralized, efficient, and user-friendly platform that enhances accuracy, improves response times, and supports real-time availability of blood units. By integrating automated processes and secure data management, the system reduces human error and strengthens coordination between donors, recipients, and administrators.', 'The application centralizes projects and tasks, improves visibility of work, and supports real-time discussion. Structured persistence and validation reduce mistakes and clarify accountability among members.'),
    @('Overall, this project demonstrates how modern web technologies can effectively transform and optimize blood bank operations, ensuring faster access to life-saving resources and contributing to a more reliable and responsive healthcare support system.', 'Overall, the project demonstrates how the MERN-style stack can deliver a practical collaboration tool suitable for coursework and small-team usage, with room for further hardening and analytics in future work.'),
    @('[6] "World Health Organization — Blood Safety and Availability," WHO, 2023. Available: ', '[6] MongoDB Inc., "MongoDB Documentation," 2026. Available: '),
    @('https://www.who.int', 'https://www.mongodb.com/docs/'),
    @('[7] "Blood Donation and Transfusion Standards," International Federation of Red Cross and Red Crescent Societies (IFRC), 2023. Available: ', '[7] Socket.IO, "Socket.IO Documentation," 2026. Available: '),
    @('https://www.ifrc.org', 'https://socket.io/docs/'),
    @('blood request management', 'task and project management'),
    @('blood requests', 'tasks'),
    @('blood request', 'task'),
    @('Blood Request', 'Task'),
    @('blood inventory', 'work backlog'),
    @('blood types', 'task categories'),
    @('blood type', 'priority level'),
    @('blood donor', 'contributor'),
    @('team members across workspaces and projects. Its scope includes donor registration, blood request management, real-time donor-receiver location tracking, and a searchable database of available blood types. The system also supports secure login, automated notifications, and donor history management to ensure fast and efficient coordination during emergencies.', 'Team members collaborate inside workspaces and projects. Scope includes user registration with verification flows, project and task management, progress tracking, kanban boards, priorities, due dates, assignees, comments, attachments, workspace invitations with roles, dashboards, archiving, profile and workspace settings, and Socket.IO chat. Authentication, password reset, and session handling support everyday coordination.'),
    @('donor registration', 'user registration'),
    @('donor history', 'task activity'),
    @('CHAPTER 5: System Testing for the Blood Bank System', 'CHAPTER 5: System Testing for Taskio'),
    @('System Testing for the Taskio system', 'System testing for Taskio'),
    @('blood team members', 'team members'),
    @('blood donation, donor management', 'workspace setup, member coordination'),
    @('facilitate donors, recipients, and administrators', 'support contributors, reviewers, and workspace owners'),
    @('register as donors, request blood, an', 'create tasks, invite collaborators, and'),
    @('d manage inventory ', ' manage workspace backlogs '),
    @('bloodGroup', 'taskStatus'),
    @('Donor', 'Team member')
)

# Never run bulk string replace inside Word field instructions (TOC, PAGEREF, etc.) — that corrupts XML and Word reports document.xml line 2.
$instrMasks = New-Object System.Collections.Generic.List[string]
$s = [regex]::Replace(
    $s,
    '(?is)<w:instrText\b[^>]*>.*?</w:instrText>',
    {
        param($m)
        [void]$instrMasks.Add($m.Value)
        $id = $instrMasks.Count - 1
        return '<w:instrText xml:space="preserve">__THESIS_INSTR_MASK_' + $id + '__</w:instrText>'
    }
)

foreach ($p in $pairs) {
    if ($p.Count -ne 2) { continue }
    $old = $p[0]; $new = $p[1]
    if ($old.Length -eq 0) { continue }
    $s = $s.Replace($old, $new)
}

for ($mi = 0; $mi -lt $instrMasks.Count; $mi++) {
    $s = $s.Replace('<w:instrText xml:space="preserve">__THESIS_INSTR_MASK_' + $mi + '__</w:instrText>', $instrMasks[$mi])
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText($xmlPath, $s, $utf8NoBom)

# Word requires OPC-compliant ZIP: entry names must use '/' (Compress-Archive uses '\' and breaks Word).
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$outZip = Join-Path $root "Taskio_Thesis_repacked.zip"
if (Test-Path $outZip) { Remove-Item $outZip -Force }
$zipStream = [IO.File]::Open($outZip, [IO.FileMode]::Create, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
try {
    $archive = [IO.Compression.ZipArchive]::new($zipStream, [IO.Compression.ZipArchiveMode]::Create)
    try {
        $packRoot = [IO.Path]::GetFullPath($workDir).TrimEnd('\')
        foreach ($file in (Get-ChildItem -LiteralPath $workDir -Recurse -File)) {
            $rel = $file.FullName.Substring($packRoot.Length).TrimStart('\').Replace('\', '/')
            $entry = $archive.CreateEntry($rel, [IO.Compression.CompressionLevel]::Optimal)
            $entryStream = $entry.Open()
            try {
                $inStream = [IO.File]::Open($file.FullName, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::ReadWrite)
                try { $inStream.CopyTo($entryStream) } finally { $inStream.Dispose() }
            } finally { $entryStream.Dispose() }
        }
    } finally { $archive.Dispose() }
} finally { $zipStream.Dispose() }

$outDocx = Join-Path $root "Taskio_Application_Thesis.docx"
if (Test-Path $outDocx) { Remove-Item $outDocx -Force -ErrorAction SilentlyContinue }
Copy-Item $outZip $outDocx -Force

# Optional: replace original filename for convenience
$bloodOut = Join-Path $root "Blood Bank Application Thesis.docx"
if (Test-Path $bloodOut) { Remove-Item $bloodOut -Force -ErrorAction SilentlyContinue }
Copy-Item $outDocx $bloodOut -Force

Remove-Item $outZip -Force -ErrorAction SilentlyContinue
Remove-Item $workDir -Recurse -Force

Write-Host "Wrote: $outDocx"
Write-Host "Updated: $(Join-Path $root 'Blood Bank Application Thesis.docx')"
