import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, getallProducts } from "@/services/products";
import Loading from "@/components/Loading";
import { Popup } from "@/components/Popup";
import { usePopup } from "@/hooks/usePopup";
import { SellerProductEdit } from "./SellerProductEdit";
import { useDispatch } from "react-redux";
import { getProductdata, setProductId } from "@/store/products/productsSlice";
import { useToast } from "@/hooks/use-toast";
import ProductDetailModal from "./ProductDetail";

export default function SellerProducts() {
  const [showDetail, setShowDetail] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [sorting, setSorting] = React.useState([]);
  const { toast } = useToast();
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { setOpen } = usePopup();
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getallProducts(),
  });

  const { mutate } = useMutation({
    mutationKey: ["productdelete"],
    mutationFn: (id) => {
      if (!id) return Promise.reject(new Error("No id provided"));
      return deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Success",
        description: "Product Deleted Successfully!",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Something went wrong!",
        variant: "destructive",
      });
    },
  });

  const dispatch = useDispatch();

  const handleDelete = (id) => mutate(id);
  const handleEdit = (id) => {
    dispatch(setProductId(id));
    dispatch(getProductdata(id));
    setOpen(true);
  };

  const columns = [
    {
      accessorKey: "image_url",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={row.getValue("image_url")}
          className="size-12 rounded-lg object-cover border shadow"
          alt="Product"
        />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "ETB",
        }).format(amount);
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "stock_quantity",
      header: "Stock",
      cell: ({ row }) => <div>{row.getValue("stock_quantity")} pcs</div>,
    },
    {
      accessorKey: "location_name",
      header: "Location",
      cell: ({ row }) => (
        <div className="capitalize text-sm">
          {row.getValue("location_name")}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(product.name)}
              >
                Copy Name
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedProduct(product);
                  setShowDetail(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto  px-4">
      <ProductDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        product={selectedProduct}
      />
      <Popup title="Edit Product">
        <SellerProductEdit />
      </Popup>

      <h2 className="text-3xl font-bold text-center mb-6">My Products</h2>

      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <Input
          placeholder="Filter products..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-xs"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} products
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
