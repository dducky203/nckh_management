import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "../common/BackToTop";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <BackToTop threshold={400} position="right" />
      <Footer />
    </div>
  );
};

export default Layout;
