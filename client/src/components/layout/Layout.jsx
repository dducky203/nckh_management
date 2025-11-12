import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "../common/BackToTop";
import ChatBotWidget from "../common/ChatBotWidget";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <BackToTop threshold={400} position="right" />
      <ChatBotWidget />
      <Footer />
    </div>
  );
};

export default Layout;
