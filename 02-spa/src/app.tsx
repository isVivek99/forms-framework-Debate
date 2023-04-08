import * as React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import PostsRoute from "./routes/Posts";
// {loader as todoLoader,  action as todoAction,}

function Navigate({ to }: { to: string }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='posts' element={<PostsRoute />}></Route>
        <Route path='*' element={<Navigate to='/posts' />} />
      </Routes>
    </BrowserRouter>
  );
}
