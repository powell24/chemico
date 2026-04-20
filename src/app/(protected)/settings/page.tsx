import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield } from "lucide-react"


function SettingRow({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{value}</p>
      </div>
      {badge && <Badge variant="outline" className="text-xs">{badge}</Badge>}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and application preferences</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Account</CardTitle>
          </div>
          <CardDescription>Your profile and organization details</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <SettingRow label="Name" value="Leon C. Richardson" badge="Admin" />
          <Separator />
          <SettingRow label="Email" value="leon@thechemicogroup.com" />
          <Separator />
          <SettingRow label="Organization" value="The Chemico Group" />
          <Separator />
          <SettingRow label="Role" value="Compliance Administrator" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
          <CardDescription>Alert and reporting notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <SettingRow label="Critical Alerts" value="Immediate email notification on critical compliance alerts" badge="Enabled" />
          <Separator />
          <SettingRow label="Weekly Digest" value="Summary of open alerts and compliance score changes" badge="Enabled" />
          <Separator />
          <SettingRow label="Report Ready" value="Notify when a scheduled report is generated" badge="Enabled" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Compliance</CardTitle>
          </div>
          <CardDescription>Regulatory frameworks and reporting standards</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <SettingRow label="SARA Title III" value="Emergency Planning and Community Right-to-Know Act" badge="Active" />
          <Separator />
          <SettingRow label="VOC Reporting" value="Clean Air Act — volatile organic compound thresholds" badge="Active" />
          <Separator />
          <SettingRow label="ISO 9001:2015" value="Quality management system certification tracking" badge="Active" />
        </CardContent>
      </Card>

    </div>
  )
}
