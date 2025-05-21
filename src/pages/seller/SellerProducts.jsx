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
        description: "Product Deleted Sucessfully!",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "something went wrong!",
        variant: "destructive",
      });
    },
  });

  const dispatch = useDispatch();

  const handledelete = (id) => {
    if (!id) return;
    console.log(id);
    mutate(id);
  };

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
        <div className="capitalize">
          <img
            src={row.getValue("image_url")}
            className="size-10 rounded-md shadow-md"
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price <ArrowUpDown />
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "des")}
        >
          Stock Quantity <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("stock_quantity")} pcs</div>,
    },
    {
      accessorKey: "location_name",
      header: "Location",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("location_name")}</div>
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
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(product.name)}
              >
                Copy product Name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  console.log(product);
                  setSelectedProduct(product);
                  setShowDetail(true);
                }}
              >
                Product Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                Edit product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handledelete(product.id)}>
                Delete product
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
    <div className="max-w-5xl mx-auto">
      <ProductDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        product={selectedProduct}
      />

      <Popup title={"Edit the Product"}>
        <SellerProductEdit />
      </Popup>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Products..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row
        </div>
        {/* <div className="space-x-2">
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
        </div> */}
      </div>
    </div>
  );
}
