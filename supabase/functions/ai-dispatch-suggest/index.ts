import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-lovable-aig-run-id",
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID",
};
const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, ...extra, "Content-Type": "application/json" },
  });

const MODEL = "openai/gpt-6-astra";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/responses";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "Chưa cấu hình Lovable AI" }, 500);
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Chưa đăng nhập" }, 401);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return json({ error: "Phiên đăng nhập không hợp lệ" }, 401);

    const { notes, pickup_datetime, duration_hours } = await req.json();
    if (!notes || typeof notes !== "string" || notes.trim().length < 5)
      return json({ error: "Vui lòng nhập yêu cầu booking" }, 400);

    const start = pickup_datetime ? new Date(pickup_datetime) : null;
    const hours = Number(duration_hours) > 0 ? Number(duration_hours) : 8;
    const end = start ? new Date(start.getTime() + hours * 3600_000) : null;

    const [{ data: vehicles }, { data: drivers }, { data: assigns }] = await Promise.all([
      supabase.from("vehicles").select("id, license_plate, brand, model, seats, status, fuel_type, priority"),
      supabase.from("drivers").select("id, license_type, status, rating, experience_years, total_trips, profiles!drivers_profile_id_fkey(full_name)"),
      supabase
        .from("vehicle_assignments")
        .select("vehicle_id, driver_id, start_time, end_time, bookings(pickup_datetime, estimated_duration, status)"),
    ]);

    const busyV = new Set<string>();
    const busyD = new Set<string>();
    if (start && end) {
      for (const a of (assigns ?? []) as any[]) {
        if (a.bookings?.status === "cancelled" || a.bookings?.status === "completed") continue;
        const s = new Date(a.start_time ?? a.bookings?.pickup_datetime);
        const e = a.end_time
          ? new Date(a.end_time)
          : new Date(s.getTime() + ((a.bookings?.estimated_duration ?? 480) * 60_000));
        if (isNaN(s.getTime())) continue;
        if (s < end && e > start) {
          busyV.add(a.vehicle_id);
          busyD.add(a.driver_id);
        }
      }
    }

    const vList = (vehicles ?? [])
      .filter((v: any) => v.status !== "maintenance" && v.status !== "retired" && !busyV.has(v.id))
      .map((v: any) => ({ id: v.id, plate: v.license_plate, name: `${v.brand} ${v.model}`, seats: v.seats, priority: v.priority ?? null, fuel: v.fuel_type }));
    const dList = (drivers ?? [])
      .filter((d: any) => d.status !== "off_duty" && d.status !== "inactive" && !busyD.has(d.id))
      .map((d: any) => ({ id: d.id, name: d.profiles?.full_name ?? "N/A", license: d.license_type, rating: d.rating, years: d.experience_years, trips: d.total_trips }));

    const prompt = `Bạn là trợ lý điều hành xe du lịch tại Việt Nam. Phân tích yêu cầu booking và đề xuất xe, lái xe phù hợp CHỈ từ danh sách khả dụng.
Quy tắc: số chỗ xe phải >= số khách (cộng 1-2 chỗ dư nếu có hành lý/hướng dẫn viên). Nếu đoàn lớn hơn 1 xe, đề xuất nhiều xe. Ưu tiên xe có priority nhỏ hơn, xe vừa đủ chỗ (không quá lớn). Lái xe: bằng phù hợp (xe >9 chỗ cần bằng D, >30 chỗ cần E), ưu tiên rating và kinh nghiệm, tuyến dài/đèo núi chọn lái xe nhiều kinh nghiệm.
Trả về DUY NHẤT một JSON object (không markdown) dạng:
{"analysis":{"itinerary":string,"pickup":string,"dropoff":string,"passengers":number,"vehicle_type":string,"vehicles_needed":number,"estimated_km":number|null,"special_notes":string},"suggestions":[{"vehicle_id":string,"driver_id":string,"reason":string}],"warnings":[string]}
Viết bằng tiếng Việt, ngắn gọn. Tối đa 5 đề xuất.

Yêu cầu booking: """${notes.slice(0, 4000)}"""
Thời gian đón: ${start ? start.toISOString() : "chưa rõ"} (thời lượng ~${hours}h)
Xe khả dụng: ${JSON.stringify(vList)}
Lái xe khả dụng: ${JSON.stringify(dList)}`;

    const incomingRun = req.headers.get("X-Lovable-AIG-Run-ID")?.trim();
    const upstream = await fetch(GATEWAY, {
      method: "POST",
      signal: req.signal,
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
        ...(incomingRun ? { "X-Lovable-AIG-Run-ID": incomingRun } : {}),
      },
      body: JSON.stringify({
        model: MODEL,
        input: prompt,
        stream: true,
        store: false,
        reasoning: { effort: "low", summary: "auto" },
        include: ["reasoning.encrypted_content"],
      }),
    });
    const runId = upstream.headers.get("X-Lovable-AIG-Run-ID");
    const extra: Record<string, string> = runId ? { "X-Lovable-AIG-Run-ID": runId } : {};

    if (!upstream.ok || !upstream.body) {
      const t = await upstream.text();
      let msg = "Lỗi dịch vụ AI";
      try { msg = JSON.parse(t)?.error?.message ?? JSON.parse(t)?.message ?? msg; } catch { /* ignore */ }
      if (upstream.status === 429) msg = "AI đang quá tải, vui lòng thử lại sau ít phút.";
      if (upstream.status === 402) msg = "Đã hết hạn mức Lovable AI. Vui lòng nạp thêm credits trong cài đặt workspace.";
      console.error("gateway error", upstream.status, t);
      return json({ error: msg }, upstream.status, extra);
    }

    // Consume SSE stream server-side
    const reader = upstream.body.getReader();
    const dec = new TextDecoder();
    let buf = "", text = "", failed: string | null = null;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 1);
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const ev = JSON.parse(data);
          if (ev.type === "response.output_text.delta") text += ev.delta ?? "";
          else if (ev.type === "response.failed" || ev.type === "error")
            failed = ev.response?.error?.message ?? ev.error?.message ?? ev.message ?? "AI thất bại";
        } catch { /* partial */ }
      }
    }
    if (failed) return json({ error: failed }, 502, extra);
    if (!text.trim()) return json({ error: "AI không trả về kết quả" }, 502, extra);

    const m = text.match(/\{[\s\S]*\}/);
    let parsed: any;
    try { parsed = JSON.parse(m ? m[0] : text); } catch {
      return json({ error: "Không đọc được kết quả AI", raw: text }, 502, extra);
    }

    const vMap = new Map(vList.map((v) => [v.id, v]));
    const dMap = new Map(dList.map((d) => [d.id, d]));
    const suggestions = (Array.isArray(parsed.suggestions) ? parsed.suggestions : [])
      .slice(0, 5)
      .map((s: any) => ({ vehicle: vMap.get(s.vehicle_id) ?? null, driver: dMap.get(s.driver_id) ?? null, reason: String(s.reason ?? "") }))
      .filter((s: any) => s.vehicle);

    return json({
      analysis: parsed.analysis ?? {},
      suggestions,
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
      available: { vehicles: vList.length, drivers: dList.length },
    }, 200, extra);
  } catch (e) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Lỗi không xác định" }, 500);
  }
});
