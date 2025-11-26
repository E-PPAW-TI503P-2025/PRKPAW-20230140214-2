import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "mahasiswa") {
      navigate("/student");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
}

export default DashboardPage;
