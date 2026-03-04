import { useAuth } from "../context/AuthContext";
export function HomePage() {
  let content;
  const { user } = useAuth();

  if (user) {
    content = <h1>Welcome {user.name}</h1>;
  }
  return (
    <div className="flex flex-1 flex-col">
      Home Page
      {content}
    </div>
  );
}
