"use client";

import React, { useState, useEffect } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
} from "@mui/material";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import CategoryIcon from "@mui/icons-material/Category";
import PublicIcon from "@mui/icons-material/Public";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Link from "next/link";
import { fetchAdminTerms } from "@/lib/termsApi";
import { fetchCategories } from "@/lib/categoriesApi";
import { fetchCountries } from "@/lib/countriesApi";
import { fetchSources } from "@/lib/sourcesApi";
import { TermSummary } from "@/types";
import { logger } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  loading,
}) => (
  <Card
    sx={{
      height: "100%",
      borderRadius: 4,
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      border: "1px solid",
      borderColor: "grey.100",
    }}
  >
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          sx={{ bgcolor: `${color}15`, color: color, width: 48, height: 48 }}
        >
          {icon}
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography
            variant="overline"
            sx={{
              color: "text.secondary",
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            {title}
          </Typography>
          {loading ? (
            <Skeleton width={100} height={40} />
          ) : (
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "text.primary" }}
            >
              {value}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <TrendingUpIcon sx={{ color: "success.main", fontSize: 16, mr: 0.5 }} />
        <Typography
          variant="caption"
          sx={{ color: "success.main", fontWeight: "bold" }}
        >
          Faol holatda
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    terms: 0,
    categories: 0,
    countries: 0,
    sources: 0,
  });
  const [recentTerms, setRecentTerms] = useState<TermSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          fetchAdminTerms(),
          fetchCategories(),
          fetchCountries(),
          fetchSources(),
        ]);

        const data = results.map((r) =>
          r.status === "fulfilled" ? r.value : [],
        );
        const terms = data[0] as TermSummary[];
        const categories = data[1];
        const countries = data[2];
        const sources = data[3];

        setStats({
          terms: Array.isArray(terms) ? terms.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          countries: Array.isArray(countries) ? countries.length : 0,
          sources: Array.isArray(sources) ? sources.length : 0,
        });

        // Get last 5 terms safely
        if (Array.isArray(terms)) {
          const sorted = [...terms].sort((a, b) => b.id - a.id).slice(0, 5);
          setRecentTerms(sorted);
        } else {
          setRecentTerms([]);
        }

        const failedCount = results.filter(
          (r) => r.status === "rejected",
        ).length;
        if (failedCount > 0) {
          logger.warn(`${failedCount} dashboard data pieces failed to load.`);
        }
      } catch (error) {
        logger.error("Critical error in dashboard loader:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <PageContainer maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#001c3b", mb: 1 }}
        >
          Boshqaruv paneli
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Lug&apos;at statistikasi va oxirgi yangilanishlar
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Umumiy terminlar"
            value={stats.terms}
            icon={<FormatColorTextIcon />}
            color="#2563eb"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Kategoriyalar"
            value={stats.categories}
            icon={<CategoryIcon />}
            color="#7c3aed"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Davlatlar"
            value={stats.countries}
            icon={<PublicIcon />}
            color="#059669"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Manbalar"
            value={stats.sources}
            icon={<MenuBookIcon />}
            color="#ea580c"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 0,
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "grey.100",
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid",
                borderColor: "grey.100",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#001c3b" }}
              >
                Oxirgi qo&apos;shilgan terminlar
              </Typography>
              <Link
                href="/admin/terms"
                passHref
                style={{ textDecoration: "none" }}
              >
                <Typography
                  variant="button"
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Barchasini ko&apos;rish
                </Typography>
              </Link>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Termin nomi
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Holat</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Amallar
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton width={200} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={40} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={80} />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton width={40} sx={{ ml: "auto" }} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : recentTerms.length > 0 ? (
                    recentTerms.map((term) => (
                      <TableRow key={term.id} hover>
                        <TableCell
                          sx={{ fontWeight: 600, color: "text.primary" }}
                        >
                          {term.title}
                        </TableCell>
                        <TableCell>#{term.id}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-block",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: "success.light",
                              color: "success.dark",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            Aktiv
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Link href={`/dictionary/${term.id}`} target="_blank">
                            <IconButton size="small" color="primary">
                              <KeyboardArrowRightIcon />
                            </IconButton>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Hech qanday termin topilmadi.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
