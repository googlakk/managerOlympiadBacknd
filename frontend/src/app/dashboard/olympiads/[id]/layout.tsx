
// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { getCategoryId, getOlympiadById } from "@/data/loaders";

// import { Button } from "@/components/ui/button";
// import { CarTaxiFront } from "lucide-react";
// import { Category } from "@/store/useOlympiadsStore";
// import { Label } from "@/components/ui/label";
// import OlympiadRoute from "./page";

// interface LayoutProps {
//   params: {
//     id: string;
//   };
// }

// export default function DashboardLayout({ params }: LayoutProps) {
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [categoryData, setCategorydata] = useState<Category>();

//   useEffect(() => {
//     const getData = async () => {
//       const data = await getOlympiadById(params.id);
//       const categories = data.disciplines.flatMap((dis) =>
//         dis.categories.flatMap((cat) => cat)
//       );
//       setCategories(categories);
//     };
//     getData();
//   }, [selectedCategoryId]);

//   const onChangeCategory = (value: string) => {
//     setSelectedCategoryId(value);
//     const category = categories.filter((cat) => cat.documentId === value);
//     setCategorydata(category[0]);
//   };

//   return (
//     <div className="h-screen grid grid-cols-[240px_1fr]">
//       <nav className="border-r h-fit pt-3 py-10 rounded-md ml-2 shadow-md">
//         <div className="flex h-full max-h-screen flex-col gap-2">
//           <div className="flex-1 overflow-auto py-2">
//             <nav className="grid items-start px-4 text-sm font-medium">
//               <div>
//                 <Label className="">Выберите категорию</Label>
//                 <div className="mt-2">
//                   <Select onValueChange={onChangeCategory}>
//                     <SelectTrigger className="w-[180px]">
//                       <SelectValue placeholder="Категория" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.map((cat, idx) => (
//                         <SelectItem key={idx} value={`${cat.documentId}`}>
//                           {cat.heading}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </nav>
//       <main className="flex flex-col overflow-scroll items-center">
//         {categoryData ? (
//           <OlympiadRoute params={params} selectedCategory={categoryData} />
//         ) : (
//           <div>
//             <p>Выберите категорию</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Category } from "@/store/useOlympiadsStore";
import { Label } from "@/components/ui/label";
import OlympiadRoute from "./OlympiadRoute"; // Компонент логики
import { getOlympiadById } from "@/data/loaders";

interface LayoutProps {
  params: {
    id: string;
  };
}

export default function DashboardLayout({ params }: LayoutProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Загружаем данные при монтировании
  useEffect(() => {
    const getData = async () => {
      const data = await getOlympiadById(params.id);
      const categories = data.disciplines.flatMap((dis) =>
        dis.categories.flatMap((cat) => cat)
      );
      setCategories(categories);
    };
    getData();
  }, [params.id]);

  const onChangeCategory = (value: string) => {
    setSelectedCategoryId(value);
    const category = categories.find((cat) => cat.documentId === value);
    setSelectedCategory(category || null);
  };

  return (
    <div className="h-screen grid grid-cols-[240px_1fr]">
      <nav className="border-r h-fit pt-3 py-10 rounded-md ml-2 shadow-md">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <div>
                <Label className="">Выберите категорию</Label>
                <div className="mt-2">
                  <Select onValueChange={onChangeCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat, idx) => (
                        <SelectItem key={idx} value={`${cat.documentId}`}>
                          {cat.heading}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </nav>
      <main className="flex flex-col overflow-scroll items-center">
        {selectedCategory ? (
          <OlympiadRoute
            params={params}
            selectedCategory={selectedCategory} // Передаем выбранную категорию
          />
        ) : (
          <div>
            <p>Выберите категорию</p>
          </div>
        )}
      </main>
    </div>
  );
}
