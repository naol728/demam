import { ArrowRight } from "lucide-react";

const Stat = ({
  heading = "Demam Platform by the Numbers",
  description = "Empowering merchants and sellers to grow and thrive together.",
  link = {
    text: "Explore more platform stats",
    url: "/platform-insights",
  },
  stats = [
    {
      id: "stat-1",
      value: "12K+",
      label: "active users buying and selling",
    },
    {
      id: "stat-2",
      value: "100,000",
      label: "transactions completed across the platform",
    },
    {
      id: "stat-3",
      value: "8.2M+ETB",
      label: "total money exchanged in product sales",
    },
    {
      id: "stat-4",
      value: "2K+",
      label: "registered merchants and sellers",
    },
  ],
}) => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold md:text-4xl">{heading}</h2>
          <p>{description}</p>
          <a
            href={link.url}
            className="flex items-center gap-1 font-bold hover:underline"
          >
            {link.text}
            <ArrowRight className="h-auto w-4" />
          </a>
        </div>
        <div className="mt-14 grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-5">
              <div className="text-6xl font-bold">{stat.value}</div>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Stat };
