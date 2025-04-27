"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  MoreHorizontal,
  FileText,
  Mail,
  Calendar,
  ArrowUpDown,
  CreditCard,
  Banknote,
  Filter,
} from "lucide-react"
import { format } from "date-fns"

interface Transaction {
  id: string
  date: Date
  customer: string
  amount: number
  status: "completed" | "refunded" | "pending"
  paymentMethod: "card" | "cash"
  items: number
}

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Transaction>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: "TRX-001",
      date: new Date(2023, 3, 15, 10, 23),
      customer: "John Smith",
      amount: 24.5,
      status: "completed",
      paymentMethod: "card",
      items: 3,
    },
    {
      id: "TRX-002",
      date: new Date(2023, 3, 15, 11, 45),
      customer: "Sarah Johnson",
      amount: 18.75,
      status: "completed",
      paymentMethod: "cash",
      items: 2,
    },
    {
      id: "TRX-003",
      date: new Date(2023, 3, 15, 13, 12),
      customer: "Michael Brown",
      amount: 32.2,
      status: "completed",
      paymentMethod: "card",
      items: 4,
    },
    {
      id: "TRX-004",
      date: new Date(2023, 3, 15, 14, 30),
      customer: "Emily Davis",
      amount: 12.99,
      status: "refunded",
      paymentMethod: "card",
      items: 1,
    },
    {
      id: "TRX-005",
      date: new Date(2023, 3, 15, 15, 47),
      customer: "David Wilson",
      amount: 45.8,
      status: "completed",
      paymentMethod: "cash",
      items: 5,
    },
    {
      id: "TRX-006",
      date: new Date(2023, 3, 16, 9, 15),
      customer: "Jennifer Taylor",
      amount: 27.35,
      status: "completed",
      paymentMethod: "card",
      items: 3,
    },
    {
      id: "TRX-007",
      date: new Date(2023, 3, 16, 10, 42),
      customer: "Robert Anderson",
      amount: 8.5,
      status: "completed",
      paymentMethod: "cash",
      items: 1,
    },
    {
      id: "TRX-008",
      date: new Date(2023, 3, 16, 12, 18),
      customer: "Lisa Thomas",
      amount: 36.9,
      status: "pending",
      paymentMethod: "card",
      items: 4,
    },
    {
      id: "TRX-009",
      date: new Date(2023, 3, 16, 14, 5),
      customer: "James Jackson",
      amount: 22.15,
      status: "completed",
      paymentMethod: "card",
      items: 2,
    },
    {
      id: "TRX-010",
      date: new Date(2023, 3, 16, 16, 30),
      customer: "Patricia White",
      amount: 54.75,
      status: "completed",
      paymentMethod: "cash",
      items: 6,
    },
  ]

  const filteredTransactions = searchQuery
    ? transactions.filter(
        (t) =>
          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.customer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : transactions

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime()
    } else if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    } else {
      return sortDirection === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
    }
  })

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailsOpen(true)
  }

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "refunded":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  // Calculate totals
  const totalSales = transactions.reduce((sum, t) => (t.status !== "refunded" ? sum + t.amount : sum), 0)
  const totalTransactions = transactions.filter((t) => t.status !== "refunded").length
  const totalRefunds = transactions.filter((t) => t.status === "refunded").reduce((sum, t) => sum + t.amount, 0)
  const averageOrderValue = totalSales / totalTransactions

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{totalTransactions} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">per transaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRefunds.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter((t) => t.status === "refunded").length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-lg font-medium">
                {transactions.filter((t) => t.paymentMethod === "card").length}
                <span className="text-sm text-muted-foreground ml-1">Card</span>
              </div>
              <div className="text-muted-foreground">|</div>
              <div className="text-lg font-medium">
                {transactions.filter((t) => t.paymentMethod === "cash").length}
                <span className="text-sm text-muted-foreground ml-1">Cash</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                  <div className="flex items-center">
                    Date & Time
                    {sortField === "date" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("customer")}>
                  <div className="flex items-center">
                    Customer
                    {sortField === "customer" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("items")}>
                  <div className="flex items-center">
                    Items
                    {sortField === "items" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("amount")}>
                  <div className="flex items-center justify-end">
                    Amount
                    {sortField === "amount" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{format(transaction.date, "MMM dd, yyyy HH:mm")}</TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>{transaction.items}</TableCell>
                  <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(transaction.status)}`} />
                      <span className="capitalize">{transaction.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {transaction.paymentMethod === "card" ? (
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Card</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Banknote className="mr-2 h-4 w-4" />
                        <span>Cash</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(transaction)}>
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Email Receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              {selectedTransaction?.id} -{" "}
              {selectedTransaction && format(selectedTransaction.date, "MMM dd, yyyy HH:mm")}
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p>{selectedTransaction.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="flex items-center">
                    <div className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(selectedTransaction.status)}`} />
                    <span className="capitalize">{selectedTransaction.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p className="capitalize">{selectedTransaction.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p>${selectedTransaction.amount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Items</p>
                <div className="rounded-md border">
                  <div className="p-3 border-b">
                    <div className="flex justify-between">
                      <span>Espresso</span>
                      <span>$3.50</span>
                    </div>
                  </div>
                  <div className="p-3 border-b">
                    <div className="flex justify-between">
                      <span>Croissant</span>
                      <span>$2.50</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${selectedTransaction.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
