"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Edit, Trash2, AlertTriangle, ArrowUpDown } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: number
  name: string
  category: string
  price: number
  cost: number
  stock: number
  sku: string
}

export default function Inventory() {
  // const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Product>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    category: "",
    price: 0,
    cost: 0,
    stock: 0,
    sku: "",
  })

  // Mock product data
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/inventory`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data)
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

  const categories = [...new Set(products.map((p) => p.category))]

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    } else {
      return sortDirection === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
    }
  })

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.sku) {
      // toast({
      //   title: "Missing information",
      //   description: "Please fill in all required fields.",
      //   variant: "destructive",
      // })
      return
    }

    const id = Math.max(0, ...products.map((p) => p.id)) + 1
    const product = { ...newProduct, id } as Product

    setProducts([...products, product])
    setNewProduct({
      name: "",
      category: "",
      price: 0,
      cost: 0,
      stock: 0,
      sku: "",
    })
    setIsAddDialogOpen(false)

    // toast({
    //   title: "Product added",
    //   description: `${product.name} has been added to inventory.`,
    // })
  }

  const handleDeleteProduct = (id: number) => {
    const product = products.find((p) => p.id === id)
    if (!product) return

    setProducts(products.filter((p) => p.id !== id))

    // toast({
    //   title: "Product deleted",
    //   description: `${product.name} has been removed from inventory.`,
    // })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Inventory Management</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Fill in the details to add a new product to your inventory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">+ Add New Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sku" className="text-right">
                    SKU
                  </Label>
                  <Input
                    id="sku"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cost" className="text-right">
                    Cost ($)
                  </Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newProduct.cost || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, cost: Number.parseFloat(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">across {categories.length} categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${products.reduce((sum, p) => sum + p.cost * p.stock, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">based on cost price</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.filter((p) => p.stock < 10).length}</div>
            <p className="text-xs text-muted-foreground">items with less than 10 in stock</p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(products.reduce((sum, p) => sum + ((p.price - p.cost) / p.price) * 100, 0) / products.length)}
              %
            </div>
            <p className="text-xs text-muted-foreground">across all products</p>
          </CardContent>
        </Card> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center">
                    Product Name
                    {sortField === "name" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                  <div className="flex items-center">
                    Category
                    {sortField === "category" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("price")}>
                  <div className="flex items-center justify-end">
                    Price
                    {sortField === "price" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("stock")}>
                  <div className="flex items-center justify-end">
                    Stock
                    {sortField === "stock" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      {product.name}
                      <span className="text-xs text-muted-foreground">{product.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      ${product.price.toFixed(2)}
                      <span className="text-xs text-muted-foreground">Cost: ${product.cost.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      {product.stock < 10 && <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />}
                      {product.stock}
                    </div>
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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
    </div>
  )
}
