# Under Atef: Attendance Tracker

Attendance tracking for STEM 6th of October. Teachers take attendance per class, per day, per session (1 to 5).
Principal and admin read reports. Admin manages users, classes and students.

## Setup

```bash
npm install                      # root (concurrently)
npm install --prefix backend
npm install --prefix frontend

cp backend/.env.example backend/.env     # fill in MONGO_URI, JWT_SECRET, admin email/password
cp frontend/.env.example frontend/.env   # only needed if the API isn't on localhost:5000

npm run seed --prefix backend            # first admin + classes 10A..12F
npm run seed --prefix backend -- --demo  # same, plus 24 demo students in 10A

npm run dev                              # frontend :5173, backend :5000
```

## Roles

| Role      | Can do                                                        |
|-----------|---------------------------------------------------------------|
| teacher   | Take attendance, browse students                              |
| principal | Dashboard, reports, browse students                           |
| admin     | Everything, plus users, students and classes                  |

## API

All routes except `/auth/login` and `/health` need `Authorization: Bearer <token>`.

| Route                              | Who               | Purpose                                      |
|------------------------------------|-------------------|----------------------------------------------|
| `POST /auth/login`, `GET /auth/me` | any               | Sign in (rate limited), current user         |
| `/users`                           | admin             | List, create, update, deactivate users       |
| `GET /classes`                     | any               | Active classes                               |
| `POST /classes`, `DELETE /classes/:id` | admin         | Add / deactivate a class                     |
| `GET /students?class=`             | any               | Roster                                       |
| `POST /students`, `/students/bulk`, `PATCH`, `DELETE` | admin | Manage students                       |
| `POST /reports`                    | teacher, admin    | Submit or overwrite one class/date/session   |
| `GET /reports/class/:id?date&session` | any            | Load one saved report                        |
| `GET /reports?date=`               | principal, admin  | All reports for a day                        |
| `GET /reports/dates`               | principal, admin  | Dates that have reports                      |
| `GET /reports/student/:id`         | any               | One student's history                        |

Dates are `YYYY-MM-DD` (Cairo time). Statuses are `present`, `absent`, `excused`.

## Deploying

- Backend: `npm run build --prefix backend`, then `npm start --prefix backend`. Set the env vars from `.env.example`.
  If it runs behind a proxy (Render, Railway, Nginx), add `app.set("trust proxy", 1)` in `backend/index.ts`
  so the login rate limiter sees real client IPs.
- Frontend: set `VITE_API_URL` to the deployed API URL, run `npm run build --prefix frontend`, serve `frontend/dist`.
  Configure the host to fall back to `index.html` for unknown paths (single page app).
- Set `CLIENT_URL` on the backend to the deployed frontend origin, or CORS will block requests.
