import { BaseTask, Participant, Result, Task } from "../types";

import { createCategoryParticipantResults } from "@/data/actions/result-actions";

class ResultsService {
  private results: Result[] = [];
  initializeResults(
    users: Participant[],
    tasks: BaseTask[],
    categoryId: string,
    disciplineId: string
  ): Result[] {
    return users.map((user) => ({
      user: user,
      categoryId, // ID категории
      disciplineId, // ID дисциплины
      totalScore: 0, // начальный общий счет
      tasks: [],
    }));
  }

  addOrUpdateTasks(results: Result[], newTasks: BaseTask[]): Result[] {
    return results.map((result) => {
      // Удаляем задачи, которые больше не существуют
      const existingTasks = result.tasks.filter((task) =>
        newTasks.some((newTask) => newTask.id === task.id)
      );

      // Обновляем существующие задачи
      const updatedTasks = existingTasks.map((task) => {
        const updatedTask = newTasks.find((newTask) => newTask.id === task.id);
        if (updatedTask) {
          return {
            ...task,
            title: updatedTask.title || task.title,
            correctAnswer: updatedTask.correctAnswer || task.correctAnswer,
            currentScore: updatedTask.currentScore || task.currentScore,
          };
        }
        return task;
      });

      // Добавляем новые задачи
      const newTasksToAdd = newTasks
        .filter(
          (newTask) => !result.tasks.some((task) => task.id === newTask.id)
        )
        .map((newTask) => ({
          id: newTask.id,
          title: newTask.title,
          correctAnswer: newTask.correctAnswer,
          currentScore: newTask.currentScore,
          userAnswer: "",
          scoreEarned: 0,
          isCorrectly: false,
        }));

      const finalTasks = [...updatedTasks, ...newTasksToAdd];

      // Используем метод calculateTotalScore для пересчёта
      const totalScore = this.calculateTotalScore(finalTasks);

      return {
        ...result,
        tasks: finalTasks,
        totalScore,
      };
    });
  }

  checkCorrectness(task: Task, userAnswer: string): boolean {
    return task.correctAnswer === userAnswer;
  }
  calculateScore(task: Task, isCorrect: boolean): number {
    return isCorrect ? task.currentScore : 0;
  }
  calculateTotalScore(tasks: Task[]): number {
    return tasks.reduce((total, task) => total + task.scoreEarned, 0);
  }
  updateTaskAnswer(
    result: Result,
    taskId: number,
    userAnswer: string | boolean, // Может быть строкой (ответ) или булевым значением (чекбокс)
    isAlternative: boolean // Указывает, какой тип ввода используется
  ): Result {
    const updatedTasks = result.tasks.map((task) => {
      if (task.id !== taskId) return task;

      if (isAlternative) {
        // Если это чекбокс, обновляем только isCorrectly
        const isCorrect = userAnswer as boolean; // Булевое значение из чекбокса
        return {
          ...task,
          isCorrectly: isCorrect,
          scoreEarned: this.calculateScore(task, isCorrect), // Пересчитываем балл
        };
      } else {
        // Если это текстовый ввод
        const isCorrect = this.checkCorrectness(task, userAnswer as string); // Проверяем текстовый ответ
        return {
          ...task,
          userAnswer: userAnswer as string,
          isCorrectly: isCorrect,
          scoreEarned: this.calculateScore(task, isCorrect), // Пересчитываем балл
        };
      }
    });

    // Обновляем общий счёт
    const totalScore = this.calculateTotalScore(updatedTasks);

    return {
      ...result,
      tasks: updatedTasks,
      totalScore,
    };
  }

  updateTaskForParticipant = (
    results: Result[],
    userId: string,
    taskId: number,
    userAnswer: string,
    isAlternative: boolean
  ): Result[] => {
    return results.map((result) =>
      result.user.documentId === userId
        ? this.updateTaskAnswer(result, taskId, userAnswer, isAlternative)
        : result
    );
  };
}

export const resultsService = new ResultsService();
