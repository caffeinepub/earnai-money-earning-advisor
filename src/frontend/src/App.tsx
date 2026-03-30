import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  ChevronDown,
  Clock,
  DollarSign,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";
import {
  type EarningStrategy,
  type EarningsRecord,
  type SideHustle,
  type SkillPath,
  useAskAI,
  useCreateProfile,
  useEarnings,
  useHustles,
  useIsDataSeeded,
  useLogEarnings,
  useProfile,
  useSkillPaths,
  useStrategies,
} from "./hooks/useQueries";

function formatDollars(val: bigint | number): string {
  const n = typeof val === "bigint" ? Number(val) : val;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ profileName }: { profileName?: string }) {
  const navLinks = [
    "Dashboard",
    "Strategies",
    "Side Hustles",
    "Skills",
    "Courses",
    "Tips",
  ];
  return (
    <header className="bg-header text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">EarnAI</span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <button
              type="button"
              key={link}
              data-ocid={`nav.link.${i + 1}`}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-primary/20 text-primary"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {link}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          {profileName && (
            <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                {profileName[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium">{profileName}</span>
            </div>
          )}
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-4"
            data-ocid="header.primary_button"
          >
            + New Goal
          </Button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero Banner ──────────────────────────────────────────────────────────────
function HeroBanner({
  profileName,
  currentBalance,
  monthlyGoal,
}: {
  profileName?: string;
  currentBalance: bigint;
  monthlyGoal: bigint;
}) {
  const progress =
    monthlyGoal > 0n
      ? Math.min(
          100,
          Math.round((Number(currentBalance) / Number(monthlyGoal)) * 100),
        )
      : 0;
  return (
    <section
      className="py-12 px-4 text-white"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.26 0.065 202) 0%, oklch(0.21 0.055 202) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-3 leading-tight"
        >
          Your AI-Powered Path to{" "}
          <span className="text-primary">Higher Earnings</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-white/70 text-lg mb-8"
        >
          {profileName
            ? `Welcome back, ${profileName}!`
            : "Get personalized strategies to grow your income today."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-lg mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          data-ocid="hero.card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">
                Monthly Earning Goal
              </span>
            </div>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 mb-3" />
          <div className="flex justify-between text-sm">
            <span className="text-white/70">
              Earned:{" "}
              <span className="text-white font-bold">
                {formatDollars(currentBalance)}
              </span>
            </span>
            <span className="text-white/70">
              Goal:{" "}
              <span className="text-white font-bold">
                {formatDollars(monthlyGoal)}
              </span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────
function KPICards({
  balance,
  strategies,
  hustles,
}: {
  balance: bigint;
  strategies: number;
  hustles: number;
}) {
  const cards = [
    {
      label: "Total Balance",
      value: formatDollars(balance),
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-primary",
      bg: "bg-primary/10",
      ocid: "kpi.balance.card",
    },
    {
      label: "Recommended Actions",
      value: strategies.toString(),
      icon: <Zap className="w-5 h-5" />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      ocid: "kpi.actions.card",
    },
    {
      label: "New Opportunities",
      value: hustles.toString(),
      icon: <Star className="w-5 h-5" />,
      color: "text-success",
      bg: "bg-success/10",
      ocid: "kpi.opportunities.card",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 + 0.1 }}
          data-ocid={card.ocid}
          className="bg-card rounded-xl p-5 shadow-card border border-border flex items-center gap-4"
        >
          <div className={`${card.bg} ${card.color} rounded-xl p-3`}>
            {card.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Strategies Section ───────────────────────────────────────────────────────
function StrategiesSection({ strategies }: { strategies: EarningStrategy[] }) {
  const displayed = strategies.slice(0, 3);
  const difficultyColor: Record<string, string> = {
    Easy: "bg-success/15 text-success",
    Medium: "bg-amber-500/15 text-amber-600",
    Hard: "bg-destructive/15 text-destructive",
  };
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" /> Recommended Strategies
      </h2>
      <div className="grid gap-3">
        {displayed.map((s, i) => {
          const isFeatured = i === 2;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              data-ocid={`strategies.item.${i + 1}`}
              className={`rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${
                isFeatured
                  ? "text-white border-transparent"
                  : "bg-card border-border"
              }`}
              style={
                isFeatured
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.26 0.065 202) 0%, oklch(0.21 0.055 202) 100%)",
                    }
                  : {}
              }
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3
                  className={`font-semibold text-sm leading-snug ${isFeatured ? "text-white" : "text-foreground"}`}
                >
                  {s.title}
                </h3>
                <span
                  className={`text-xs font-bold shrink-0 ${isFeatured ? "text-primary" : "text-success"}`}
                >
                  {formatDollars(s.estimatedEarnings)}/mo
                </span>
              </div>
              <p
                className={`text-xs mb-3 line-clamp-2 ${isFeatured ? "text-white/70" : "text-muted-foreground"}`}
              >
                {s.description}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isFeatured
                      ? "bg-white/20 text-white"
                      : (difficultyColor[s.difficulty] ??
                        "bg-muted text-muted-foreground")
                  }`}
                >
                  {s.difficulty}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isFeatured
                      ? "bg-white/15 text-white/80"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.category}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Earnings Feed ────────────────────────────────────────────────────────────
function EarningsFeed({
  earnings,
  onLogEarning,
}: {
  earnings: EarningsRecord[];
  onLogEarning: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" /> My Earnings Feed
        </h2>
        <Button
          size="sm"
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-white h-8 px-3 text-xs"
          onClick={onLogEarning}
          data-ocid="earnings.open_modal_button"
        >
          <Plus className="w-3 h-3 mr-1" /> Log Earning
        </Button>
      </div>
      <div className="bg-card rounded-xl border border-border shadow-card">
        {earnings.length === 0 ? (
          <div className="py-10 text-center" data-ocid="earnings.empty_state">
            <DollarSign className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No earnings logged yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click "Log Earning" to track your income
            </p>
          </div>
        ) : (
          <ScrollArea className="h-72">
            <div className="divide-y divide-border">
              {earnings.map((e, i) => (
                <div
                  key={e.source + e.date}
                  data-ocid={`earnings.item.${i + 1}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {e.source}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(e.date)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-success">
                    +{formatDollars(e.amount)}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

// ─── Side Hustles ─────────────────────────────────────────────────────────────
function SideHustlesSection({ hustles }: { hustles: SideHustle[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-primary" /> Featured Side Hustles
      </h2>
      <div className="grid gap-3">
        {hustles.slice(0, 2).map((h, i) => (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            data-ocid={`hustles.item.${i + 1}`}
            className="bg-card rounded-xl border border-border shadow-card p-4 flex gap-3 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{h.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {h.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {h.timeCommitment}
                </span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {h.category}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Skill Paths ─────────────────────────────────────────────────────────────
function SkillPathsSection({ skillPaths }: { skillPaths: SkillPath[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" /> Skill-Based Paths
      </h2>
      <div className="grid gap-3">
        {skillPaths.slice(0, 2).map((sp, i) => (
          <motion.div
            key={sp.title}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            data-ocid={`skills.item.${i + 1}`}
            className="bg-card rounded-xl border border-border shadow-card p-4 flex gap-3 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {sp.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {sp.description}
              </p>
              <p className="text-xs font-bold text-success mt-2">
                Up to {formatDollars(sp.potentialEarnings)}/yr
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Free Courses Section ─────────────────────────────────────────────────────
const FREE_COURSES = [
  {
    title: "Google Digital Marketing Fundamentals",
    platform: "Google",
    topic: "Digital Marketing",
    level: "Beginner",
    duration: "40 hrs",
    url: "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing",
  },
  {
    title: "Freelancing on Upwork",
    platform: "Coursera",
    topic: "Freelancing",
    level: "Beginner",
    duration: "10 hrs",
    url: "https://www.coursera.org/learn/work-smarter-not-harder",
  },
  {
    title: "Python for Everybody",
    platform: "Coursera",
    topic: "Programming",
    level: "Beginner",
    duration: "30 hrs",
    url: "https://www.coursera.org/specializations/python",
  },
  {
    title: "Graphic Design Basics",
    platform: "Canva",
    topic: "Design",
    level: "Beginner",
    duration: "5 hrs",
    url: "https://www.canva.com/designschool/",
  },
  {
    title: "SEO for Beginners",
    platform: "Moz",
    topic: "SEO",
    level: "Beginner",
    duration: "3 hrs",
    url: "https://moz.com/beginners-guide-to-seo",
  },
  {
    title: "Excel / Spreadsheet Skills",
    platform: "Google",
    topic: "Productivity",
    level: "Beginner",
    duration: "6 hrs",
    url: "https://learndigital.withgoogle.com/digitalgarage",
  },
  {
    title: "Investing 101: Stock Market Basics",
    platform: "Khan Academy",
    topic: "Investing",
    level: "Beginner",
    duration: "8 hrs",
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance",
  },
  {
    title: "Personal Finance & Investing",
    platform: "Coursera",
    topic: "Investing",
    level: "Beginner",
    duration: "12 hrs",
    url: "https://www.coursera.org/learn/personal-finance",
  },
  {
    title: "JavaScript for Beginners",
    platform: "freeCodeCamp",
    topic: "Coding",
    level: "Beginner",
    duration: "20 hrs",
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
  },
  {
    title: "Responsive Web Design",
    platform: "freeCodeCamp",
    topic: "Coding",
    level: "Beginner",
    duration: "15 hrs",
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
  },
  {
    title: "Social Media Marketing",
    platform: "HubSpot",
    topic: "Social Media",
    level: "Beginner",
    duration: "4 hrs",
    url: "https://academy.hubspot.com/courses/social-media",
  },
  {
    title: "Content Creation for YouTube",
    platform: "YouTube",
    topic: "Social Media",
    level: "Beginner",
    duration: "6 hrs",
    url: "https://creatoracademy.youtube.com",
  },
];

const PLATFORM_COLORS: Record<string, string> = {
  Google: "bg-blue-500/10 text-blue-600",
  Coursera: "bg-indigo-500/10 text-indigo-600",
  Canva: "bg-purple-500/10 text-purple-600",
  Moz: "bg-orange-500/10 text-orange-600",
  "Khan Academy": "bg-green-500/10 text-green-700",
  freeCodeCamp: "bg-teal-500/10 text-teal-700",
  HubSpot: "bg-orange-500/10 text-orange-700",
  YouTube: "bg-red-500/10 text-red-700",
};

function FreeCoursesSection() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-primary" /> Free Courses to Boost
        Your Income
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FREE_COURSES.map((course, i) => (
          <motion.div
            key={course.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            data-ocid={`courses.item.${i + 1}`}
            className="bg-card rounded-xl border border-border shadow-card p-4 flex flex-col gap-3 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground leading-snug flex-1">
                {course.title}
              </h3>
              <Badge
                className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border-0 ${
                  PLATFORM_COLORS[course.platform] ??
                  "bg-muted text-muted-foreground"
                }`}
              >
                {course.platform}
              </Badge>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                {course.topic}
              </span>
              <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                {course.level}
              </span>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> {course.duration}
              </span>
            </div>
            <div className="mt-auto">
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid={`courses.button.${i + 1}`}
              >
                <Button
                  size="sm"
                  className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 transition-colors h-8 text-xs font-semibold"
                  variant="ghost"
                >
                  Start Free <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Free Resources Section ───────────────────────────────────────────────────
const FREE_RESOURCES = [
  {
    title: "r/Entrepreneur Community",
    type: "Community",
    description:
      "Discuss business ideas and side hustle strategies with thousands of entrepreneurs.",
    url: "https://reddit.com/r/Entrepreneur",
  },
  {
    title: "NerdWallet Money Guide",
    type: "Guide",
    description:
      "Comprehensive guides on saving, investing, and growing your income.",
    url: "https://www.nerdwallet.com/article/finance/how-to-make-money",
  },
  {
    title: "Fiverr Seller Academy",
    type: "Guide",
    description: "Learn how to set up and succeed as a freelancer on Fiverr.",
    url: "https://www.fiverr.com/resources/guides",
  },
  {
    title: "Canva Free Design Tool",
    type: "Tool",
    description:
      "Create professional graphics for free to sell designs or build a brand.",
    url: "https://www.canva.com",
  },
  {
    title: "Investopedia - Investing Basics",
    type: "Guide",
    description: "Free tutorials and guides on investing to grow your wealth.",
    url: "https://www.investopedia.com/investing-4427685",
  },
  {
    title: "HubSpot Free Marketing Courses",
    type: "Guide",
    description:
      "Free certifications in content marketing, email marketing, and social media.",
    url: "https://academy.hubspot.com/courses",
  },
];

const RESOURCE_TYPE_COLORS: Record<string, string> = {
  Community: "bg-purple-500/10 text-purple-600",
  Guide: "bg-blue-500/10 text-blue-600",
  Tool: "bg-amber-500/10 text-amber-600",
  Blog: "bg-green-500/10 text-green-600",
};

function FreeResourcesSection() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-primary" /> Free Money-Making
        Resources
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FREE_RESOURCES.map((resource, i) => (
          <motion.div
            key={resource.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            data-ocid={`resources.item.${i + 1}`}
            className="bg-card rounded-xl border border-border shadow-card p-4 flex flex-col gap-3 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground leading-snug flex-1">
                {resource.title}
              </h3>
              <Badge
                className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border-0 ${
                  RESOURCE_TYPE_COLORS[resource.type] ??
                  "bg-muted text-muted-foreground"
                }`}
              >
                {resource.type}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              {resource.description}
            </p>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid={`resources.link.${i + 1}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View Resource <ArrowRight className="w-3 h-3" />
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── AI Chat Widget ───────────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

const SUGGESTIONS = [
  "Best side hustles for beginners?",
  "How to earn $500 extra?",
  "Top freelance skills?",
];

function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Hi! I'm your AI earning coach. Ask me anything about growing your income! 💰",
    },
  ]);
  const askAI = useAskAI();

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    try {
      const reply = await askAI.mutateAsync(text);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            data-ocid="ai_chat.panel"
            className="w-80 md:w-96 rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col"
            style={{ height: "480px" }}
          >
            {/* Chat header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: "oklch(0.18 0.015 235)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">
                  AI Earning Coach
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-ocid="ai_chat.close_button"
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 bg-background">
              <div className="p-3 flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div
                    key={`msg-${msg.role}-${i}-${msg.text.slice(0, 8)}`}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-card border border-border text-foreground rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {askAI.isPending && (
                  <div className="flex justify-start">
                    <div
                      className="bg-card border border-border rounded-2xl rounded-bl-sm px-3 py-2"
                      data-ocid="ai_chat.loading_state"
                    >
                      <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggestion chips */}
            <div className="px-3 pb-2 pt-1 bg-background border-t border-border flex gap-1.5 overflow-x-auto">
              {SUGGESTIONS.map((s, i) => (
                <button
                  type="button"
                  key={s}
                  data-ocid={`ai_chat.suggestion.${i + 1}`}
                  onClick={() => sendMessage(s)}
                  className="shrink-0 text-xs bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors px-2.5 py-1 rounded-full font-medium"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 pb-3 bg-background flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask me anything..."
                className="flex-1 h-9 text-sm"
                data-ocid="ai_chat.input"
                disabled={askAI.isPending}
              />
              <Button
                size="sm"
                className="h-9 w-9 p-0 bg-primary hover:bg-primary/90"
                onClick={() => sendMessage(input)}
                disabled={askAI.isPending || !input.trim()}
                data-ocid="ai_chat.submit_button"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        data-ocid="ai_chat.open_modal_button"
        className="w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        {open ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
}

// ─── Onboarding Modal ─────────────────────────────────────────────────────────
function OnboardingModal({
  open,
  onComplete,
}: { open: boolean; onComplete: () => void }) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const createProfile = useCreateProfile();

  async function handleSubmit() {
    if (!name.trim() || !goal.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await createProfile.mutateAsync({
        name: name.trim(),
        monthlyGoal: BigInt(Math.round(Number.parseFloat(goal))),
      });
      toast.success("Profile created! Welcome to EarnAI 🎉");
      onComplete();
    } catch {
      toast.error("Failed to create profile. Please try again.");
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" data-ocid="onboarding.dialog">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Welcome to EarnAI
          </DialogTitle>
          <DialogDescription>
            Let's set up your profile so we can personalize your earning
            strategies.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label
              className="text-sm font-medium text-foreground mb-1.5 block"
              htmlFor="your-name"
            >
              Your Name
            </label>
            <Input
              id="your-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              data-ocid="onboarding.input"
            />
          </div>
          <div>
            <label
              className="text-sm font-medium text-foreground mb-1.5 block"
              htmlFor="monthly-earning-goal-dollar"
            >
              Monthly Earning Goal ($)
            </label>
            <Input
              id="monthly-earning-goal-dollar"
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. 2000"
              data-ocid="onboarding.goal_input"
            />
          </div>
        </div>
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white"
          onClick={handleSubmit}
          disabled={createProfile.isPending}
          data-ocid="onboarding.submit_button"
        >
          {createProfile.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating
              Profile...
            </>
          ) : (
            "Get Started →"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ─── Log Earnings Modal ───────────────────────────────────────────────────────
function LogEarningsModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const logEarnings = useLogEarnings();

  async function handleSubmit() {
    if (!amount.trim() || !source.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await logEarnings.mutateAsync({
        amount: BigInt(Math.round(Number.parseFloat(amount))),
        source: source.trim(),
      });
      toast.success("Earning logged successfully! 💰");
      setAmount("");
      setSource("");
      onClose();
    } catch {
      toast.error("Failed to log earning.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="log_earnings.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-success" /> Log New Earning
          </DialogTitle>
          <DialogDescription>
            Record income you've earned to track your progress.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label
              className="text-sm font-medium text-foreground mb-1.5 block"
              htmlFor="amount-dollar"
            >
              Amount ($)
            </label>
            <Input
              id="amount-dollar"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 150"
              data-ocid="log_earnings.input"
            />
          </div>
          <div>
            <label
              className="text-sm font-medium text-foreground mb-1.5 block"
              htmlFor="source"
            >
              Source
            </label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. Freelance design project"
              data-ocid="log_earnings.source_input"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            data-ocid="log_earnings.cancel_button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
            onClick={handleSubmit}
            disabled={logEarnings.isPending}
            data-ocid="log_earnings.submit_button"
          >
            {logEarnings.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Log Earning"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const cols = [
    {
      title: "Product",
      links: ["Dashboard", "Strategies", "Side Hustles", "Skill Paths", "Tips"],
    },
    {
      title: "Resources",
      links: ["Blog", "Guides", "Webinars", "Community", "Newsletter"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Press", "Partners", "Contact"],
    },
    {
      title: "Legal",
      links: [
        "Privacy Policy",
        "Terms of Service",
        "Cookie Policy",
        "Disclaimer",
      ],
    },
  ];
  return (
    <footer className="bg-footer text-white/70 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="/"
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-white">EarnAI</span>
          </div>
          <p>
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="underline hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { actor } = useActor();
  const { data: isSeeded } = useIsDataSeeded();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: strategies = [] } = useStrategies();
  const { data: hustles = [] } = useHustles();
  const { data: skillPaths = [] } = useSkillPaths();
  const { data: earnings = [] } = useEarnings();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogEarnings, setShowLogEarnings] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Seed data on first load
  useEffect(() => {
    if (!actor || isSeeded === undefined || isSeeded === true || seeding)
      return;
    setSeeding(true);
    actor.seedData().finally(() => setSeeding(false));
  }, [actor, isSeeded, seeding]);

  // Show onboarding if no profile
  useEffect(() => {
    if (!profileLoading && profile === null && !showOnboarding) {
      setShowOnboarding(true);
    }
  }, [profile, profileLoading, showOnboarding]);

  const balance = profile?.currentBalance ?? 0n;
  const monthlyGoal = profile?.monthlyGoal ?? 5000n;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster richColors />

      <OnboardingModal
        open={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
      <LogEarningsModal
        open={showLogEarnings}
        onClose={() => setShowLogEarnings(false)}
      />

      <Header profileName={profile?.name} />

      <main className="flex-1">
        <HeroBanner
          profileName={profile?.name}
          currentBalance={balance}
          monthlyGoal={monthlyGoal}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* KPI Row */}
          <KPICards
            balance={balance}
            strategies={strategies.length}
            hustles={hustles.length}
          />

          {/* Strategies + Earnings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StrategiesSection strategies={strategies} />
            <EarningsFeed
              earnings={earnings}
              onLogEarning={() => setShowLogEarnings(true)}
            />
          </div>

          {/* Side Hustles + Skill Paths */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SideHustlesSection hustles={hustles} />
            <SkillPathsSection skillPaths={skillPaths} />
          </div>

          {/* Free Courses */}
          <FreeCoursesSection />

          {/* Free Resources */}
          <FreeResourcesSection />

          {/* Seeding indicator */}
          {seeding && (
            <div
              className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground"
              data-ocid="app.loading_state"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Setting up your data...
            </div>
          )}
        </div>
      </main>

      <Footer />

      <AIChatWidget />

      {/* Help button */}
      <button
        type="button"
        data-ocid="help.button"
        className="fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
        title="Help"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  );
}
