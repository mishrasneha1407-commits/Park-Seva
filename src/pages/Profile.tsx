import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Name:</span> {profile?.full_name || "-"}</div>
            <div><span className="font-medium">Email:</span> {user?.email || "-"}</div>
            <div><span className="font-medium">Role:</span> {profile?.role || "user"}</div>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={signOut}>Sign out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


