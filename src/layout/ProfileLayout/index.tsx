// layouts/ProfileLayout.tsx
import { Outlet, useLocation, Link } from "react-router-dom";
import "./profileLayout.css";
import docLinks from "../../database/docLinks.json";

const ProfileLayout = () => {
  const { pathname } = useLocation();

  const menu = [
    {
      title: "Profile",
      link: "/profile",
    },
    {
      title: "Billing",
      link: "/billing",
    },
    {
      title: "Security & Privacy",
      link: "/security",
    },
  ];

  return (
    <div className="profile-layout">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <p className="subtitle-one">Account</p>

        <nav style={{ display: "grid", gap: "1.5rem", marginTop: "2rem" }}>
          {menu.map((item, index) => {
            return (
              <Link
                key={index}
                className={
                  pathname === item.link ? "link-active" : "link-secondary"
                }
                style={{
                  textDecoration: "none",
                }}
                to={{ pathname: item.link }}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="profile-content">
        <Outlet />
      </main>

      <div className="policy-links-container">
        <Link
          to={docLinks?.terms}
          target="_blank"
          style={{ textDecoration: "none" }}
          className="primary"
        >
          Terms of Service
        </Link>
        <Link
          to={docLinks?.privacy}
          target="_blank"
          style={{ textDecoration: "none" }}
          className="primary"
        >
          Privacy Policy
        </Link>
        <Link
          to={docLinks?.dpa}
          target="_blank"
          style={{ textDecoration: "none" }}
          className="primary"
        >
          DPA
        </Link>
      </div>
    </div>
  );
};

export default ProfileLayout;
