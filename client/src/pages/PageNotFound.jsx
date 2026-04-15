import { useEffect } from "react";
import { NavLink } from "react-router";

export function PageNotFound() {
  useEffect(()=>{
    document.title = "SlideQuiz | Not Found"
  },[]);

  return (
    <div className="flex justify-center text-center mt-20 align-middle">
      <div>
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-4xl my-8 italic">Page not found!</p>
        <p className="text-2xl my-8 italic">Click the following link to go back.</p>

        <NavLink className="btn btn-outline btn-primary w-[200px]" to="/">Homepage</NavLink>
      </div>
    </div>
  );
}
