import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ListingDetails from "./pages/ListingDetails";
import ListingForm from "./pages/ListingForm";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/listings/new" element={<ProtectedRoute><ListingForm /></ProtectedRoute>} />
          <Route path="/listings/:id/edit" element={<ProtectedRoute><ListingForm /></ProtectedRoute>} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/wishlist"element={  <ProtectedRoute> <Wishlist /> </ProtectedRoute>
  }
/>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}