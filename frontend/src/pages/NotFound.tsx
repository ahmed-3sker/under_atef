import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="py-16 text-center">
        <p className="text-6xl font-bold text-[#1a1a4e]">404</p>
        <p className="mt-4 text-slate-600">That page doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block font-semibold text-blue-600 hover:text-blue-800">
          Back to home
        </Link>
      </div>
    </Layout>
  );
}
