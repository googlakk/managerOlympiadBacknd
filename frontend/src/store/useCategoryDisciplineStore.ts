import { create } from "zustand";
export interface CategoryId {
  id: number;
  heading: string;
}

export interface DisciplineId {
  id: number;
  heading: string;
}

export interface CategoryDisciplineStoreProps {
  disciplinesData: DisciplineId[];
  categoriesData: CategoryId[];
  setCategories: (categories: CategoryId) => void;
  setDisciplines: (disciplines: DisciplineId) => void;
  removeCategory: (categoryId: number) => void;
  resetStore: () => void;
}

const useCategoryDisciplineStore = create<CategoryDisciplineStoreProps>(
  (set) => ({
    disciplinesData: [],
    categoriesData: [],
    setCategories: (newCategory: CategoryId) =>
      set((state) => ({
        categoriesData: [...state.categoriesData, newCategory],
      })),
    setDisciplines: (newDiscipline: DisciplineId) =>
      set((state) => ({
        disciplinesData: [...state.disciplinesData, newDiscipline],
      })),
    removeCategory: (categoryId: number) =>
      set((state) => ({
        categoriesData: state.categoriesData.filter(
          (category) => category.id !== categoryId
        ),
      })),
    resetStore: () =>
      set({
        disciplinesData: [],
        categoriesData: [],
      }),
  })
);
export default useCategoryDisciplineStore;
