import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-3">
      {["Basic", "Standard", "Premium"].map((tier, i) => (
        <Card key={tier}>
          <CardHeader>
            <CardTitle>{tier}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">₹{(i + 1) * 99}/mo</div>
            <div className="text-sm text-muted-foreground">Example plan for demo</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


