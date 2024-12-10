import type { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const { Server } = require("socket.io");
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true,
      },
    });

    // Глобальные объекты для хранения данных
    let resultsByOlympiad: Record<string, any> = {};
    let winnersByCategory: Record<string, any> = {};

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      // Подключение клиента к конкретной олимпиаде
      socket.on("joinOlympiad", (olympiadId) => {
        socket.join(olympiadId); // Присоединяем клиента к комнате олимпиады

        // Отправляем текущие данные об олимпиаде
        if (resultsByOlympiad[olympiadId]) {
          socket.emit("resultsUpdated", {
            olympiadId,
            results: resultsByOlympiad[olympiadId],
          });
        }
        if (winnersByCategory[olympiadId]) {
          socket.emit("categoryWinnersUpdated", {
            olympiadId,
            winners: winnersByCategory[olympiadId],
          });
        }
      });

      // Обработка обновления результатов
      socket.on("updateResults", ({ olympiadId, results }) => {
        console.log(
          "Received results update for olympiad:",
          olympiadId,
          results
        );

        // Обновляем результаты
        resultsByOlympiad[olympiadId] = results;

        // Отправляем обновления только участникам конкретной олимпиады
        io.to(olympiadId).emit("resultsUpdated", { olympiadId, results });
      });

      // Обработка добавления победителей
      socket.on("updateWinners", ({ olympiadId, categoryId, winners }) => {
        console.log("winnners from server", winners);
        console.log(
          `Received winners update for olympiad: ${olympiadId}, category: ${categoryId}`,
          winners
        );

        // Инициализируем категорию, если нужно
        if (!winnersByCategory[olympiadId]) {
          winnersByCategory[olympiadId] = {};
        }

        // Сохраняем победителей по категории
        winnersByCategory[olympiadId][categoryId] = winners;

        // Отправляем обновления только участникам конкретной олимпиады
        io.to(olympiadId).emit("categoryWinnersUpdated", {
          olympiadId,
          categoryId,
          winners,
        });
      });

      // Обработка отключения
      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });
  },
};
