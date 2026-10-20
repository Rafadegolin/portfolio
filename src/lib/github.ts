// Dados reais do GitHub para a home (heatmap e números).
// Buscados no servidor com revalidate: o HTML continua estático e se atualiza
// sozinho a cada 6h. Qualquer falha devolve null e os painéis somem.

const REVALIDATE = 60 * 60 * 6;

export type ContributionDay = { date: string; count: number };

export type GithubStats = {
  login: string;
  total: number;
  privateCount: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  weeks: ContributionDay[][];
};

type GraphQLResponse = {
  data?: {
    user: {
      contributionsCollection: {
        restrictedContributionsCount: number;
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
        };
      };
    } | null;
  };
};

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

export function githubLogin(profileUrl: string): string | null {
  const match = profileUrl.match(/github\.com\/([^/?#]+)/i);
  return match ? match[1] : null;
}

function streaks(days: ContributionDay[]) {
  let longest = 0;
  let run = 0;
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // Sequência atual: termina hoje, ou ontem se hoje ainda não teve contribuição.
  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) current++;
  return { longest, current };
}

export async function getGithubStats(profileUrl: string): Promise<GithubStats | null> {
  const token = process.env.GITHUB_TOKEN;
  const login = githubLogin(profileUrl);
  if (!token || !login) return null;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as GraphQLResponse;
    const user = json.data?.user;
    if (!user) return null;

    const calendar = user.contributionsCollection.contributionCalendar;
    const weeks = calendar.weeks.map((w) =>
      w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
    );
    const days = weeks.flat();
    const { current, longest } = streaks(days);

    return {
      login,
      total: calendar.totalContributions,
      privateCount: user.contributionsCollection.restrictedContributionsCount,
      activeDays: days.filter((d) => d.count > 0).length,
      currentStreak: current,
      longestStreak: longest,
      weeks,
    };
  } catch {
    return null;
  }
}
