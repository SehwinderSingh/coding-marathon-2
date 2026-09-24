1. Conditional Navigation (Navbar.jsx)
What Works: Dynamic UI correctly shows/hides Add Job, Logout, Login, and Signup based on AuthContext. Logout cleanly updates state and localStorage.

Improvement Area: Extracted logout logic should live in a custom useLogout hook to keep UI components cleaner.

2. Protected Routing & API Requests (App.jsx)
What Works: Uses <Navigate to="/login"/> to block unauthorized access to protected routes and attaches Authorization: Bearer ${user?.token} to API requests.

Improvement Area:

Inline ternary checks (user ? <Page/> : <Navigate/>) cause code duplication. A reusable <ProtectedRoute> wrapper would be cleaner.

API functions inside App.jsx lack proper error checking (res.ok) and should be moved to a separate services/ file.

3. Authentication Flow (LoginPage.jsx)
What Works: Submits form data, saves user credentials to localStorage, dispatches LOGIN action, and redirects to home.

Improvement Area: API endpoints are hardcoded (/api/users/login)—using environment variables (VITE_API_URL) would improve flexibility across environments.
