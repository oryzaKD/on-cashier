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
import { Search, Plus, MoreHorizontal, Edit, Trash2, AlertTriangle, ArrowUpDown, User } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  category: string
  price: number | null
  cost: number | null
  stock: number | null
}

type ProductErrors = Partial<Record<keyof Product, string>>;

export default function Inventory() {
  // const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Product>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    name: "",
    category: "",
    price: null,
    cost: null,
    stock: null,
  })

  // Mock product data
  const [products, setProducts] = useState<Product[]>([])

  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/inventory`);
      if (res.ok) {
        const data = await res.json();
        // Convert string numbers to actual numbers
        const formattedData = data.map((product: any) => ({
          ...product,
          price: Number(product.price),
          cost: Number(product.cost),
          stock: Number(product.stock)
        }));
        setProducts(formattedData);
        console.log('Products:', formattedData);
      } else {
        console.error('Failed to fetch products:', res.status);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategoriesList(data.map((category: any) => category.name))
        console.log('Categories:', data);
      } else {
        console.error('Failed to fetch categories:', res.status);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = searchQuery
    ? products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const selectedProduct = { name: newProduct.name, category: newProduct.category, price: newProduct.price, cost: newProduct.cost, stock: newProduct.stock };

      try {
        const response = await fetch("http://localhost:3001/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedProduct),
        });

        if (response.ok) {
          // Only fetch new data if the POST request was successful
          await fetchProducts();
          setIsAddDialogOpen(false);
          // Reset the form
          setNewProduct({
            id: "",
            name: "",
            category: "",
            price: null,
            cost: null,
            stock: null,
          });
        } else {
          console.error('Failed to add product:', response.status);
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }

    // toast({
    //   title: "Product added",
    //   description: `${product.name} has been added to inventory.`,
    // })
  }

  const handleDeleteProduct = (id: number) => {
    // const product = products.find((p) => p.id === id)
    // if (!product) return

    // setProducts(products.filter((p) => p.id !== id))

    // toast({
    //   title: "Product deleted",
    //   description: `${product.name} has been removed from inventory.`,
    // })
  }

  const [errors, setErrors] = useState<ProductErrors>({})

  const validateForm = () => {
    const newErrors: ProductErrors = {}

    if (!newProduct.name?.trim()) {
      newErrors.name = "Name is required"
    }

    if (!newProduct.category) {
      newErrors.category = "Category is required"
    }

    if (newProduct.price === undefined || newProduct.price === null || newProduct.price === 0) {
      newErrors.price = "Price is required"
    }

    if (newProduct.cost === undefined || newProduct.cost === null || newProduct.cost === 0) {
      newErrors.cost = "Cost is required"
    }

    if (newProduct.stock === undefined || newProduct.stock === null || newProduct.stock === 0) {
      newErrors.stock = "Stock is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChangeInput = (
    eOrValue: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string
  ) => {
    // If it's a string, it's from the Select dropdown
    if (typeof eOrValue === "string") {
      console.log("String");
      if (eOrValue === "new") {
        console.log("New");
        const newCategory = prompt("Enter new category name:");
        if (newCategory) {

          const newCategoryData = { name: newCategory };

          fetch("http://localhost:3001/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCategoryData),
          });
          // Add your logic to add the new category to your list
          // For example:
          // setCategoriesList((prev) => [...prev, newCategory]);
          // setNewProduct((prev) => ({
          //   ...prev,
          //   category: newCategory,
          // }));
          // setSelected(newCategory);
          // setErrors((prev) => ({ ...prev, category: undefined }));
          // console.log("New Category:", newCategory);
          fetchCategories();
        }
      } else {
        setNewProduct((prev) => ({
          ...prev,
          category: eOrValue,
        }));
        setSelected(eOrValue);
        setErrors((prev) => ({ ...prev, category: undefined }));
      }
    } else {
      console.log("Input");
      // It's an input event
      const { name, value } = eOrValue.target;
      setNewProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error when field is edited
      if (errors[name as keyof Product]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    }
  };

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
              <form onSubmit={handleAddProduct}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleChangeInput}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select value={selected} onValueChange={handleChangeInput}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesList.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value="new">+ Add New Category</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={newProduct.price ?? ""}
                      onChange={handleChangeInput}
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      Cost ($)
                    </Label>
                    <Input
                      id="cost"
                      name="cost"
                      type="number"
                      value={newProduct.cost || ""}
                      onChange={handleChangeInput}
                      className={errors.cost ? "border-red-500" : ""}
                    />
                    {errors.cost && <p className="text-xs text-red-500 mt-1">{errors.cost}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">
                      Stock
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={newProduct.stock || ""}
                      onChange={handleChangeInput}
                      className={errors.stock ? "border-red-500" : ""}
                    />
                    {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
                    handleAddProduct(e);
                  }}
                >
                  <User className="h-4 w-4" />
                  Add Product
                </Button>
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
            <p className="text-xs text-muted-foreground">across {categoriesList.length} categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${products.reduce((sum, p) => sum + (p.cost || 0) * (p.stock || 0), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">based on cost price</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.filter((p) => p.stock && p.stock < 10).length}</div>
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
                  <TableCell>
                    <Badge variant="outline">{product.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      ${product.price?.toFixed(2)}
                      <span className="text-xs text-muted-foreground">Cost: ${product.cost?.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      {product.stock && product.stock < 10 && <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />}
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
                        // onClick={() => handleDeleteProduct(product.id)}
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
