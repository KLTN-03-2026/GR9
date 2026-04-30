import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const logs = [
  {
    event: "Global Password Policy Updated",
    detail: "Minimum character requirements changed to 14 characters.",
    actor: "System Admin",
    time: "Today, 11:15 AM",
  },
  {
    event: "Database Backup Triggered",
    detail: "Manual backup initiated for the primary content cluster.",
    actor: "System Admin",
    time: "Yesterday, 09:30 PM",
  },
  {
    event: "External IP Blocked",
    detail: "Suspicious traffic pattern detected from an untrusted range.",
    actor: "System Auto-Action",
    time: "Apr 27, 02:14 AM",
  },
];

export default function AdminActivityLogs() {
  return (
    <Card className="border-outline-variant/20 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>System Activity Logs</CardTitle>
        <CardDescription>
          Recent administrative actions and automated security events.
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Download Log
          </Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.event}>
                <TableCell>
                  <div className="font-semibold text-slate-900">
                    {log.event}
                  </div>
                  <div className="text-xs text-slate-500">{log.detail}</div>
                </TableCell>
                <TableCell>{log.actor}</TableCell>
                <TableCell className="text-right text-slate-500">
                  {log.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
