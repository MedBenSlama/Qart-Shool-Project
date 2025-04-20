import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
