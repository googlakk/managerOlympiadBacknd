// "use client";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { getOlympiadById, getParticipantsByCategoryId } from "@/data/loaders";
// import { useEffect, useState } from "react";

// import { Button } from "@/components/ui/button";
// import { Category } from "@/store/useOlympiadsStore";
// import { Label } from "@/components/ui/label";
// import React from "react";

// interface LayoutProps {
//   children: React.ReactNode;
//   params: {
//     id: string;
//   };
// }

// export default function DashboardLayout({ children, params }: LayoutProps) {
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [dataCache, setDataCache] = useState<Map<string, any>>(new Map());
//   const [selectedCategoryData, setSelectedCategoryData] = useState<any>(null); // Добавлено для хранения данных выбранной категории

//   const olympiadId = params.id;

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const data = await getOlympiadById(olympiadId);
//       const categoriesData = data.disciplines.flatMap((dis) =>
//         dis.categories.flatMap((cat) => cat)
//       );
//       setCategories(categoriesData);
//     };

//     fetchCategories();
//   }, [olympiadId]);

//   const fetchCategoryData = async (categoryId: string) => {
//     // Проверяем, есть ли данные в кэше
//     if (dataCache.has(categoryId)) {
//       console.log("Используем кэшированные данные для категории:", categoryId);
//       return dataCache.get(categoryId);
//     } else {
//       console.log("Загружаем новые данные для категории:", categoryId);
//       // Замените следующую строку на реальный запрос для загрузки данных категории
//       const categoryData = await getParticipantsByCategoryId(categoryId); // Ваша функция для получения данных категории
//       // Сохраняем данные в кэше
//       setDataCache((prev) => new Map(prev).set(categoryId, categoryData));

//       return categoryData;
//     }
//   };

//   const onChangeCategory = async (value: string) => {
//     setSelectedCategory(value);
//   };

//   const handleFetchCategory = async () => {
//     const categoryData = await fetchCategoryData(selectedCategory);
//     setSelectedCategoryData(categoryData); // Обновляем состояние с данными выбранной категории
//     console.log("Данные выбранной категории:", categoryData);
//   };
//   return (
//     <div className="h-screen grid grid-cols-[240px_1fr]">
//       <nav className="border-r bg-gray-100/40 dark:bg-gray-800/40 h-fit pt-3 py-10 rounded-md ml-2 shadow-md">
//         <div className="flex h-full max-h-screen flex-col gap-2">
//           <div className="flex-1 overflow-auto py-2">
//             <nav className="grid items-start px-4 text-sm font-medium">
//               <div>
//                 <Label>Выберите категорию</Label>
//                 <Select onValueChange={onChangeCategory}>
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Категория" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {categories.map((cat, idx) => (
//                       <SelectItem key={idx} value={`${cat.documentId}`}>
//                         {cat.heading}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                   <Label>{selectedCategory}</Label>
//                 </Select>
//               </div>
//               <div className="mt-10">
//                 <Button onClick={handleFetchCategory}>Применить</Button>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </nav>
//       <main className="flex flex-col overflow-scroll">
//         {/* Передаем данные выбранной категории в дочерние компоненты */}
//         {React.cloneElement(children as React.ReactElement<any>, {
//           selectedCategoryData, // Передаем данные в children
//         })}
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
import { getCategoryId, getOlympiadById } from "@/data/loaders";

import { Button } from "@/components/ui/button";
import { CarTaxiFront } from "lucide-react";
import { Category } from "@/store/useOlympiadsStore";
import { Label } from "@/components/ui/label";
import OlympiadRoute from "./page";

interface LayoutProps {
  params: {
    id: string;
  };
}

export default function DashboardLayout({ params }: LayoutProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryData, setCategorydata] = useState<Category>();

  useEffect(() => {
    const getData = async () => {
      const data = await getOlympiadById(params.id);
      const categories = data.disciplines.flatMap((dis) =>
        dis.categories.flatMap((cat) => cat)
      );
      setCategories(categories);
    };
    getData();
  }, [selectedCategoryId]);

  const onChangeCategory = (value: string) => {
    setSelectedCategoryId(value);
    const category = categories.filter((cat) => cat.documentId === value);
    setCategorydata(category[0]);
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
        {categoryData ? (
          <OlympiadRoute params={params} selectedCategory={categoryData} />
        ) : (
          <div>
            <p>Выберите категорию</p>
          </div>
        )}
      </main>
    </div>
  );
}
