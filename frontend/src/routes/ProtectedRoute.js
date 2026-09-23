import { useSelector } from "react-redux"

const { Navigate } = require("react-router-dom")


const ProtectedRoute = ({children}) => {
    const { loading, isAuthenticated} = useSelector((state) => state.user);
    if(loading === false){
        if(!isAuthenticated){
            return <Navigate to = "/login" replace/>
        }
        return children
    }
}

export default ProtectedRoute;

/*
what problem this file solves? 
Some pages — like /profile — should only be visible to logged-in users. If a random visitor (not logged in) types /profile directly into the URL bar, we need to block them and send them to the login page instead.
-------------------------------------------------------------

{children} : ProtectedRoute is being used like a wrapper around <ProfilePage/>. In React, anything placed between a component's opening and closing tags (<ProtectedRoute> ... </ProtectedRoute>) is automatically passed to that component as a special prop called children.
------------------------------------------------------------

<Navigate to="/login" replace /> is a React Router component that immediately redirects the browser to a different route.
------------------------------------------------------------

Flow:

1. User types /profile in the URL bar (or clicks a link to it)
        ↓
2. App.js's routing matches /profile → renders <ProtectedRoute><ProfilePage/></ProtectedRoute>
        ↓
3. ProtectedRoute runs, reads { loading, isAuthenticated } from Redux
        ↓
4. If loading is still true (loadUser() check in progress) → renders nothing yet, waits
        ↓
5. loadUser() finishes → Redux updates loading:false, isAuthenticated:false (no valid cookie)
        ↓
6. ProtectedRoute re-runs (because useSelector causes re-render when state changes)
        ↓
7. loading is now false, isAuthenticated is false → <Navigate to="/login" replace/> fires
        ↓
8. Browser redirects to /login, ProfilePage never actually renders
*/