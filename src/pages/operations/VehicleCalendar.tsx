import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { addDays, format, startOfDay } from "date-fns";
import { vi } from "date-fns/locale";

interface Slot { booking: string; customer?: string; route: string; driver?: string; start: Date; end: Date; status: string }

const DAYS = 7;

export default function VehicleCalendar() {
  const [from, setFrom] = useState(startOfDay(new Date()));
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [assigns, setAssigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{ v: any; day: Date; slots: Slot[] } | null>(null);

  const days = useMemo(() => Array.from({ length: DAYS }, (_, i) => addDays(from, i)), [from]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [{ data: v }, { data: a }] = await Promise.all([
        supabase.from("vehicles").select("id, license_plate, brand, model, seats, status").order("seats"),
        supabase.from("vehicle_assignments").select(
          "vehicle_id, start_time, end_time, bookings(booking_number, pickup_location, dropoff_location, pickup_datetime, estimated_duration, status, customers!bookings_customer_id_fkey(name)), drivers!vehicle_assignments_driver_id_fkey(profiles!drivers_profile_id_fkey(full_name))"
        ),
      ]);
      setVehicles(v ?? []);
      setAssigns(a ?? []);
      setLoading(false);
    })();
  }, []);

  const slotsByVehicle = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const a of assigns as any[]) {
      const b = a.bookings;
      if (!b || b.status === "cancelled") continue;
      const start = new Date(a.start_time ?? b.pickup_datetime);
      const end = a.end_time ? new Date(a.end_time) : new Date(start.getTime() + (b.estimated_duration ?? 480) * 60000);
      const s: Slot = { booking: b.booking_number, customer: b.customers?.name, route: `${b.pickup_location} → ${b.dropoff_location}`, driver: a.drivers?.profiles?.full_name, start, end, status: b.status };
      map.set(a.vehicle_id, [...(map.get(a.vehicle_id) ?? []), s]);
    }
    return map;
  }, [assigns]);

  const slotsOn = (vid: string, day: Date) => {
    const ds = day.getTime(), de = addDays(day, 1).getTime();
    return (slotsByVehicle.get(vid) ?? []).filter((s) => s.start.getTime() < de && s.end.getTime() > ds);
  };

  const filtered = vehicles.filter((v) => `${v.license_plate} ${v.brand} ${v.model} ${v.seats}`.toLowerCase().includes(search.toLowerCase()));
  const today = startOfDay(new Date()).getTime();
  const freeToday = vehicles.filter((v) => v.status !== "maintenance" && slotsOn(v.id, startOfDay(new Date())).length === 0).length;

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><CalendarDays className="h-6 w-6 text-primary" /> Lịch xe</h1>
          <p className="text-muted-foreground">Tình trạng phân xe và lịch trống của từng xe theo ngày · Hôm nay còn trống {freeToday}/{vehicles.length} xe</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setFrom(addDays(from, -DAYS))}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" onClick={() => setFrom(startOfDay(new Date()))}>Hôm nay</Button>
          <Input type="date" className="w-40" value={format(from, "yyyy-MM-dd")} onChange={(e) => e.target.value && setFrom(startOfDay(new Date(e.target.value)))} />
          <Button variant="outline" size="icon" onClick={() => setFrom(addDays(from, DAYS))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input placeholder="Tìm biển số, hãng, số chỗ..." className="max-w-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-primary/80" /> Có chuyến</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded border bg-background" /> Trống</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-muted" /> Bảo dưỡng</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 min-w-[180px] sticky left-0 bg-muted">Xe</th>
                  {days.map((d) => (
                    <th key={d.toISOString()} className={`p-2 min-w-[130px] text-center font-medium ${d.getTime() === today ? "text-primary" : ""}`}>
                      <div className="capitalize">{format(d, "EEE", { locale: vi })}</div>
                      <div className="text-xs text-muted-foreground">{format(d, "dd/MM")}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} className="border-t">
                    <td className="p-3 sticky left-0 bg-card">
                      <div className="font-medium">{v.license_plate}</div>
                      <div className="text-xs text-muted-foreground">{v.brand} {v.model} · {v.seats} chỗ</div>
                    </td>
                    {days.map((d) => {
                      const slots = slotsOn(v.id, d);
                      const maint = v.status === "maintenance";
                      return (
                        <td key={d.toISOString()} className="p-1 align-top">
                          <button
                            onClick={() => setSelected({ v, day: d, slots })}
                            className={`w-full min-h-[56px] rounded-md p-1.5 text-left text-xs transition-colors ${
                              maint ? "bg-muted text-muted-foreground" : slots.length ? "bg-primary/80 text-primary-foreground hover:bg-primary" : "border border-dashed hover:bg-accent"
                            }`}
                          >
                            {maint ? "Bảo dưỡng" : slots.length ? (
                              slots.slice(0, 2).map((s, i) => (
                                <div key={i} className="truncate">{format(s.start, "HH:mm")} {s.booking}</div>
                              )).concat(slots.length > 2 ? [<div key="m">+{slots.length - 2} chuyến</div>] : [])
                            ) : <span className="text-muted-foreground">Trống</span>}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{selected.v.license_plate} · {format(selected.day, "EEEE dd/MM/yyyy", { locale: vi })}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Đóng</Button>
            </div>
            {selected.slots.length === 0 ? <p className="text-sm text-muted-foreground">Xe trống cả ngày.</p> : selected.slots.map((s, i) => (
              <div key={i} className="rounded-md border p-3 text-sm space-y-1">
                <div className="flex justify-between"><span className="font-medium">{s.booking} · {s.customer}</span><Badge variant="outline">{s.status}</Badge></div>
                <div>{s.route}</div>
                <div className="text-muted-foreground">{format(s.start, "dd/MM HH:mm")} – {format(s.end, "dd/MM HH:mm")} · Lái xe: {s.driver ?? "—"}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
