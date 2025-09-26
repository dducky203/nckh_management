import { Link } from "react-router-dom";
import { Home, ChevronRight } from "@mui/icons-material";

/**
 * BreadcrumbNav component for showing navigation hierarchy
 * @param {Array} items - Array of objects with name and path properties
 * @returns {JSX.Element}
 */
const BreadcrumbNav = ({ items = [] }) => {
  return (
    <nav className="bg-gray-100 py-3 px-4 mb-4 rounded-md">
      <ol className="flex flex-wrap items-center text-sm text-gray-700">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center text-mainColor hover:underline"
          >
            <Home className="w-4 h-4 mr-1" />
            <span>Trang chủ</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="mx-2 w-3 h-3 text-gray-500" />
            {index === items.length - 1 ? (
              <span className="font-semibold text-gray-900">{item.name}</span>
            ) : (
              <Link to={item.path} className="text-mainColor hover:underline">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNav;
