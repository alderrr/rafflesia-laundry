import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    path: "/",
  },
  {
    label: "Orders",
    path: "/orders",
  },
  {
    label: "New Order",
    path: "/orders/new",
  },
  {
    label: "Customers",
    path: "/customers",
  },
  {
    label: "Services",
    path: "/services",
  },
];

function Sidebar() {
  return (
    <aside className="min-h-screen w-64 border-r border-slate-200 bg-white p-5">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900">CleanFlow</h1>
        <p className="mt-1 text-sm text-slate-500">Laundry Management</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
