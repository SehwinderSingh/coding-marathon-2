# Self Assessment - Sehwinder Singh Mundra

Coding Marathon 2 

In this marathon Me and Yun were responsible for the backend: the job CRUD API, user signup and login with JWT, protecting the job routes and deploying the APIs to Render. I also set up the GitHub repository, merged the branches, and helped connect the frontend to the API.I used an LLM to review my code and my debugging process and to help me reflect on what went well and what I should improve. The examples below are real problems I ran into.

---

## Example: Router mounted at the wrong path

Every request to `/api/jobs` returned **404 "unknown endpoint"**, even though my controllers and router were correct:

I had mounted the job router at `/api/users`. On the way there I also had a server crash because `userRouter` was used before it was imported, and nodemon was still starting an old `index.js` instead of `app.js` after I changed the scripts in `package.json`.

```javascript
// app.js – fixed
const jobRouter = require("./routes/jobRouter");
const userRouter = require("./routes/userRouter");

app.use(express.json());

// Routes
app.use("/api/jobs", jobRouter);
app.use("/api/users", userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);
```

**Key improvements:**
- Each router is mounted at the correct path.
- `express.json()` runs before the routers, and `unknownEndpoint` / `errorHandler` are always last.

**What I learned:**
1. Express runs middleware and routers in the order they are registered.
2. nodemon only restarts the old command when files change. After editing `package.json` scripts I have to stop it (Ctrl + C) and run `npm run dev` again, and check which file it says it is starting.

---

## Example: Small typos with big effects

Two of my bugs came from a single wrong variable name:

```javascript
if (deletedJob) {
  res.status(204).send();
} else {
  res.status(404).json({ message: "Job not found" });
}

if (job) {
  res.status(200).json(job);
} else {
  res.status(404).json({ message: "Job not found" });
}
```

**Key improvements:**
- Correct status codes: `204` for a successful delete (no body), `404` when the job does not exist.
- I now test the "not found" cases in Postman too, not only the happy path.

**What I learned:** JavaScript is case-sensitive, and testing the error cases (deleted job, invalid id) finds bugs that the normal flow does not show.

---

## Example: The JWT token contained the whole user

Signup and login worked in Postman, but the token was very long, and the frontend only ever showed "Signup failed":

**Key improvements:**
- **Security:** the token only contains the user id. The password hash is no longer exposed inside the token.
- **Consistency:** all auth errors use the key `error`, the same as `requireAuth`, so the frontend can show the real reason ("Invalid password", "User already exists").
- The login response only returns `{ email, token }`, not the full user object.

**What I learned:** Even when a feature seems to work, I should check exactly what data is sent. The LLM review pointed out that signing or returning the full user document is a security problem, which I would not have noticed myself.

---

## Example: Protecting the write routes

I protected create, update and delete, but kept reading jobs public:


**Key improvement:** A clear split between public and protected routes, which I verified in Postman: `401` without a token, and `201/200/204` with a Bearer token.

**What I learned:** Read the error message carefully. "Cannot find module" pointed straight to the wrong file name.


---

## Git and collaboration

I set up the repository and merged our branches (`backend-jobs`, `backend-auth`, `frontend-tasks`) into `main` with pull requests. Git caused me more trouble than the code:

- **Repository setup:** my first push only contained the frontend folder, because I ran `git init` inside it. After fixing that, `frontend-simplified` was pushed as a submodule because it still had its own `.git` folder. I fixed it by removing the nested `.git`, running `git rm --cached frontend-simplified`, and pushing again from the project root.
- **Switching branches:** `git checkout main` failed because of uncommitted changes. I learned to use `git stash` / `git stash pop`, or to commit first.
- **Merge conflicts:** in `SignupPage.jsx`, "Accept both changes" was used for every conflict in the GitHub web editor. It produced a broken file with duplicated state, nested functions and two forms. I fixed it by writing one combined version by hand and pushing it before merging.
- **Branch mix-ups:** I sometimes ran `git pull` on the wrong branch and did not see my teammates' work. Now I check with `git branch` and `git status` first.

**What I learned:**
1. Always pull before starting and before pushing.
2. Run git commands from the project root, so both frontend and backend changes are included.
3. "Accept both changes" is only correct when both sides are separate additions. When both sides changed the same code, I have to combine them manually.

---

## Deployment

I deployed two services to Render, using MongoDB Atlas as the database:

- **API v1 (no authentication):** branch `backend-jobs`, database `CM2-V1`
- **API v2 (with authentication):** branch `main`, database `CM2-V2`, with `SECRET` as an environment variable

---

## Summary

**What went well**
- The backend follows the structure from class: models, controllers, routes and middleware are separated.
- Full CRUD for jobs, signup and login with bcrypt-hashed passwords and JWT, and protected write routes.
- Consistent status codes (201, 204, 400, 401, 404, 500), tested in Postman.
- The frontend works with my API, and both APIs are deployed to Render.
- I used branches and pull requests, and helped my teammates with git problems on their laptops.

**What I could improve**
- Test edge cases earlier (invalid ids, deleted jobs, weak passwords, missing token) instead of only the normal flow.
- Log the real error (`console.log(error)`) in every `catch` from the start, so bugs are faster to find.
- Agree with the frontend team on API conventions (field names like `phone_number`, the error key `error`) before coding.
- Pull more often and tell my teammates before editing shared files, to avoid merge conflicts.
- Read error messages more carefully before changing code. Most of my bugs were explained in the first line of the error.
- Next step for the project: save the creator's `user_id` on each job, so users can only edit or delete their own jobs.
