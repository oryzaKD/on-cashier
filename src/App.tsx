import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "@/components/layout"
import Dashboard from "@/pages/dashboard"
import PointOfSale from "@/pages/point-of-sale"
import Inventory from "@/pages/inventory"
import Transactions from "@/pages/transactions"
import Customers from "@/pages/customers"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="cashier-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="pos" element={<PointOfSale />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="customers" element={<Customers />} />
          </Route>
        </Routes>
      </Router>
      {/* <Toaster /> */}
    </ThemeProvider>
  )
}

export default App
