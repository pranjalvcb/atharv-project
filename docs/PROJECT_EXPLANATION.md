# CareCompanion — MCA Viva Project Explanation

## 1. Project Title
**CareCompanion: A Local Family Hospital Support & Companion Hiring Platform**

## 2. Problem Statement
Many people live in a different city from their parents or relatives. When a parent needs to visit a hospital, the family member may be unable to travel because of work, distance or other responsibilities. The problem is not only reaching the hospital: the patient may need someone to accompany them, organize documents, explain the family's prepared concerns to the doctor, coordinate basic non-clinical tasks and keep the remote family member informed.

## 3. Proposed Solution
CareCompanion connects families with local companions who can provide non-clinical support. The customer can discover a companion, review experience/rating/rate, book a service, provide hospital and appointment information, and receive updates until the request is completed.

## 4. Why this project is useful
- Solves a real-world coordination problem.
- Helps families living in different cities.
- Creates a structured alternative to asking random people for help.
- Keeps booking, status and communication in one place.
- Can be expanded to elder-care, diagnostic visits and post-discharge support.

## 5. Objectives
1. Provide a searchable companion directory.
2. Allow authenticated users to create support requests.
3. Store patient/hospital/appointment information in a structured booking.
4. Provide a status lifecycle: Requested → Accepted → In Progress → Completed.
5. Allow family updates against each booking.
6. Maintain role-based access for customer, companion and admin.
7. Demonstrate a complete database-backed web application.

## 6. Users / Roles
### Customer
Creates requests, selects companions, views bookings and reads/posts updates.

### Companion
Views assigned requests, accepts them, starts the visit, posts updates and completes the request.

### Admin
Can access platform statistics and is intended to manage verification/moderation in a future expanded version.

## 7. Modules
- Authentication module
- Companion discovery module
- Booking module
- Pricing calculation module
- Booking status module
- Family update/timeline module
- Admin/statistics module

## 8. Architecture
Browser → Express REST API → SQLite database.

JWT is used for authenticated API calls. Passwords are hashed using bcrypt. The Express server also serves the frontend files.

## 9. Database Design
`users` stores account and role data. A companion is linked to one user through `companions.user_id`. A booking connects a customer and companion. Every update belongs to a booking and records the author.

Relationships:
- User 1 → 1 Companion profile (for companion users)
- User 1 → many Bookings (as customer)
- Companion 1 → many Bookings
- Booking 1 → many Updates

## 10. Pricing Logic
The demo calculates an estimated amount from service duration:
- Appointment Visit = 2 hours
- Half Day Support = 4 hours
- Full Day Support = 8 hours

Total = Companion hourly rate × service hours.

This is an academic demonstration; real pricing would require travel, platform fees, taxes, cancellation and payment rules.

## 11. Security
- Password hashing using bcrypt.
- JWT-based session authentication.
- Role checks for booking actions.
- SQL parameter binding through better-sqlite3.
- Output escaping in the browser to reduce basic HTML injection risk.

## 12. Testing Scenarios
1. Register a new customer.
2. Login with the new account.
3. Browse companions.
4. Create a booking.
5. Login as companion and inspect booking.
6. Change status to Accepted/In Progress/Completed.
7. Add a family update.
8. Login as customer and verify the update.
9. Try invalid credentials and verify rejection.
10. Try unauthorized booking access and verify the API rejects it.

## 13. Limitations
This prototype does not process real money, perform medical diagnosis, access hospital records, or provide clinical advice. Identity/KYC and real payment integrations are not implemented in the academic version.

## 14. Future Scope
- Aadhaar/ID-based KYC through a compliant provider.
- Companion background verification.
- UPI/payment gateway integration.
- Push/SMS/WhatsApp notifications through approved providers.
- GPS-based arrival tracking with explicit consent.
- Emergency contact and escalation workflow.
- Document upload and secure sharing.
- Ratings/reviews and dispute management.
- Multi-city expansion.
- AI-assisted appointment-question preparation (without medical diagnosis).

## 15. Viva — Short Answers
**Q: Why did you choose this project?**
A: I identified a practical problem where families often live away from parents and cannot accompany them to important hospital visits. The project organizes local human support through a digital workflow.

**Q: What is unique about it?**
A: It focuses on the gap between remote family members and local, structured non-clinical assistance rather than being another hospital management system.

**Q: Which architecture did you use?**
A: A client-server architecture. The browser is the client, Express.js provides REST APIs and SQLite stores persistent data.

**Q: Why SQLite?**
A: It is lightweight, serverless and ideal for a demonstration project. A production version could use PostgreSQL/MySQL.

**Q: Why JWT?**
A: JWT provides a compact signed token for authenticating API requests without storing a server-side session for every request.

**Q: Why bcrypt?**
A: Passwords should never be stored in plain text. bcrypt stores a salted one-way password hash.

**Q: What is CRUD?**
A: Create, Read, Update and Delete. The project demonstrates these concepts mainly through users, bookings and updates.

**Q: What is the booking lifecycle?**
A: Requested, Accepted, In Progress, Completed or Cancelled.

**Q: Is the companion a doctor?**
A: No. The platform explicitly limits the service to non-clinical support such as companionship, coordination, paperwork and communication.

**Q: How can it become a real business?**
A: Add KYC, background verification, payment gateway, insurance/terms, notifications, dispute handling and city-wise companion operations.

## 16. Suggested Viva Demonstration
1. Open the landing page.
2. Login as customer.
3. Find a companion.
4. Create a sample hospital support booking.
5. Show estimated pricing.
6. Logout and login as companion.
7. Show the booking request.
8. Accept it and mark In Progress.
9. Add an update.
10. Mark Completed.
11. Login back as customer and show the timeline.
12. Explain the database tables and API endpoints.
