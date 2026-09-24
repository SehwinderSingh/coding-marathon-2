# Self-Assessment – Sehwinder Singh Mundra

**Coding Marathon 2 – Role: Backend (Express / Mongoose / JWT), repository setup and deployment**

In this marathon I was responsible for the backend: the job CRUD API, user signup and login with JWT, protecting the job routes, and deploying the APIs to Render. I also set up the GitHub repository, merged the branches, and helped connect the frontend to the API. I used an LLM to review my code and my debugging process, and to help me reflect on what went well and what I should improve. The examples below are real problems I ran into.

---

## Example 1: Sorting the query instead of the array

My first version of `getAllJobs` returned **500 "Failed to get jobs"**:

```javascript
// jobControllers.js – original getAllJobs
const jobs = limit
  ? (await Job.find({})).sort({ createdAt: -1 }).limit(limit)
  : (await Job.find({})).sort({ createdAt: -1 });
```

The extra parentheses awaited the query first, so `.sort()` was called on a plain JavaScript array with an object argument, which throws an error. I fixed it by keeping `.sort()` and `.limit()` on the Mongoose query:

```javascript
// jobControllers.js – fixed getAllJobs (also handles ?_limit=)
const getAllJobs = async (req, res) => {
  try {
    const limit = parseInt(req.query._limit);
    const jobs = limit
      ? await Job.find({}).sort({ createdAt: -1 }).limit(limit)
      : await Job.find({}).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to get jobs" });
  }
};
```

**Key improvements:**
- Query methods are chained before `await`, so MongoDB does the sorting and limiting.
- Pagination with `_limit` works for the home page (`/api/jobs?_limit=3`).

**What I learned:** If I had added `console.log(error)` in the `catch` block from the start, I would have seen the real error immediately instead of only the generic 500 message.

---

## Example 2: Router mounted at the wrong path

Every request to `/api/jobs` returned **404 "unknown endpoint"**, even though my controllers and router were correct:

```javascript
// app.js – problematic
app.use("/api/users", jobRouter);
app.use(unknownEndpoint);
```

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

## Example 3: Small typos with big effects

Two of my bugs came from a single wrong variable name:

```javascript
// deleteJob – original
const deletedJob = await Job.findByIdAndDelete(jobId);
if (deletedjob) { ... }            // ReferenceError: deletedjob is not defined

// getJobById – original
const job = await Job.findById(jobId);
if (Job) { ... }                   // always true (the model), returns 200 with null
```

The first one crashed with a 500 **after** the job had already been deleted. The second one returned `200` with `null` for jobs that did not exist, instead of `404`.

```javascript
// fixed
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

## Example 4: The JWT token contained the whole user

Signup and login worked in Postman, but the token was very long, and the frontend only ever showed "Signup failed":

```javascript
// userControllers.js – original
const token = generateToken(user);                    // whole user document, including hashed password
res.status(400).json({ message: error.message });     // frontend expected `error`
// and earlier: { expiresIN: "3d" }                   // invalid option name
```

```javascript
// userControllers.js – fixed
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const token = generateToken(user._id);
res.status(201).json({ email, token });
// ...
res.status(400).json({ error: error.message });
```

**Key improvements:**
- **Security:** the token only contains the user id. The password hash is no longer exposed inside the token.
- **Consistency:** all auth errors use the key `error`, the same as `requireAuth`, so the frontend can show the real reason ("Invalid password", "User already exists").
- The login response only returns `{ email, token }`, not the full user object.

**What I learned:** Even when a feature seems to work, I should check exactly what data is sent. The LLM review pointed out that signing or returning the full user document is a security problem, which I would not have noticed myself.

---

## Example 5: Protecting the write routes

I protected create, update and delete, but kept reading jobs public:

```javascript
// routes/jobRouter.js
router.get("/", getAllJobs);
router.get("/:jobId", getJobById);

router.use(requireAuth); // everything below requires a valid token
router.post("/", createJob);
router.put("/:jobId", updateJob);
router.delete("/:jobId", deleteJob);
```

At first the server crashed because I imported a middleware file that did not exist (`../middleware/authMiddleware`) instead of the starter's `../middleware/requireAuth`.

**Key improvement:** A clear split between public and protected routes, which I verified in Postman: `401` without a token, and `201/200/204` with a Bearer token.

**What I learned:** Read the error message carefully. "Cannot find module" pointed straight to the wrong file name.

---

## Example 6: Connecting the frontend to my API

After switching from the mock server to my API, the frontend got 404s. The starter's Vite proxy was made for the mock server:

```javascript
// vite.config.js – original (for the mock server)
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
},
```

```javascript
// vite.config.js – fixed
proxy: {
  "/api": {
    target: "http://localhost:4000",
    changeOrigin: true,
  },
},
```

The `rewrite` removed `/api` from the URL, which the mock server needed but my Express routes (`/api/jobs`) did not. Later I also fixed a refresh problem in `AuthContext`: protected pages redirected to `/login` after a refresh, because the user was only loaded from localStorage after the first render.

```jsx
// AuthContext.jsx – fixed
const [state, dispatch] = useReducer(authReducer, {
  user: JSON.parse(localStorage.getItem("user")),
});
```

**What I learned:** A 500 with an empty body and `ECONNREFUSED` in the Vite terminal means the backend is not running, not that the code is wrong. Since then I keep three terminals: backend, frontend and git.

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

Settings: root directory `backend/api-server-starter`, build `npm install`, start `npm start`, free instance. I had to fix a few defaults (`yarn` build command, paid instance type, empty root directory) before deploying. I also learned to keep secrets only in `.env` (ignored by git) and in Render's environment variables.

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
