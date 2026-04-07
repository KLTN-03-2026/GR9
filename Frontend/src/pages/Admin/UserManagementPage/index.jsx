import React from "react";
import FilterSelect from "./FilterSelect";
import UserDataGrid from "./UserDataGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ShieldAlert, Sparkles } from "lucide-react"; // Thay icon mới

const mockUsers = [
  {
    id: 1,
    name: "Elena Rodriguez",
    email: "elena.rodriguez@example.com",
    role: "Traveler",
    status: "Active",
    date: "Oct 24, 2023",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuACxN4w0Rte3WFyQXfczPeS_GVCqKCno1C4X28PUA4NFGwEFv8coag8oy85PbhrzLT71CPJEDwMyKjgOIQjwSx4BXA4it6U3GiLaO5MOBT-OXa5ozy-GJRJe5AlPBImruz1ePEa3lvItHvzz29aqlZx5n7vOlLcNG6PJ-zUDpg1LgbGWPh-vFMun6b3QqDDrxCmKp99AHUV5LXC5EmLJwzSqZ5BVMiuzoDBntUilHbYjeU_0jMlbYPDvwMyUeSbl6cbxkR70RB_4M6E",
  },
  {
    id: 2,
    name: "Marco Valenti",
    email: "marco@skylinetours.com",
    role: "Provider",
    status: "Pending",
    date: "Nov 12, 2023",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVEP3x9cWfobPB6CGLhyfowINEsyCYHM6h6Vt7nAc5JRPXGFthH3Yu6zPY846Vnegs7IbN2vCaru85vMV9nPDhp0QeNLlfEa62uAwV1d9ou-W-Qd6hpqsUNOuzcpzW0mNHPU_mbHEi6CP0c_0Ur1KM8D8hLjjx5XI4_2u7EaUZppaNLBI_H24qSPV2OZOf9ayZFZu8kdhf9Zc7veP0Jv_ImLWfQ7-4Jd17oyg-9jzq50r40Gs8shuHSwy8j8TX4YCqSK73xlWyLAKC",
  },
  {
    id: 3,
    name: "Thomas K.",
    email: "thomas.k@junkmail.net",
    role: "Traveler",
    status: "Banned",
    date: "Aug 05, 2023",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADKps97TefsMcbCIZW4uCBfQPvdnrmVhr5Je-l1jLLXLWUmIummnK1weVWtRpJiVOSCN05cwSJGni-Eok-EHDBBP_io7N6O6A9eGGg5J2jSy_yuvQnJlWXVHWiSVK2cOuyp33MRUItJVMbQ8qSjdYwL0iubz1kAXGHaKG777WVwX-ou6zHiUEkZn12iJsu89AJ3WYVOloiKrRqZPaqpNCD1bpcG6Erk1KWQQ5P5xisv1rlO50RwGZ5AD-pCNFhTTPo32qBjNI38xRB",
  },
  {
    id: 4,
    name: "Alex Rivera",
    email: "alex.rivera@premium.com",
    role: "Admin",
    status: "Active",
    date: "Jan 10, 2023",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYDY9E5J8_8l7x3ZlZWcz0DQKpGun-uCOsnIb8UNmBI243HtWVm6hXTLGX74UmXnrrYKSAAe2GDu7uEvdaeuzxpa9Nb4wvS1-AvrL-8YZibp7QGX_jsTzO1YUAq-DNWSKP3K4eGDVw7HIMzvXE0WiXRIXhlZAphUhXRbqsGQMj2p-AxuKUw4GYYOLnE3p3so7IVfHm-2T4JdEPhxsu-opHFlMD4yrh7Sm0-51kum6Zj2HjkpGVCBiX63mB2BJXl2wKq2SVJtoq4uHs",
  },
];

const UserManagementPage = () => {
  return (
    <div className="pt-24 pb-12 max-w-[1600px] mx-auto space-y-8">
      <FilterSelect />

      <UserDataGrid users={mockUsers} />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-8 flex flex-col justify-between h-full">
            <div className="flex items-center gap-3 mb-4 text-teal-600">
              <TrendingUp className="h-5 w-5" />
              <p className="text-[11px] font-bold uppercase tracking-wider">
                User Growth
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">+24%</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                More signups than last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-8 flex flex-col justify-between h-full">
            <div className="flex items-center gap-3 mb-4 text-orange-600">
              <ShieldAlert className="h-5 w-5" />
              <p className="text-[11px] font-bold uppercase tracking-wider">
                Suspicious Logs
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">12</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Pending security reviews
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-3xl bg-teal-900 border-none text-white md:col-span-2 shadow-lg">
          <CardContent className="p-8 relative z-10 h-full flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                Automated Moderation
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                Voyager AI Guard Active
              </h2>
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl text-xs font-bold px-6 h-10 shadow-none"
              >
                Adjust AI Sensitivity
              </Button>
            </div>
          </CardContent>

          <Sparkles className="absolute -right-6 -bottom-6 size-40 text-white opacity-10 rotate-12" />
        </Card>
      </section>
    </div>
  );
};

export default UserManagementPage;
