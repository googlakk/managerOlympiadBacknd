import { flattenAttributes, getStrapiURL } from "@/lib/utils";

import { Olympiad } from "@/store/useOlympiadsStore";
import { getAuthToken } from "./service/getToken";
import { unstable_noStore as noStore } from "next/cache";
import qs from "qs";

const baseUrl = getStrapiURL();

async function fetchData(url: string) {
  const authToken = await getAuthToken();

  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const response = await fetch(url, authToken ? headers : {});
    const data = await response.json();
    return flattenAttributes(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getHomePageData() {
  const url = new URL("/api/home-page", baseUrl);

  url.search = qs.stringify({
    populate: {
      blocks: {
        on: {
          "layout.hero-section": {
            populate: {
              background: {
                fields: ["url", "alternativeText"],
              },
              ctaButton: {
                populate: true,
              },
            },
          },
          "layout.olympiad-section": {
            populate: {
              olympiads: {
                populate: {
                  image: {
                    fields: ["url", "alternativeText"],
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return await fetchData(url.href);
}

export async function getGlobalData() {
  noStore();
  const url = new URL("/api/global", baseUrl);

  url.search = qs.stringify({
    populate: {
      blocks: {
        on: {
          "layout.header": {
            populate: {
              logo: {
                fields: ["url", "alternativeText"],
              },
              link: {
                populate: true,
              },
              ctaButton: {
                populate: true,
              },
            },
          },
          "layout.footer": {
            populate: {
              logo: {
                fields: ["url", "alternativeText"],
              },
              link: {
                populate: true,
              },
            },
          },
        },
      },
    },
  });

  return await fetchData(url.href);
}

export async function getGlobalPageMetadata() {
  const url = new URL("/api/global", baseUrl);

  url.search = qs.stringify({
    fields: ["title", "description"],
  });

  return await fetchData(url.href);
}

export async function getOlympiadsData() {
  const url = new URL("/api/olympiads", baseUrl);
  url.search = qs.stringify({
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
      disciplines: {
        populate: {
          categories: {
            fields: ["heading", "description"],
            populate: {
              participants: {
                populate: true,
              },
            },
          },
        },
      },
    },
  });

  return await fetchData(url.href);
}

export async function getOlympiadById(olympiadId: string): Promise<Olympiad> {
  const url = new URL(`/api/olympiads/${olympiadId}`, baseUrl);
  url.search = qs.stringify({
    populate: {
      image: {
        fields: ["url", "alternativeText"],
      },
      disciplines: {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
          categories: {
            fields: ["id", "documentId", "heading", "description"],
            populate: {
              participants: {
                populate: {
                  avatar: {
                    fields: ["url", "alternativeText"],
                  },
                  scores: {
                    populate: true,
                  },
                },
              },
              scores: {
                populate: {
                  participant: {
                    populate: true,
                  },
                },
              },
              winners: {
                populate: {
                  participant: {
                    populate: true
                  }
                }
              }
            },
          },
        },
      },
    },
  });

  return await fetchData(url.href);
}

export async function getAllParticipants() {
  const url = new URL("/api/participants", baseUrl);
  url.search = qs.stringify({
    populate: {
      categories: {
        populate: true,
      },
      scores: {
        populate: true,
      },
    },
  });
  return await fetchData(url.href);
}

export async function getCategoryId(id: string) {
  const url = new URL(`/api/categories/${id}`, baseUrl);
  url.search = qs.stringify({
    populate: {
      participants: {
        populate: true,
      },
      scores: {
        populate: true,
      },
    },
  });
  return await fetchData(url.href);
}

export async function getAllScores() {
  const url = new URL(`api/scores`, baseUrl);
  url.search = qs.stringify({
    populate: {
      populate: true,
      category: {
        populate: true,
      },
      participant: {
        populate: true,
      },
      discipline: {
        populate: true,
      },
    },
  });
  return await fetchData(url.href);
}
export async function getAllWinners() {
  const url = new URL(`api/winners`, baseUrl);
  url.search = qs.stringify({
    populate: {
      category: {
        populate: true,
      },
      participant: {
        populate: true,
      },
    },
  });
  return await fetchData(url.href);
}
export async function getScoresByCategory(documentId: string) {
  const url = new URL("api/scores", baseUrl);
  url.search = qs.stringify({
    filters: {
      category: {
        documentId: {
          $eq: documentId,
        },
      },
    },
    populate: {
      populate: true,
      category: {
        populate: true,
      },
      participant: {
        populate: true,
      },
      discipline: {
        populate: true,
      },
    },
  });
  return await fetchData(url.href);
}
