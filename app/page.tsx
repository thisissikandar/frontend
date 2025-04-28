export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to Delivery App</h1>
      <p className="mt-4">
        Please{" "}
        <a href="/login" className="text-blue-500">
          login
        </a>{" "}
        or{" "}
        <a href="/register" className="text-blue-500">
          register
        </a>{" "}
        to continue.
      </p>
    </div>
  );
}
