import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { getOrders } from "@/services/orders";
import { formatPrice } from "@/lib/formater";
import Loading from "@/components/Loading";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";

export default function SellerOrders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = [
    {
      accessorKey: "order.location",
      header: () => <div className="font-bold">Order Location</div>,
      cell: ({ row }) => row.original.order?.location || "N/A",
    },
    {
      accessorKey: "order.user.name",
      id: "user_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.order?.user?.name || "Unknown",
    },
    {
      accessorKey: "order.user.email",
      header: "User Email",
      cell: ({ row }) => row.original.order?.user?.email || "N/A",
    },
    {
      accessorKey: "order.tracking_status",
      header: "Tracking Status",
      cell: ({ row }) => (
        <Badge>{row.original.order?.tracking_status || "N/A"}</Badge>
      ),
    },
    {
      accessorKey: "order.status",
      header: "Order Status",
      cell: ({ row }) => <Badge>{row.original.order?.status || "N/A"}</Badge>,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => `${row.original.quantity} pcs`,
    },
    {
      accessorKey: "order.total_amount",
      header: "Total Amount",
      cell: ({ row }) =>
        formatPrice(row.original.order?.total_amount || row.original.price),
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const navigate = useNavigate();

  const handleOrderDetail = (cell) => {
    const orderId = cell.row.original.order?.id;
    if (orderId) {
      navigate(`/dashboard/orders/${orderId}`);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by user name..."
          value={table.getColumn("user_name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("user_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => handleOrderDetail(cell)}
                      className="cursor-pointer"
                    >
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
                  className="text-center h-24"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} order(s)
        </div>
      </div>
    </div>
  );
}
