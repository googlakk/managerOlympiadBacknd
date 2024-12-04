// "use client";

// import { Category, Participants } from "@/store/useOlympiadsStore";
// import { getAllParticipants, getCategoryId } from "@/data/loaders";
// import { useEffect, useState } from "react";

// import { CategoryTable } from "./table-category";
// import { ParticipantsTable } from "./data-table";
// import { columnsUserAdd } from "@/components/custom/table/ParticipantsAddTable";
// import { participantsColumns } from "./columns";

// interface ChildrenProps {
//   selectedCategory: Category;
//   params: {
//     id: string;
//   };
// }

// export default function OlympiadRoute({
//   params,
//   selectedCategory,
// }: {
//   params: { id: string };
//   selectedCategory: Category;
// })  {
//   const [users, setUsers] = useState<Participants[]>([]);
//   const [allParticipants, setParticipants] = useState<Participants[]>([]);
//   const [currentParticipantByCategory, setCurrentParticipant] = useState<
//     Participants[]
//   >([]);
//   const [isReload, setIsReload] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Запрос всех участников
//         const participantsData = await getAllParticipants();
//         setParticipants(participantsData.data);

//         // Запрос участников текущей категории
//         if (selectedCategory) {
//           const currentParticipant = await getCategoryId(
//             selectedCategory.documentId
//           );
//           setCurrentParticipant(currentParticipant.participants);
//         }
//       } catch (error) {
//         console.error("Error loading participants:", error);
//       }
//       setIsReload(false); // Сброс флага перезагрузки после обновления данных
//     };

//     fetchData();
//   }, [selectedCategory, isReload]);

//   // Отдельный useEffect для фильтрации
//   useEffect(() => {
//     // Проверка, что данные загружены перед фильтрацией
//     if (allParticipants.length > 0 && currentParticipantByCategory.length > 0) {
//       setUsers(
//         allParticipants.filter(
//           (item1) =>
//             !currentParticipantByCategory.some((item2) => item2.id === item1.id)
//         )
//       );
//     } else {
//       setUsers(allParticipants);
//     }
//   }, [allParticipants, currentParticipantByCategory]);

//   return (
//     <div className="w-full min-h-screen m-0 px-2 grid grid-cols-2 gap-x-3">
//       <div>
//         <CategoryTable
//           dataReload={setIsReload}
//           categoryId={selectedCategory.documentId}
//           columns={columnsUserAdd}
//           data={currentParticipantByCategory || []}
//           params={params}
//         />
//       </div>
//       <div>
//         <ParticipantsTable
//           dataReload={setIsReload}
//           categoryId={selectedCategory.documentId}
//           data={users || []}
//           columns={participantsColumns}
//           params={params}
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import DashboardLayout from "./layout"; // Импортируй DashboardLayout

interface PageProps {
  params: {
    id: string;
  };
}

export default function OlympiadPage({ params }: PageProps) {
  return <DashboardLayout params={params} />;
}
