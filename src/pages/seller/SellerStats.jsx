import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/services/stat";
import Loading from "@/components/Loading";
import { formatPrice } from "@/lib/formater";

export default function SellerStats() {
  const { data: stat, isLoading } = useQuery({
    queryFn: getStats,
    queryKey: ["stats"],
  });

  if (isLoading || !stat) return <Loading />;

  const {
    allproducts,
    orderscount,
    avarageprice,
    totalorderprice,
    categoryCounts,
    orderStatusCount,
  } = stat;

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Products",
            value: `${allproducts} Products`,
            description: "Published by seller",
          },
          {
            title: "Total Orders",
            value: `${orderscount} Orders`,
            description: "Placed by customers",
          },
          {
            title: "Average Price",
            value: formatPrice(avarageprice),
            description: "Across all products",
          },
          {
            title: "Total Revenue",
            value: formatPrice(totalorderprice),
            description: "From all orders",
          },
        ].map((stat, i) => (
          <Card key={i} className="bg-muted/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-primary font-semibold">
                {stat.title}
              </CardTitle>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-foreground">
              {stat.value}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-primary">Products by Category</CardTitle>
            <CardDescription>Breakdown of your products</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(categoryCounts).map(([name, value]) => ({
                    name,
                    value,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {Object.keys(categoryCounts).map((_, i) => (
                    <Cell key={i} fill={`hsl(${(i + 1) * 60}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-primary">Orders by Status</CardTitle>
            <CardDescription>Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(orderStatusCount).map(
                    ([name, value]) => ({
                      name,
                      value,
                    })
                  )}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {Object.keys(orderStatusCount).map((_, i) => (
                    <Cell key={i} fill={`hsl(${(i + 1) * 60}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
