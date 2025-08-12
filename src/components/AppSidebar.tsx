import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, LineChart, Wallet, Settings, AlertTriangle, Lightbulb } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const current = location.pathname;
  const { state } = useSidebar();

  const nav = [
    { title: "Dashboard", url: "/", icon: LineChart },
    { title: "Budgets", url: "/budgets", icon: Wallet },
    { title: "Reports", url: "/reports", icon: BarChart3 },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const isActive = (url: string) => current === url;

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"} collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Insights Today</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#anomalies">
                    <AlertTriangle className="text-destructive" />
                    <span>Anomalies: 2 spikes detected</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#recommendations">
                    <Lightbulb className="text-primary" />
                    <span>Recommendations: 3 actions</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
