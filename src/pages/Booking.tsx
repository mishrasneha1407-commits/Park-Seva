import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";
import UPIPaymentModal from "@/components/UPIPaymentModal";
import { CreditCard, Smartphone } from "lucide-react";


type Slot = Tables<"slots"> & { lot?: Tables<"parking_lots"> };
type Lot = Tables<"parking_lots">;

function hoursBetween(startISO: string, endISO: string): number {
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
}

export default function BookingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { lotId: lotIdFromRoute } = useParams();
  const [vehiclePlate, setVehiclePlate] = useState("DEMO-1234");
  const [startTime, setStartTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [endTime, setEndTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    return d.toISOString().slice(0, 16);
  });
  const [selectedLotId, setSelectedLotId] = useState<string | undefined>(lotIdFromRoute);
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(undefined);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'upi'>('stripe');

  const fallbackSlots: Slot[] = [
    {
      id: "demo-slot-1",
      slot_number: "W-01",
      price_per_hour: 40,
      is_available: true,
      is_accessible: false,
      is_covered: true,
      ev_supported: "level2" as any,
      lot: { name: "Phoenix Marketcity Pune Parking", id: "demo-lot-1" } as any,
    } as Slot,
    {
      id: "demo-slot-2",
      slot_number: "S-05",
      price_per_hour: 35,
      is_available: true,
      is_accessible: false,
      is_covered: false,
      ev_supported: "none" as any,
      lot: { name: "FC Road Public Parking", id: "demo-lot-2" } as any,
    } as Slot,
    {
      id: "demo-slot-3",
      slot_number: "D-02",
      price_per_hour: 30,
      is_available: true,
      is_accessible: true,
      is_covered: true,
      ev_supported: "none" as any,
      lot: { name: "Shivajinagar Multi-level Parking", id: "demo-lot-3" } as any,
    } as Slot,
  ];

  // Load top 3 active lots
  const { data: lots, isLoading: isLoadingLots } = useQuery<Lot[]>({
    queryKey: ["active-lots-top3"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parking_lots")
        .select("id,name,address,hourly_rate")
        .eq("is_active", true)
        .limit(3);
      if (error) throw error;
      // Fallback: use distinct lots from fallbackSlots
      if (!data || data.length === 0) {
        const uniqueLots = Array.from(
          new Map(
            fallbackSlots.map((s) => [s.lot?.id as string, { id: s.lot?.id as string, name: s.lot?.name as string, address: "Demo Address", hourly_rate: s.price_per_hour }])
          ).values()
        ) as any as Lot[];
        return uniqueLots.slice(0, 3);
      }
      return data as Lot[];
    },
  });

  // Load slots for selected lot
  const { data: slots, isLoading: isLoadingSlots } = useQuery<Slot[]>({
    queryKey: ["slots-by-lot", selectedLotId],
    enabled: !!selectedLotId,
    queryFn: async () => {
      if (!selectedLotId) return [];
      try {
        const { data, error } = await supabase
          .from("slots")
          .select("*, parking_lots(*)")
          .eq("lot_id", selectedLotId)
          .eq("is_available", true)
          .limit(200);
        if (error) throw error;
        const mapped = (data as any[]).map((row) => ({ ...row, lot: row.parking_lots })) as Slot[];
        // If DB has some slots, also synthesize more for a richer grid (demo)
        if (mapped.length > 0) {
          const countToAdd = Math.max(0, 30 - mapped.length);
          const synthetic: Slot[] = Array.from({ length: countToAdd }).map((_, i) => ({
            id: `synthetic-${selectedLotId}-${i + 1}`,
            slot_number: `${i + 1}`.padStart(2, "0"),
            price_per_hour: mapped[0]?.price_per_hour ?? 30,
            is_available: true,
            is_accessible: i % 12 === 0,
            is_covered: i % 3 === 0,
            ev_supported: (i % 5 === 0 ? "level2" : "none") as any,
            lot: mapped[0]?.lot ?? { id: selectedLotId, name: "Selected Lot" } as any,
          })) as Slot[];
          return [...mapped, ...synthetic];
        }
        // fallback: from fallbackSlots matching lot, and expand to 30 for grid
        const base = fallbackSlots.filter((s) => s.lot?.id === selectedLotId);
        const countToAdd = Math.max(0, 30 - base.length);
        const synthetic: Slot[] = Array.from({ length: countToAdd }).map((_, i) => ({
          id: `synthetic-${selectedLotId}-${i + 1}`,
          slot_number: `${(base.length + i + 1)}`.padStart(2, "0"),
          price_per_hour: base[0]?.price_per_hour ?? 30,
          is_available: true,
          is_accessible: i % 12 === 0,
          is_covered: i % 3 === 0,
          ev_supported: (i % 5 === 0 ? "level2" : "none") as any,
          lot: base[0]?.lot ?? { id: selectedLotId, name: "Selected Lot" } as any,
        })) as Slot[];
        return [...base, ...synthetic];
      } catch (_) {
        const base = fallbackSlots.filter((s) => s.lot?.id === selectedLotId);
        const countToAdd = Math.max(0, 30 - base.length);
        const synthetic: Slot[] = Array.from({ length: countToAdd }).map((_, i) => ({
          id: `synthetic-${selectedLotId}-${i + 1}`,
          slot_number: `${(base.length + i + 1)}`.padStart(2, "0"),
          price_per_hour: base[0]?.price_per_hour ?? 30,
          is_available: true,
          is_accessible: i % 12 === 0,
          is_covered: i % 3 === 0,
          ev_supported: (i % 5 === 0 ? "level2" : "none") as any,
          lot: base[0]?.lot ?? { id: selectedLotId, name: "Selected Lot" } as any,
        })) as Slot[];
        return [...base, ...synthetic];
      }
    },
  });

  // When changing lot, reset selected slot
  useEffect(() => {
    setSelectedSlotId(undefined);
  }, [selectedLotId]);

  useEffect(() => {
    if (!selectedSlotId && slots && slots.length > 0) {
      setSelectedSlotId(slots[0].id);
    }
  }, [slots, selectedSlotId]);

  const selectedSlot = useMemo(() => slots?.find((s) => s.id === selectedSlotId), [slots, selectedSlotId]);

  const hours = useMemo(() => hoursBetween(startTime, endTime), [startTime, endTime]);
  const estimatedCost = useMemo(() => (selectedSlot ? hours * (selectedSlot.price_per_hour ?? 0) : 0), [hours, selectedSlot]);

  const createBooking = useMutation({
    mutationFn: async (paymentData?: { transactionId: string; paymentMode: string }) => {
      if (!selectedSlot) throw new Error("Please select a slot");
      const userId = user?.id || "00000000-0000-0000-0000-000000000001";

      const stripePk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
      let paymentIntentId: string | null = null;
      let paymentStatus: string = "pending";
      let paymentMode: string = "mock";
      let transactionId: string | null = null;

      if (paymentData) {
        // UPI payment
        paymentStatus = "paid";
        paymentMode = paymentData.paymentMode;
        transactionId = paymentData.transactionId;
      } else if (stripePk && paymentMethod === 'stripe') {
        // Stripe payment
        const stripe = await loadStripe(stripePk);
        if (!stripe) throw new Error("Stripe failed to load");

        const resp = await fetch("/functions/v1/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: estimatedCost }),
        });
        const json = await resp.json();
        if (!resp.ok) throw new Error(json.error || "Payment intent failed");

        const clientSecret = json.clientSecret as string;
        paymentIntentId = json.paymentIntentId as string;

        const result = await stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/book?paid=1`,
          },
        });
        if (result.error) throw new Error(result.error.message || "Payment confirmation failed");
        
        paymentStatus = "paid";
        paymentMode = "stripe";
        transactionId = paymentIntentId;
      } else {
        // Demo mode: no payment configured
        console.warn("No payment method configured. Proceeding in demo mode.");
        paymentStatus = "pending";
        paymentMode = "mock";
        transactionId = `MOCK-${Date.now()}`;
      }

      // If slot id is not a UUID (demo/synthetic), run in demo mode without DB writes
      const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
      if (!isUuid(selectedSlot.id)) {
        console.warn("Selected slot is synthetic/demo; skipping DB insert.");
        return { id: `DEMO-${Date.now()}` } as any;
      }

      let insertPayload: any = {
        slot_id: selectedSlot.id,
        user_id: userId,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        total_amount: estimatedCost,
        vehicle_plate: vehiclePlate,
        status: "confirmed",
        payment_status: paymentStatus as any,
        stripe_payment_intent_id: paymentIntentId,
        payment_mode: paymentMode,
        transaction_id: transactionId,
        qr_code_url: null,
      };

      let insertResp = await supabase
        .from("bookings")
        .insert([insertPayload])
        .select("id")
        .single();

      if (insertResp.error && /payment_mode|transaction_id/i.test(insertResp.error.message)) {
        // Retry without new columns for environments where migration hasn't run
        const fallbackPayload = { ...insertPayload };
        delete (fallbackPayload as any).payment_mode;
        delete (fallbackPayload as any).transaction_id;
        insertResp = await supabase
          .from("bookings")
          .insert([fallbackPayload])
          .select("id")
          .single();
      }

      if (insertResp.error) throw insertResp.error;
      const data = insertResp.data;

      await supabase.from("slots").update({ is_available: false }).eq("id", selectedSlot.id);

      // Fire-and-forget SMS notification (non-blocking for UI)
      const locationName = selectedSlot.lot?.name || "your selected parking lot";
      const message = `✅ Payment received for your booking via ${paymentMode.toUpperCase()}. Parking confirmed at ${locationName} from ${new Date(startTime).toLocaleString()} to ${new Date(endTime).toLocaleString()}.`;
      const profilePhone = "+911234567890"; // Replace with user's phone from profile if available
      try {
        await fetch("/functions/v1/send-sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: profilePhone, message }),
        });
      } catch (_) {
        // Ignore SMS errors in UI flow
      }

      return data;
    },
    onSuccess: () => {
      toast({ title: "Booking confirmed", description: "Payment received and slot reserved." });
    },
    onError: (e: any) => {
      toast({ title: "Booking failed", description: e.message, variant: "destructive" });
    },
  });

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Book a Parking Slot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Choose a lot (show only 3) */}
          {!selectedLotId ? (
            <div className="space-y-3">
              <Label>Select a Parking Lot</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(lots ?? []).map((lot) => (
                  <Card key={lot.id} className="cursor-pointer hover:shadow" onClick={() => setSelectedLotId(lot.id)}>
                    <CardHeader>
                      <CardTitle className="text-base">{lot.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">{(lot as any).address ?? ""}</div>
                      <div className="mt-2 text-sm">₹{lot.hourly_rate ?? 0}/hr</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {isLoadingLots && <div className="text-sm text-muted-foreground">Loading lots...</div>}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Available Slots</Label>
                <Button variant="ghost" onClick={() => setSelectedLotId(undefined)}>Change lot</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Graphical Slot Grid */}
                <div>
                  <Label className="mb-2 block">Pick a Slot</Label>
                  <div className="rounded-lg border p-3">
                    <div className="grid grid-cols-6 gap-2">
                      {(slots ?? []).slice(0, 36).map((s) => {
                        const isSelected = selectedSlotId === s.id;
                        const isUnavailable = s.is_available === false;
                        const isAccessible = s.is_accessible;
                        return (
                          <button
                            key={s.id}
                            disabled={isUnavailable}
                            onClick={() => setSelectedSlotId(s.id)}
                            className={
                              `h-10 rounded-md text-xs font-medium border transition-colors ` +
                              (isUnavailable
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : isSelected
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-card hover:bg-accent hover:text-accent-foreground') +
                              (isAccessible ? ' ring-1 ring-blue-300' : '')
                            }
                            title={`#${s.slot_number}`}
                          >
                            #{s.slot_number}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1"><span className="inline-block h-3 w-5 rounded bg-primary/80" /> Selected</div>
                      <div className="flex items-center gap-1"><span className="inline-block h-3 w-5 rounded bg-card border" /> Available</div>
                      <div className="flex items-center gap-1"><span className="inline-block h-3 w-5 rounded bg-muted" /> Unavailable</div>
                      <div className="flex items-center gap-1"><span className="inline-block h-3 w-5 rounded ring-1 ring-blue-300" /> Accessible</div>
                    </div>
                  </div>
                </div>

                {/* Booking details */}
                <div className="space-y-4">
                  <div>
                    <Label>Vehicle Plate</Label>
                    <Input className="mt-1" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} />
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      className="mt-1"
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input className="mt-1" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedLotId && (
            <div className="space-y-4">
              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant={paymentMethod === 'stripe' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('stripe')}
                    className="flex items-center justify-center gap-2 h-12"
                  >
                    <CreditCard className="w-4 h-4" />
                    Stripe
                  </Button>
                  <Button
                    variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('upi')}
                    className="flex items-center justify-center gap-2 h-12"
                  >
                    <Smartphone className="w-4 h-4" />
                    UPI
                  </Button>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-md p-3 gap-3">
                <div>
                  <div className="text-sm text-muted-foreground">Estimated</div>
                  <div className="font-medium">{hours} hour(s) • ₹{estimatedCost}</div>
                </div>
                <Button 
                  onClick={() => {
                    if (paymentMethod === 'upi') {
                      setShowUPIModal(true);
                    } else {
                      createBooking.mutate(undefined);
                    }
                  }} 
                  disabled={createBooking.isPending || !selectedSlotId}
                  className="w-full sm:w-auto"
                >
                  {createBooking.isPending ? "Processing..." : "Confirm & Pay"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* UPI Payment Modal */}
      <UPIPaymentModal
        isOpen={showUPIModal}
        onClose={() => setShowUPIModal(false)}
        amount={estimatedCost}
        onPaymentSuccess={(transactionId) => {
          setShowUPIModal(false);
          createBooking.mutate({ 
            transactionId, 
            paymentMode: 'UPI' 
          });
        }}
      />
    </div>
  );
}


