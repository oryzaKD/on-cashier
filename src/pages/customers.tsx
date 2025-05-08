import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  ArrowUpDown,
  User,
  CreditCard,
  Clock,
  Star,
  StarHalf,
} from "lucide-react"
import { format } from "date-fns"
// import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X } from "node_modules/framer-motion/dist/types.d-DDSxwf0n"
import { number } from "framer-motion"

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  customerType: string
  notes: string
  joinDate: Date
  totalSpent: number
  visits: number
  lastVisit: Date
  loyaltyPoints: number
  favoriteItems: string[]
}

export default function Customers() {
  // const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Customer>("totalSpent")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: Number("123"),
    name: "",
    email: "",
    phone: "",
    address: "",
    customerType: "regular",
    notes: "",
    joinDate: new Date,
    totalSpent: Number("123"),
    visits: Number("123"),
    lastVisit: new Date,
    loyaltyPoints: Number("123"),
    favoriteItems: [""],
  })
  const [errors, setErrors] = useState<Partial<Customer>>({})

  const resetForm = () => {
    setNewCustomer({
      id: Number("123"),
      name: "",
      email: "",
      phone: "",
      address: "",
      customerType: "regular",
      notes: "",
      joinDate: new Date,
      totalSpent: Number("123"),
      visits: Number("123"),
      lastVisit: new Date,
      loyaltyPoints: Number("123"),
      favoriteItems: [""],
    })
    setErrors({})
  }

  // Mock customer data
  const [customers, setCustomers] = useState<Customer[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when field is edited
    if (errors[name as keyof Customer]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/customers`);
        if (res.ok) {
          const data = await res.json();
          setCustomers(data)
          console.log('Customers:', data);
        } else {
          console.error('Failed to fetch customers:', res.status);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = searchQuery
    ? customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery),
    )
    : customers

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortField === "joinDate" || sortField === "lastVisit") {
      const aDate = new Date(Array.isArray(aValue) ? aValue[0] : aValue);
      const bDate = new Date(Array.isArray(bValue) ? bValue[0] : bValue);

      return sortDirection === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    } else if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else {
      return sortDirection === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
    }
  });


  const handleSort = (field: keyof Customer) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const validateForm = () => {
    const newErrors: Partial<Customer> = {}

    if (!newCustomer.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!newCustomer.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(newCustomer.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!newCustomer.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!newCustomer.address.trim()) {
      newErrors.address = "Address is required"
    }

    // if (!newCustomer.notes.trim()) {
    //   newErrors.notes = "Notes are required"
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // toast({
      //   title: "Missing information",
      //   description: "Please fill in all required fields.",
      //   variant: "destructive",
      // })
      // const id = Math.max(0, ...customers.map((c) => c.id)) + 1
      const customer: Customer = {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address,
        customerType: newCustomer.customerType,
        notes: newCustomer.notes,
        joinDate: new Date(),
        totalSpent: 0,
        visits: 0,
        lastVisit: new Date(),
        loyaltyPoints: 0,
        favoriteItems: [],
      }

      setCustomers([...customers, customer])
      // setNewCustomer({
      //   name: "",
      //   email: "",
      //   phone: "",
      //   address: "",
      //   customerType: "Regular",
      //   notes: ""
      // })
      const { name, email, phone, address, customerType, notes } = customer;

      const selectedCustomer = { name, email, phone, address, customerType, notes };

      console.log(selectedCustomer);
      console.log(JSON.stringify(customer))
      fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCustomer),
      })
      // .then((res) => res.json())
      // .then((data) => {
      //   setCustomers([...customers, data]);
      // });
      setIsAddDialogOpen(false)

      // toast({
      //   title: "Customer added",
      //   description: `${customer.name} has been added to your customer database.`,
      // })
    }
  }

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailsOpen(true)
  }

  // Calculate customer metrics
  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const averageSpentPerCustomer = totalRevenue / totalCustomers
  const loyalCustomers = customers.filter((c) => c.visits > 20).length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (!open) {
              resetForm()
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background/90 backdrop-blur-sm border-none">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                {/* <DialogDescription>Fill in the details to add a new customer to your database.</DialogDescription> */}
              </DialogHeader>
              <form onSubmit={handleAddCustomer}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="name"
                        name="name"
                        value={newCustomer.name}
                        onChange={handleChange}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <div className="col-span-3">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newCustomer.email}
                      // onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      onChange={handleChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <div className="col-span-3">
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      // onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      onChange={handleChange}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <div className="col-span-3">
                    <Input
                      id="address"
                      value={newCustomer.address}
                      // onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      onChange={handleChange}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <div className="col-span-3">
                    <Textarea
                      id="notes"
                      name="notes"
                      value={newCustomer.notes}
                      // onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                      onChange={handleChange}
                      placeholder="Additional information about the customer"
                      className={errors.notes ? "border-red-500" : ""}
                      rows={3}
                    />
                    {errors.notes && <p className="text-xs text-red-500">{errors.notes}</p>}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddDialogOpen(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!validateForm()) {
                        return;
                      }
                      handleAddCustomer(e);
                    }}
                  >
                    <User className="h-4 w-4" />
                    Add Customer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">in database</p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">from all customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Spent per Customer</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageSpentPerCustomer.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">lifetime value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyal Customers</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loyalCustomers}</div>
            <p className="text-xs text-muted-foreground">with 20+ visits</p>
          </CardContent>
        </Card> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center">
                    Customer
                    {sortField === "name" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("email")}>
                  <div className="flex items-center">
                    Email
                    {sortField === "email" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("customerType")}>
                  <div className="flex items-center">
                    Customer Type
                    {sortField === "customerType" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                {/* <TableHead className="cursor-pointer" onClick={() => handleSort("joinDate")}>
                  <div className="flex items-center">
                    Join Date
                    {sortField === "joinDate" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("visits")}>
                  <div className="flex items-center">
                    Visits
                    {sortField === "visits" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("totalSpent")}>
                  <div className="flex items-center justify-end">
                    Total Spent
                    {sortField === "totalSpent" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback>
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell>{format(customer.joinDate, "MMM dd, yyyy")}</TableCell> */}
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.customerType}</TableCell>
                  {/* <TableCell className="text-right">${customer.totalSpent.toFixed(2)}</TableCell> */}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Star className="mr-2 h-4 w-4" />
                          Add Loyalty Points
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
        <DialogContent className="sm:max-w-[600px] bg-background/90 backdrop-blur-sm border-none">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
                <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/placeholder.svg?height=64&width=64`} />
                    <AvatarFallback className="text-lg">
                      {selectedCustomer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="mr-1 h-4 w-4" />
                        {selectedCustomer.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-1 h-4 w-4" />
                        {selectedCustomer.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Customer Since</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(selectedCustomer.joinDate, "MMMM dd, yyyy")}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Last Visit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(selectedCustomer.lastVisit, "MMMM dd, yyyy")}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Visits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedCustomer.visits}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Loyalty Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedCustomer.loyaltyPoints}</div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Favorite Items</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.favoriteItems.map((item, i) => (
                      <Badge key={i} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                    {selectedCustomer.favoriteItems.length === 0 && (
                      <span className="text-sm text-muted-foreground">No favorite items yet</span>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="purchases" className="space-y-4 pt-4">
                <div className="rounded-md border">
                  <div className="p-3 border-b bg-muted/50">
                    <div className="grid grid-cols-4 font-medium">
                      <span>Date</span>
                      <span>Items</span>
                      <span>Payment</span>
                      <span className="text-right">Amount</span>
                    </div>
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-3 border-b last:border-0">
                      <div className="grid grid-cols-4">
                        <span>{format(new Date(2023, 3 - i, 15 - i * 3), "MMM dd, yyyy")}</span>
                        <span>{Math.floor(Math.random() * 3) + 1}</span>
                        <span>{Math.random() > 0.5 ? "Card" : "Cash"}</span>
                        <span className="text-right">${(Math.random() * 30 + 5).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="loyalty" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Loyalty Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(Math.floor(selectedCustomer.loyaltyPoints / 50))].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                        ))}
                        {selectedCustomer.loyaltyPoints % 50 >= 25 && (
                          <StarHalf className="h-5 w-5 fill-primary text-primary" />
                        )}
                        {[...Array(5 - Math.ceil(selectedCustomer.loyaltyPoints / 50))].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-muted-foreground" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{selectedCustomer.loyaltyPoints} points</span>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>Progress to next reward</span>
                        <span>{selectedCustomer.loyaltyPoints % 50}/50 points</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(selectedCustomer.loyaltyPoints % 50) * 2}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-md border">
                      <div className="p-3 border-b">
                        <div className="font-medium">Available Rewards</div>
                      </div>
                      {selectedCustomer.loyaltyPoints >= 50 ? (
                        <div className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Free Coffee</div>
                              <div className="text-sm text-muted-foreground">Redeem for 50 points</div>
                            </div>
                            <Button size="sm">Redeem</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 text-sm text-muted-foreground">
                          No rewards available yet. Earn more points with purchases.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
