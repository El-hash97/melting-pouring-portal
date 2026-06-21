export type AppStatus = "ACTIVE" | "MAINTENANCE";

export interface AppItem {
  id: string;
  name: string;
  description: string;
  logoIcon: string;
  accessLink: string;
  status: AppStatus;
  category: string;
  averageRating: number;
  totalRatings: number;
}

export interface FeedbackItem {
  id: string;
  appId: string;
  rating: number;
  message: string;
  createdAt: string;
}

export const MOCK_APPS: AppItem[] = [
  {
    id: "1",
    name: "Smart Pouring Log System",
    description:
      "Pencatatan digital parameter penuangan logam cair — temperatur, waktu, dan lot number — secara real-time untuk setiap heat.",
    logoIcon: "flame",
    accessLink: "#",
    status: "ACTIVE",
    category: "Pouring",
    averageRating: 4.5,
    totalRatings: 32,
  },
  {
    id: "2",
    name: "Trial Flow Monitor",
    description:
      "Monitoring aliran proses trial produksi baru dari melting hingga quality check, dengan notifikasi deviasi otomatis.",
    logoIcon: "activity",
    accessLink: "#",
    status: "ACTIVE",
    category: "Monitoring",
    averageRating: 4.2,
    totalRatings: 18,
  },
  {
    id: "3",
    name: "IdeaVault",
    description:
      "Platform pengumpulan dan tracking ide perbaikan (Kaizen) dari operator floor. Dilengkapi sistem voting dan status implementasi.",
    logoIcon: "lightbulb",
    accessLink: "#",
    status: "MAINTENANCE",
    category: "Improvement",
    averageRating: 3.8,
    totalRatings: 45,
  },
  {
    id: "4",
    name: "Mold Temp Tracker",
    description:
      "Pencatatan dan visualisasi grafis temperatur cetakan (mold) secara berkala untuk menjaga konsistensi kualitas casting.",
    logoIcon: "thermometer",
    accessLink: "#",
    status: "ACTIVE",
    category: "Quality",
    averageRating: 4.7,
    totalRatings: 28,
  },
  {
    id: "5",
    name: "Production Counter",
    description:
      "Pencacah produksi harian per shift dan per line, dengan target vs actual dan laporan otomatis ke supervisor.",
    logoIcon: "bar-chart-2",
    accessLink: "#",
    status: "ACTIVE",
    category: "Production",
    averageRating: 4.0,
    totalRatings: 56,
  },
  {
    id: "6",
    name: "Defect Reporter",
    description:
      "Pelaporan cacat casting (shrinkage, cold shut, misrun) dengan foto dan klasifikasi untuk analisis root cause.",
    logoIcon: "shield-alert",
    accessLink: "#",
    status: "ACTIVE",
    category: "Quality",
    averageRating: 4.3,
    totalRatings: 41,
  },
];

export const MOCK_KPI = {
  totalApps: MOCK_APPS.length,
  activeApps: MOCK_APPS.filter((a) => a.status === "ACTIVE").length,
  maintenanceApps: MOCK_APPS.filter((a) => a.status === "MAINTENANCE").length,
  totalReportsThisMonth: 27,
  // App with highest totalRatings = most-used by operators this month
  mostPopularApp: MOCK_APPS.reduce((a, b) => (a.totalRatings > b.totalRatings ? a : b)),
};
