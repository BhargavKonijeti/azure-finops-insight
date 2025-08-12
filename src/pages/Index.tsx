import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { useMemo, useState, useEffect } from "react";

// Simple fake dataset generator
function useCostData() {
  return useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (29 - i));
      const spend = 800 + Math.round(Math.sin(i / 3) * 120 + i * 5 + Math.random() * 80);
      return { date: d.toISOString().slice(5, 10), spend };
    });

    const forecast = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + (i + 1));
      const spend = 950 + Math.round(Math.sin((i + 30) / 3) * 90 + (i + 30) * 4);
      return { date: d.toISOString().slice(5, 10), spend };
    });

    const services = [
      { name: "Virtual Machines", value: 4200 },
      { name: "Azure SQL", value: 3100 },
      { name: "Storage", value: 2100 },
      { name: "AKS", value: 1700 },
      { name: "App Services", value: 1200 },
    ];

    const byService = services.map((s) => ({ service: s.name, cost: s.value }));

    const anomalies = [
      { id: 1, date: days[26].date, service: "Azure SQL", delta: 38 },
      { id: 2, date: days[28].date, service: "Storage", delta: 26 },
    ];

    const recs = [
      { id: "r1", title: "Right-size 3 VMs (D8s_v5 → D4s_v5)", impact: 620, action: "Compute" },
      { id: "r2", title: "Purchase 1-year Reserved Instances (SQL)", impact: 840, action: "Database" },
      { id: "r3", title: "Move cold blobs to Cool tier", impact: 210, action: "Storage" },
    ];

    return { days, forecast, services, byService, anomalies, recs };
  }, []);
}

const COLORS = ["hsl(211 100% 45%)", "hsl(217 91% 59%)", "hsl(215 60% 55%)", "hsl(210 60% 60%)", "hsl(205 70% 50%)"];

const Index = () => {
  const { days, forecast, byService, anomalies, recs } = useCostData();
  const [subscription, setSubscription] = useState<string | undefined>(undefined);
  const [rg, setRg] = useState<string | undefined>(undefined);
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [service, setService] = useState<string | undefined>(undefined);

  const total30 = days.reduce((a, b) => a + b.spend, 0);
  const avgDaily = Math.round(total30 / days.length);
  const forecastNext7 = forecast.slice(0, 7).reduce((a, b) => a + b.spend, 0);

  useEffect(() => {
    // Structured data for SEO
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Azure FinOps AI Dashboard",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "Real-time Azure cost analytics with AI forecasting, anomaly detection, and savings recommendations.",
    });
    document.head.appendChild(ld);
    return () => { document.head.removeChild(ld); };
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Azure FinOps AI Dashboard</h1>
        <p className="text-muted-foreground">Real-time costs, AI forecasts, anomalies, and optimization insights.</p>
      </header>

      <section aria-label="Filters" className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Select onValueChange={setSubscription}>
          <SelectTrigger><SelectValue placeholder="Subscription" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="prod">Contoso-Prod</SelectItem>
            <SelectItem value="dev">Contoso-Dev</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setRg}>
          <SelectTrigger><SelectValue placeholder="Resource group" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="rg-web">rg-web</SelectItem>
            <SelectItem value="rg-data">rg-data</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setRegion}>
          <SelectTrigger><SelectValue placeholder="Region" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="eastus">East US</SelectItem>
            <SelectItem value="westeurope">West Europe</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setService}>
          <SelectTrigger><SelectValue placeholder="Service" /></SelectTrigger>
          <SelectContent>
            {byService.map((s) => (
              <SelectItem key={s.service} value={s.service}>{s.service}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm" aria-labelledby="kpi-total">
          <CardHeader>
            <CardTitle id="kpi-total" className="text-sm">30-day Spend</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-semibold">${(total30/1000).toFixed(1)}k</div>
            <div className="text-muted-foreground">Avg daily ${avgDaily}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm" aria-labelledby="kpi-forecast">
          <CardHeader>
            <CardTitle id="kpi-forecast" className="text-sm">Next 7d Forecast</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-semibold">${forecastNext7}</div>
            <div className="flex items-center gap-2 text-primary"><TrendingUp className="h-4 w-4" /> steady</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm" aria-labelledby="kpi-alerts">
          <CardHeader>
            <CardTitle id="kpi-alerts" className="text-sm">Alerts & Recs</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="flex items-center gap-2"><AlertTriangle className="text-destructive" /> {anomalies.length} anomalies</div>
            <div className="flex items-center gap-2"><Lightbulb className="text-primary" /> {recs.length} recs</div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 shadow-[var(--shadow-elev)]" aria-labelledby="forecast-title">
          <CardHeader>
            <CardTitle id="forecast-title">Forecast vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={days} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(211 100% 45%)" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="hsl(211 100% 45%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="spend" stroke="hsl(211 100% 45%)" fillOpacity={1} fill="url(#actual)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="h-40 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RLineChart data={forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="spend" stroke="hsl(217 91% 59%)" strokeDasharray="5 5" />
                </RLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2" aria-labelledby="service-title">
          <CardHeader>
            <CardTitle id="service-title">Cost by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byService} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="service" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="cost" fill="hsl(211 100% 45%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="anomalies" className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3" aria-labelledby="drivers-title">
          <CardHeader>
            <CardTitle id="drivers-title">Top 5 Cost Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byService} dataKey="cost" nameKey="service" outerRadius={100} fill="#8884d8" label>
                    {byService.map((entry, index) => (
                      <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2" aria-labelledby="anomaly-title">
          <CardHeader>
            <CardTitle id="anomaly-title">Daily Anomalies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {anomalies.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-destructive" />
                  <div>
                    <div className="font-medium">{a.service}</div>
                    <div className="text-xs text-muted-foreground">{a.date} • +{a.delta}%</div>
                  </div>
                </div>
                <Button variant="outline">Investigate</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="recommendations">
        <Card aria-labelledby="recs-title">
          <CardHeader>
            <CardTitle id="recs-title">Savings Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recs.map((r) => (
              <div key={r.id} className="rounded-md border p-4 flex items-start justify-between">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">Area: {r.action}</div>
                </div>
                <div className="text-sm font-semibold text-primary">-${r.impact}/mo</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
