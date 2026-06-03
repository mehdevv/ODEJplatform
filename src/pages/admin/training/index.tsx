import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListTrainingPrograms, useReviewTrainingProgram } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useState } from "react";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function AdminTrainingPrograms() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const reviewMutation = useReviewTrainingProgram();

  const { data: res, isLoading, refetch } = useListTrainingPrograms({
    search: search || undefined,
    status: status !== "all" ? (status as import("@/lib/api").TrainingProgramStatus) : undefined,
    page,
    limit: 15,
  });

  const quickPublish = async (id: number) => {
    await reviewMutation.mutateAsync({ id, data: { action: "publish" } });
    refetch();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("training.adminTitle")}</h1>
        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pr-10"
                placeholder={t("training.searchPlaceholder")}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                <SelectItem value="submitted">{t("training.status.submitted")}</SelectItem>
                <SelectItem value="approved">{t("training.status.approved")}</SelectItem>
                <SelectItem value="published">{t("training.status.published")}</SelectItem>
                <SelectItem value="rejected">{t("training.status.rejected")}</SelectItem>
                <SelectItem value="draft">{t("training.status.draft")}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">{t("training.fieldTitle")}</TableHead>
                  <TableHead className="text-right">{t("club.orgName")}</TableHead>
                  <TableHead className="text-right">{t("training.statusLabel")}</TableHead>
                  <TableHead className="text-right">{t("training.fieldStart")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ) : (
                  res?.data.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>{p.clubName ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{t(`training.status.${p.status}`)}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(p.startDate).toLocaleDateString("ar-DZ")}
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Link href={`/admin/training-programs/${p.id}`}>
                          <Button size="sm" variant="outline">
                            {t("training.review")}
                          </Button>
                        </Link>
                        {p.status === "approved" && (
                          <Button size="sm" onClick={() => quickPublish(p.id)}>
                            {t("training.publish")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
