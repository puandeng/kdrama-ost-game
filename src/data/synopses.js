export const ROUNDS_PER_GAME = 5;

// Synopsis format: [n:phrase] marks redacted words.
// n = reveal order (1 = revealed first / least identifying, highest = last / most identifying).
// Score = blanks remaining + 1 when guessed correctly. Skip = 0.
export const SYNOPSES = [
  {
    title: 'Crash Landing on You',
    titleKo: '사랑의 불시착',
    synopsis: 'A [1:wealthy heiress] has a [2:paragliding accident] and lands in [4:North Korea], where a [3:military captain] risks everything to protect her.',
  },
  {
    title: 'Goblin',
    titleKo: '도깨비',
    synopsis: 'A [1:cursed immortal] with a [3:sword embedded in his chest] searches for the [4:bride] who can pull it out and end his [2:900-year existence].',
  },
  {
    title: 'Descendants of the Sun',
    titleKo: '태양의 후예',
    synopsis: 'A [2:special forces captain] and a [3:surgeon] navigate a romance in a [1:war-torn country] while struggling between [4:love and duty to their nations].',
  },
  {
    title: 'My Love from the Star',
    titleKo: '별에서 온 그대',
    synopsis: 'An [4:alien] who arrived on Earth [1:400 years ago] falls for a [3:top actress] just [2:three months] before he must leave the planet forever.',
  },
  {
    title: 'Reply 1988',
    titleKo: '응답하라 1988',
    synopsis: 'Five [1:neighboring families] in a [3:1988 Seoul alley] share their daily lives while the audience tries to guess which of the boys [4:Deok-sun] ends up [2:marrying].',
  },
  {
    title: 'Hotel Del Luna',
    titleKo: '호텔 델루나',
    synopsis: 'A [2:vengeful woman] has run a [4:hotel for the dead] for over a [1:thousand years], until a [3:new manager] arrives who might finally set her free.',
  },
  {
    title: 'Vincenzo',
    titleKo: '빈센조',
    synopsis: 'A [3:Korean-Italian] [4:mafia consigliere] returns to Seoul to recover [2:gold bars] hidden beneath a [1:building] and ends up battling a corrupt conglomerate.',
  },
  {
    title: 'Itaewon Class',
    titleKo: '이태원 클라쓰',
    synopsis: 'An [1:ex-convict] opens a [3:small bar] in [4:Itaewon] to get revenge on the [2:food industry CEO] whose son destroyed his family.',
  },
  {
    title: "It's Okay to Not Be Okay",
    titleKo: '사이코지만 괜찮아',
    synopsis: 'A [3:children\'s book author] with [2:antisocial tendencies] falls for a [4:psychiatric ward] caretaker who has devoted his life to his [1:autistic older brother].',
  },
  {
    title: 'Squid Game',
    titleKo: '오징어 게임',
    synopsis: '[1:Hundreds of people] drowning in debt are invited to play [3:childhood games] for a [2:₩45.6 billion] prize, but losers face [4:deadly consequences].',
  },
  {
    title: 'Boys Over Flowers',
    titleKo: '꽃보다 남자',
    synopsis: 'A [1:poor girl] receives a [3:red card] from the [4:F4], the richest boys at her elite school, but their [2:arrogant leader] slowly falls for her defiance.',
  },
  {
    title: 'The Heirs',
    titleKo: '상속자들',
    synopsis: 'The [2:heir to a hotel empire] meets a girl in [3:Los Angeles] and brings her into his world of [1:wealth and rivalry] at an [4:elite high school for chaebols].',
  },
  {
    title: 'Queen of Tears',
    titleKo: '눈물의 여왕',
    synopsis: 'The [1:cold-hearted heiress] of a [3:department store empire] is diagnosed with a [4:brain tumor], forcing her [2:estranged husband] to fight to save their crumbling marriage.',
  },
  {
    title: 'Mr. Sunshine',
    titleKo: '미스터 션샤인',
    synopsis: 'A boy born into [2:slavery] in [3:Joseon] escapes to America and returns years later as a [4:U.S. Marine officer] during the [1:late 1800s] to the country that abandoned him.',
  },
  {
    title: 'While You Were Sleeping',
    titleKo: '당신이 잠든 사이에',
    synopsis: 'A [3:reporter], a [2:prosecutor], and a police officer discover they can [4:see the future in their dreams] and race to [1:prevent tragic events] from unfolding.',
  },
  {
    title: 'The Glory',
    titleKo: '더 글로리',
    synopsis: 'A woman who was [2:brutally bullied with a curling iron] in high school spends [1:years planning revenge] by becoming a [3:homeroom teacher] at the school where her [4:bully\'s child] attends.',
  },
  {
    title: 'Start-Up',
    titleKo: '스타트업',
    synopsis: 'A young woman enters the [2:tech startup] world in [1:Korea\'s Silicon Valley], caught between a [3:pen pal] she\'s never met and a [4:math genius who wrote his letters].',
  },
  {
    title: 'Hometown Cha-Cha-Cha',
    titleKo: '갯마을 차차차',
    synopsis: 'A [2:city dentist] opens a clinic in a [3:seaside village] and clashes with the [1:unemployed] [4:jack-of-all-trades] beloved by every resident.',
  },
  {
    title: 'True Beauty',
    titleKo: '여신강림',
    synopsis: 'A girl who was [1:bullied for her looks] masters [3:makeup] to reinvent herself at a new school, but one classmate discovers her [4:bare-faced secret] and keeps it [2:between them].',
  },
  {
    title: 'Business Proposal',
    titleKo: '사내맞선',
    synopsis: 'A woman goes on a [3:blind date disguised as her friend] and accidentally catches the eye of her own [4:company\'s CEO], who now [1:proposes] after just [2:one meeting].',
  },
  {
    title: 'Weightlifting Fairy Kim Bok-joo',
    titleKo: '역도요정 김복주',
    synopsis: 'A college [4:weightlifter] develops a crush on a [3:swimmer] at a rival department and struggles between her [1:sport], her [2:insecurities], and first love.',
  },
  {
    title: 'Secret Garden',
    titleKo: '시크릿 가든',
    synopsis: 'A [1:wealthy CEO] and a [2:stunt woman] [4:swap bodies] after drinking a mysterious [3:rain-soaked liquor] in an enchanted place.',
  },
  {
    title: 'Coffee Prince',
    titleKo: '커피프린스 1호점',
    synopsis: 'A [3:tomboy] is mistaken for a [4:guy] and hired at a [2:coffee shop], while the owner develops [1:confusing feelings] thinking she\'s a man.',
  },
  {
    title: 'My Mister',
    titleKo: '나의 아저씨',
    synopsis: 'A [2:middle-aged engineer] drowning in a failing marriage forms an unlikely bond with a [3:hardened young woman] at his company who [1:secretly] [4:listens to his conversations through an earpiece].',
  },
  {
    title: 'Signal',
    titleKo: '시그널',
    synopsis: 'A [1:cold case profiler] discovers an old [4:walkie-talkie] that connects him to a [3:detective in 1989], and together they try to [2:solve unsolved murders across time].',
  },
  {
    title: 'Scarlet Heart Ryeo',
    titleKo: '달의 연인 보보경심 려',
    synopsis: 'A modern woman is [2:transported back in time] to the [3:Goryeo dynasty] and becomes entangled with [1:princes fighting for the throne], falling for the most [4:feared and scarred one].',
  },
  {
    title: 'Hospital Playlist',
    titleKo: '슬기로운 의사생활',
    synopsis: 'Five [2:doctor friends] who met in [1:med school] work at the same [3:hospital], balancing patients and romance while bonding over their [4:band practice sessions].',
  },
  {
    title: 'SKY Castle',
    titleKo: 'SKY 캐슬',
    synopsis: '[1:Wealthy housewives] in an [2:elite residential compound] go to [3:extreme and dangerous lengths] to get their children into [4:Korea\'s top universities].',
  },
  {
    title: 'Dream High',
    titleKo: '드림하이',
    synopsis: 'Students at a [1:performing arts academy] compete to [3:debut as K-pop idols], navigating [2:rivalries and romance] while chasing their [4:dreams of stardom].',
  },
  {
    title: 'W: Two Worlds',
    titleKo: '더블유',
    synopsis: 'A [1:surgeon\'s daughter] is [3:pulled into] her father\'s [4:webtoon] and falls for the [2:fictional main character] who becomes aware he\'s not real.',
  },
  {
    title: 'Alchemy of Souls',
    titleKo: '환혼',
    synopsis: 'In a fictional world, a powerful [3:assassin\'s soul] is trapped in a [2:blind woman\'s body], and she becomes the [1:martial arts master] of a [4:young mage from the prestigious Jang family].',
  },
  {
    title: 'Love in the Moonlight',
    titleKo: '구르미 그린 달빛',
    synopsis: 'A [1:young woman] disguised as a [3:male scholar] enters the [2:Joseon palace] as a eunuch and unexpectedly catches the heart of the [4:crown prince].',
  },
  {
    title: 'Full House',
    titleKo: '풀하우스',
    synopsis: 'A woman\'s [2:house is sold] behind her back while she\'s [1:tricked into a vacation], and she ends up in a [4:contract marriage] with the famous [3:actor] who bought it.',
  },
  {
    title: 'Extraordinary Attorney Woo',
    titleKo: '이상한 변호사 우영우',
    synopsis: 'A [3:brilliant lawyer] with [4:autism] navigates the legal world at a top firm, winning cases with her [1:unconventional thinking] and deep love of [2:whales].',
  },
  {
    title: 'Twenty-Five Twenty-One',
    titleKo: '스물다섯 스물하나',
    synopsis: 'During the [3:1998 IMF crisis], a [4:fencer] and an [1:aspiring reporter] form a bond that evolves from [2:friendship to love] across the years 25 and 21.',
  },
];

// Parse synopsis markup into structured parts
export function parseSynopsis(synopsis) {
  const parts = [];
  const blanks = [];
  let remaining = synopsis;

  while (remaining.length > 0) {
    const match = remaining.match(/\[(\d+):([^\]]+)\]/);
    if (!match) {
      parts.push({ type: 'text', text: remaining });
      break;
    }

    const before = remaining.slice(0, match.index);
    if (before) parts.push({ type: 'text', text: before });

    const order = parseInt(match[1]);
    const blankIdx = blanks.length;
    parts.push({ type: 'blank', text: match[2], index: blankIdx });
    blanks.push({ order, text: match[2], index: blankIdx });

    remaining = remaining.slice(match.index + match[0].length);
  }

  // Sort blanks by reveal order
  const revealOrder = [...blanks].sort((a, b) => a.order - b.order).map(b => b.index);

  return { parts, blanks, revealOrder, totalBlanks: blanks.length };
}

export function getRandomSynopses(count) {
  const shuffled = [...SYNOPSES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function buildSynopsisSearchIndex() {
  const seen = new Set();
  const list = [];
  for (const s of SYNOPSES) {
    if (!seen.has(s.title)) {
      seen.add(s.title);
      list.push({
        title: s.title,
        titleKo: s.titleKo,
        lower: s.title.toLowerCase(),
        lowerKo: s.titleKo.toLowerCase(),
      });
    }
  }
  return list.sort((a, b) => a.title.localeCompare(b.title));
}

export function searchSynopsisDramas(query, index) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return index
    .filter(d => d.lower.includes(q) || d.lowerKo.includes(q))
    .sort((a, b) => {
      const aStarts = a.lower.startsWith(q) || a.lowerKo.startsWith(q) ? 0 : 1;
      const bStarts = b.lower.startsWith(q) || b.lowerKo.startsWith(q) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return a.lower.length - b.lower.length;
    })
    .slice(0, 8);
}
