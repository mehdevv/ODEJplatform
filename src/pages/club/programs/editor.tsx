import { ClubLayout } from "@/components/layout/ClubLayout";
import {
  useCreateTrainingProgram,
  useGetTrainingProgram,
  useSubmitTrainingProgram,
  useUpdateTrainingProgram,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { WILAYAS } from "@/data/wilayas";
import type { TrainingProgramFormat, TrainingProgramLevel } from "@/lib/api";

export default function ClubProgramEditor() {
  const { t } = useTranslation();
  const params = useParams<{ id?: string }>();
  const isNew = !params.id || params.id === "new";
  const programId = !isNew ? parseInt(params.id!, 10) : null;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: existing } = useGetTrainingProgram(String(programId ?? ""), {
    query: { enabled: !!programId },
  });

  const createMutation = useCreateTrainingProgram();
  const updateMutation = useUpdateTrainingProgram();
  const submitMutation = useSubmitTrainingProgram();

  const [form, setForm] = useState({
    title: "",
    descriptionAr: "",
    wilayaCode: "06",
    format: "workshop" as TrainingProgramFormat,
    level: "all" as TrainingProgramLevel,
    capacity: 20,
    startDate: "",
    endDate: "",
    location: "",
    featuredImage: "",
  });

  useEffect(() => {
    if (existing && programId) {
      setForm({
        title: existing.title,
        descriptionAr: existing.descriptionAr ?? existing.description ?? "",
        wilayaCode: existing.wilayaCode,
        format: existing.format,
        level: existing.level,
        capacity: existing.capacity,
        startDate: existing.startDate.slice(0, 16),
        endDate: existing.endDate?.slice(0, 16) ?? "",
        location: existing.location,
        featuredImage: existing.featuredImage ?? "",
      });
    }
  }, [existing, programId]);

  const readOnly =
    existing && !["draft", "rejected"].includes(existing.status);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      descriptionAr: form.descriptionAr,
      wilayaCode: form.wilayaCode,
      format: form.format,
      level: form.level,
      capacity: form.capacity,
      startDate: new Date(form.startDate).toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      location: form.location,
      featuredImage: form.featuredImage || undefined,
    };
    try {
      if (isNew) {
        const created = await createMutation.mutateAsync({ data: payload });
        toast({ title: t("club.programSaved") });
        setLocation(`/club/programs/${created.id}/edit`);
      } else if (programId) {
        await updateMutation.mutateAsync({ id: programId, data: payload });
        toast({ title: t("club.programSaved") });
      }
    } catch (error: unknown) {
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!programId) return;
    try {
      await submitMutation.mutateAsync(programId);
      toast({ title: t("club.programSubmitted") });
      setLocation("/club/programs");
    } catch (error: unknown) {
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    }
  };

  return (
    <ClubLayout>
      <Card>
        <CardHeader>
          <CardTitle>
            {isNew ? t("club.newProgram") : t("club.editProgram")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
            <div className="space-y-2">
              <Label>{t("training.fieldTitle")}</Label>
              <Input
                required
                disabled={readOnly}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("training.fieldDescription")}</Label>
              <Textarea
                rows={4}
                disabled={readOnly}
                value={form.descriptionAr}
                onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("training.formatLabel")}</Label>
                <Select
                  disabled={readOnly}
                  value={form.format}
                  onValueChange={(v) =>
                    setForm({ ...form, format: v as TrainingProgramFormat })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">{t("training.format.workshop")}</SelectItem>
                    <SelectItem value="course">{t("training.format.course")}</SelectItem>
                    <SelectItem value="camp">{t("training.format.camp")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("training.levelLabel")}</Label>
                <Select
                  disabled={readOnly}
                  value={form.level}
                  onValueChange={(v) =>
                    setForm({ ...form, level: v as TrainingProgramLevel })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("training.level.all")}</SelectItem>
                    <SelectItem value="beginner">{t("training.level.beginner")}</SelectItem>
                    <SelectItem value="intermediate">{t("training.level.intermediate")}</SelectItem>
                    <SelectItem value="advanced">{t("training.level.advanced")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("training.fieldStart")}</Label>
                <Input
                  type="datetime-local"
                  required
                  disabled={readOnly}
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("training.fieldEnd")}</Label>
                <Input
                  type="datetime-local"
                  disabled={readOnly}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("club.wilaya")}</Label>
                <Select
                  disabled={readOnly}
                  value={form.wilayaCode}
                  onValueChange={(v) => setForm({ ...form, wilayaCode: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WILAYAS.map((w) => (
                      <SelectItem key={w.code} value={w.code}>
                        {w.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("training.fieldCapacity")}</Label>
                <Input
                  type="number"
                  min={1}
                  disabled={readOnly}
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: parseInt(e.target.value, 10) || 1 })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("training.fieldLocation")}</Label>
              <Input
                required
                disabled={readOnly}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            {!readOnly && (
              <div className="flex flex-wrap gap-3 pt-4">
                <Button type="submit">{t("common.save")}</Button>
                {programId && (
                  <Button type="button" variant="secondary" onClick={handleSubmit}>
                    {t("club.submitForReview")}
                  </Button>
                )}
                <Link href="/club/programs">
                  <Button type="button" variant="outline">
                    {t("common.cancel")}
                  </Button>
                </Link>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </ClubLayout>
  );
}
