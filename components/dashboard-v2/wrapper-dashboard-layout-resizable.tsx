"use client"

import * as React from "react"
import {
  BookMinus,
  GraduationCap,
  GraduationCapIcon,
  HomeIcon, Key, ReceiptRussianRuble,
  Settings
} from "lucide-react";
import { Workflow as WorkflowIcon } from "lucide-react";
import { Workflow } from "@prisma/client";

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Nav } from "@/components/mail/nav"
import Logo from "../logo"
import BreadcrumbHeader from "../breadcrumb-header"
import { usePathname } from "next/navigation"
import UserAccountNav from "../user-account-nav"
import { ThemeToggle } from '@/components/theme-toggle';
import UserAvailableCreditsBadge from "../user-available-credits-badge";

interface DashboardProps {
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

interface Session {
  user?: any; // Define the type of user according to your application's requirements
}


export default function WrapperDashboardLayoutResizable({
  children,
  defaultLayout = [15, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
  session,
  workflows,
}: DashboardProps & { children?: React.ReactNode } & { session: Session, workflows: Workflow[] }) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [windowWidth, setWindowWidth] = React.useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);

  const pathname = usePathname();

  const routes = [
    {
      href: "/app",
      title: "Дашборд",
      icon: HomeIcon
    },
    {
      href: "/app/workflows",
      title: "Рабочие процессы",
      icon: WorkflowIcon,
      label: workflows ? String(workflows.length) : "0"
    },
    // {
    //   href: "/app/billing",
    //   title: "Платежи",
    //   icon: ReceiptRussianRuble
    // },
    {
      href: "/app/quiz",
      title: "Квиз",
      icon: GraduationCap
    },
    {
      href: "/app/credentials",
      title: "Учетные данные",
      icon: Key
    },
    {
      href: "/app/settings",
      title: "Настройки",
      icon: Settings
    }
  ];

  const activeRoute = routes.find(
    (route) => pathname.startsWith(route.href) && pathname.length === route.href.length
  ) || routes[0];


  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1400) { // Например, скрываем при <1024px
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Вызываем сразу, чтобы учесть начальное состояние

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:dashboard=${JSON.stringify(
            sizes
          )}`
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={10}
          maxSize={12}
          onCollapse={() => {
            setIsCollapsed(true)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`
          }}
          onResize={() => {
            setIsCollapsed(false)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`
          }}
          className={cn(
            isCollapsed &&
            "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          {/* Логотип */}
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            <Logo />
          </div>
          <Separator />
          <div className="p-2">
            <UserAvailableCreditsBadge />
          </div>
          {/* Навигация */}
          <Nav
            isCollapsed={isCollapsed}
            links={routes.map((route) => ({
              title: route.title,
              label: route.label,
              icon: route.icon,
              href: route.href,
              variant: activeRoute.href === route.href ? "default" : "ghost",
            }))}
          />
          <Separator />

          {/* Кнопки управления */}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} className="flex flex-col h-full">
          <Tabs defaultValue="all" className="flex flex-col flex-1 h-full">
            {/* Контейнер для хлебных крошек и кнопок */}
            <div className="flex items-center justify-between px-4 py-1.5">
              {/* Хлебные крошки слева */}
              <BreadcrumbHeader />

              {/* Кнопки справа */}
              <div className="flex items-center space-x-4">
                <ThemeToggle className="rounded-2xl" />
                {session.user && <UserAccountNav user={session.user} />}
              </div>
            </div>

            <Separator />

            {/* Контейнер с прокруткой */}
            <div className="flex-1 overflow-auto">
              <TabsContent value="all" className="container py-4 text-accent-foreground">
                {children}
              </TabsContent>
            </div>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
