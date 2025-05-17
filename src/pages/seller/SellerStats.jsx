import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  PieChart,
  Pie,
  Label,
} from "recharts";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

const chartData2 = [
  { browser: "Chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "Safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "Firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "Edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "Other", visitors: 190, fill: "var(--color-other)" },
];

export default function SellerStats() {
  const totalVisitors = React.useMemo(() => {
    return chartData2.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <div className="w-full h-full p-4">
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-7xl rounded-lg border shadow-sm bg-background"
      >
        {/* Bar Chart Panel */}
        <ResizablePanel defaultSize={50}>
          <div className="h-full p-4">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">Visitors by Platform</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ChartContainer config={chartConfig}>
                  <BarChart data={chartData} height={240}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar
                      dataKey="desktop"
                      fill="var(--color-desktop)"
                      radius={4}
                    />
                    <Bar
                      dataKey="mobile"
                      fill="var(--color-mobile)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="flex gap-2 font-semibold text-green-600">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <p className="text-muted-foreground">
                  Showing platform visitor stats for the last 6 months
                </p>
              </CardFooter>
            </Card>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Pie Chart Panel */}
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={100}>
              <div className="h-full p-4">
                <Card className="h-full flex flex-col">
                  <CardHeader className="items-center">
                    <CardTitle className="text-xl">
                      Visitors by Browser
                    </CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[300px]"
                    >
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={chartData2}
                          dataKey="visitors"
                          nameKey="browser"
                          innerRadius={60}
                          outerRadius={90}
                          strokeWidth={2}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (
                                viewBox &&
                                "cx" in viewBox &&
                                "cy" in viewBox
                              ) {
                                return (
                                  <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                  >
                                    <tspan
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      className="fill-foreground text-3xl font-bold"
                                    >
                                      {totalVisitors.toLocaleString()}
                                    </tspan>
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 0) + 24}
                                      className="fill-muted-foreground text-sm"
                                    >
                                      Visitors
                                    </tspan>
                                  </text>
                                );
                              }
                            }}
                          />
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex items-center gap-2 font-semibold text-green-600">
                      Trending up by 5.2% this month{" "}
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <p className="text-muted-foreground">
                      Showing browser visitor stats for the last 6 months
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
