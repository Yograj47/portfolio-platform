import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Welcome back. Here's a quick overview of your portfolio.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Projects"
          value="12"
          description="Published projects"
        />

        <StatsCard
          title="Categories"
          value="5"
          description="Project categories"
        />

        <StatsCard
          title="Skills"
          value="18"
          description="Technologies listed"
        />

        <StatsCard
          title="Messages"
          value="2"
          description="Unread inquiries"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Latest portfolio updates
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between border-b pb-2">
                <span>Portfolio Website</span>
                <span className="text-muted-foreground">
                  Published
                </span>
              </li>

              <li className="flex justify-between border-b pb-2">
                <span>E-Commerce Platform</span>
                <span className="text-muted-foreground">
                  Draft
                </span>
              </li>

              <li className="flex justify-between">
                <span>Blog CMS</span>
                <span className="text-muted-foreground">
                  Published
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>
              Latest contact requests
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between border-b pb-2">
                <span>John Doe</span>
                <span className="text-muted-foreground">
                  Today
                </span>
              </li>

              <li className="flex justify-between border-b pb-2">
                <span>Jane Smith</span>
                <span className="text-muted-foreground">
                  Yesterday
                </span>
              </li>

              <li className="flex justify-between">
                <span>Alex Johnson</span>
                <span className="text-muted-foreground">
                  2 days ago
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

type StatsCardProps = {
  title: string;
  value: string;
  description: string;
};

function StatsCard({
  title,
  value,
  description,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardDescription>{title}</CardDescription>

        <CardTitle className="text-3xl">
          {value}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}