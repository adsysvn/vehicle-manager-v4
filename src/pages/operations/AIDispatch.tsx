import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Car, User, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Result {
  analysis: Record<string, any>;
  suggestions: { vehicle: any; driver: any; reason: string }[];
  warnings: string[];
  available: { vehicles: number; drivers: number };
}

export default function AIDispatch() {
  const [notes, setNotes] = useState("");
  const [pickup, setPickup] = useState("");
  const [hours, setHours] = useState("8");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    const { data, error } = await supabase.functions.invoke("ai-dispatch-suggest", {
      body: { notes, pickup_datetime: pickup ? new Date(pickup).toISOString() : null, duration_hours: Number(hours) },
    });
    setLoading(false);
    if (error) {
      let msg = error.message;
      try { msg = (await (error as any).context?.json())?.error ?? msg; } catch { /* ignore */ }
      setError(msg);
      toast.error(msg);
      return;
    }
    if (data?.error) { setError(data.error); return; }
    setResult(data);
  };

  const a = result?.analysis ?? {};
  const rows: [string, any][] = [
    ["Hành trình", a.itinerary], ["Điểm đón", a.pickup], ["Điểm đến", a.dropoff],
    ["Số khách", a.passengers], ["Loại xe cần", a.vehicle_type], ["Số xe cần", a.vehicles_needed],
    ["Ước tính km", a.estimated_km], ["Lưu ý", a.special_notes],
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="h-6 w-6 text-primary" /> Trợ lý AI phân xe</h1>
        <p className="text-muted-foreground">Nhập yêu cầu/ghi chú booking, AI sẽ phân tích và đề xuất xe, lái xe đang rảnh phù hợp.</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label>Yêu cầu / ghi chú booking</Label>
            <Textarea rows={5} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Đoàn 25 khách công ty ABC, đón tại sân bay Nội Bài đi Hạ Long 2 ngày 1 đêm, có nhiều hành lý..." />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Thời gian đón</Label><Input type="datetime-local" value={pickup} onChange={(e) => setPickup(e.target.value)} /></div>
            <div><Label>Thời lượng (giờ)</Label><Input type="number" min={1} value={hours} onChange={(e) => setHours(e.target.value)} /></div>
          </div>
          <Button onClick={analyze} disabled={loading || notes.trim().length < 5}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? "Đang phân tích..." : "Phân tích & đề xuất"}
          </Button>
          {!pickup && <p className="text-xs text-muted-foreground">Nên nhập thời gian đón để loại trừ xe/lái xe đã có lịch.</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Phân tích yêu cầu</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {rows.filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3"><span className="text-muted-foreground">{k}</span><span className="font-medium text-right">{String(v)}</span></div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">Khả dụng: {result.available.vehicles} xe, {result.available.drivers} lái xe</p>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Đề xuất xe & lái xe</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {result.warnings.map((w, i) => (
                <div key={i} className="flex gap-2 text-sm rounded-md border border-destructive/40 bg-destructive/10 p-2"><AlertTriangle className="h-4 w-4 text-destructive shrink-0" />{w}</div>
              ))}
              {result.suggestions.length === 0 && <p className="text-sm text-muted-foreground">Không có đề xuất phù hợp — cân nhắc gửi yêu cầu cho xe cộng tác viên.</p>}
              {result.suggestions.map((s, i) => (
                <div key={i} className="rounded-lg border p-3 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge>#{i + 1}</Badge>
                    <span className="flex items-center gap-1 font-medium"><Car className="h-4 w-4" />{s.vehicle.plate} · {s.vehicle.name} · {s.vehicle.seats} chỗ</span>
                    {s.driver && <span className="flex items-center gap-1 text-sm"><User className="h-4 w-4" />{s.driver.name} (bằng {s.driver.license}, ★{s.driver.rating})</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{s.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
