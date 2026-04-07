import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TourHeroCard = () => {
  return (
    <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
      <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-start relative">
        <div className="w-full md:w-1/3 aspect-[4/5] rounded-2xl overflow-hidden shadow-md">
          <img 
            alt="Tour" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF" 
          />
        </div>
        
        <div className="flex-1 space-y-6 w-full">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-teal-600 mb-1 block">Coastal Elegance</span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Da Nang 3D2N: Coastal Elegance</h1>
            </div>
            <Badge className="bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-50 gap-1.5 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" />
              Ongoing
            </Badge>
          </div>

          <div className="flex items-center gap-4 py-4 border-y border-slate-100">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
              <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0BfviMsRmGSM1xnCOiLAjEB-Xdb5zdVkaJer9i8EJDmcHyk3B_cx3NNEUzYZx5eeXLb3knh4GSyKV1fU2pKt6dX7NkkJOM-qqssY1oLkNGpRLgm3AiSVVcnGdAVSqgMJeL-mStHglR2Rc9V12kuRO9iwN7ZjrDqchBTD7BWXOm-mCLk6H7Q8mnXUOH5vIX9avqy2wQ7x_g34-VVu4BanY1QQ1qVm-2_PkEjdf_nz1PHmI3pTuP8jQkRkJa9qDZRvYGjv8ySp5VHSG" />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Professional Guide</p>
              <p className="font-bold text-slate-900">Tran Thi Mai Chau</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-900">Day 2 of 3</span>
              <span className="text-xs font-bold text-teal-600">40% Completed</span>
            </div>
            <Progress value={40} className="h-2.5 bg-slate-100" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourHeroCard;