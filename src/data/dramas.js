export const DURATIONS = [0.75, 1.5, 5, 10];
export const MAX_GUESSES = DURATIONS.length;

export const DRAMAS = [
  {
    id: 'goblin',
    title: 'Goblin (Guardian)',
    titleKo: '쓸쓸하고 찬란하神 도깨비',
    year: 2016,
    ost: { title: 'Stay With Me', artist: 'Chanyeol & Punch' },
    audio: '/audio/goblin.mp3',
  },
  {
    id: 'crash-landing',
    title: 'Crash Landing on You',
    titleKo: '사랑의 불시착',
    year: 2019,
    ost: { title: 'Flower', artist: 'Yoon Mi-rae' },
    audio: '/audio/crash-landing.mp3',
  },
  {
    id: 'descendants',
    title: 'Descendants of the Sun',
    titleKo: '태양의 후예',
    year: 2016,
    ost: { title: 'Always', artist: 'Yoon Mi-rae' },
    audio: '/audio/descendants.mp3',
  },
  {
    id: 'my-love-star',
    title: 'My Love from the Star',
    titleKo: '별에서 온 그대',
    year: 2013,
    ost: { title: 'My Destiny', artist: 'Lyn' },
    audio: '/audio/my-love-star.mp3',
  },
  {
    id: 'itaewon-class',
    title: 'Itaewon Class',
    titleKo: '이태원 클라쓰',
    year: 2020,
    ost: { title: 'Start', artist: 'Gaho' },
    audio: '/audio/itaewon-class.mp3',
  },
  {
    id: 'hotel-del-luna',
    title: 'Hotel Del Luna',
    titleKo: '호텔 델루나',
    year: 2019,
    ost: { title: 'Another Day', artist: 'Monday Kiz & Punch' },
    audio: '/audio/hotel-del-luna.mp3',
  },
  {
    id: 'reply-1988',
    title: 'Reply 1988',
    titleKo: '응답하라 1988',
    year: 2015,
    ost: { title: 'A Little Girl', artist: 'Oh Hyuk' },
    audio: '/audio/reply-1988.mp3',
  },
  {
    id: 'its-okay',
    title: "It's Okay to Not Be Okay",
    titleKo: '사이코지만 괜찮아',
    year: 2020,
    ost: { title: 'Breath', artist: 'Sam Kim' },
    audio: '/audio/its-okay.mp3',
  },
  {
    id: 'vincenzo',
    title: 'Vincenzo',
    titleKo: '빈센조',
    year: 2021,
    ost: { title: 'Adrenaline', artist: 'Solar' },
    audio: '/audio/vincenzo.mp3',
  },
  {
    id: 'hospital-playlist',
    title: 'Hospital Playlist',
    titleKo: '슬기로운 의사생활',
    year: 2020,
    ost: { title: 'Aloha', artist: 'Jo Jung-suk' },
    audio: '/audio/hospital-playlist.mp3',
  },
  {
    id: 'start-up',
    title: 'Start-Up',
    titleKo: '스타트업',
    year: 2020,
    ost: { title: 'Running', artist: 'Gaho' },
    audio: '/audio/start-up.mp3',
  },
  {
    id: 'true-beauty',
    title: 'True Beauty',
    titleKo: '여신강림',
    year: 2020,
    ost: { title: 'Love So Fine', artist: 'Cha Eun-woo' },
    audio: '/audio/true-beauty.mp3',
  },
  {
    id: 'business-proposal',
    title: 'Business Proposal',
    titleKo: '사내맞선',
    year: 2022,
    ost: { title: 'Love, Maybe', artist: 'Kim Se-jeong' },
    audio: '/audio/business-proposal.mp3',
  },
  {
    id: 'attorney-woo',
    title: 'Extraordinary Attorney Woo',
    titleKo: '이상한 변호사 우영우',
    year: 2022,
    ost: { title: 'Beyond My Dreams', artist: 'Jeon Mi-do' },
    audio: '/audio/attorney-woo.mp3',
  },
  {
    id: '2521',
    title: 'Twenty-Five Twenty-One',
    titleKo: '스물다섯 스물하나',
    year: 2022,
    ost: { title: 'Starlight', artist: 'Taeil (NCT)' },
    audio: '/audio/2521.mp3',
  },
  {
    id: 'hometown-cha',
    title: 'Hometown Cha-Cha-Cha',
    titleKo: '갯마을 차차차',
    year: 2021,
    ost: { title: 'Romantic Sunday', artist: 'Car, the Garden' },
    audio: '/audio/hometown-cha.mp3',
  },
  {
    id: 'boys-over-flowers',
    title: 'Boys Over Flowers',
    titleKo: '꽃보다 남자',
    year: 2009,
    ost: { title: 'Almost Paradise', artist: 'T-Max' },
    audio: '/audio/boys-over-flowers.mp3',
  },
  {
    id: 'the-heirs',
    title: 'The Heirs',
    titleKo: '상속자들',
    year: 2013,
    ost: { title: 'Love Is...', artist: 'Park Jang-hyeon & Park Hyeon-gyu' },
    audio: '/audio/the-heirs.mp3',
  },
  {
    id: 'scarlet-heart',
    title: 'Moon Lovers: Scarlet Heart Ryeo',
    titleKo: '달의 연인 보보경심 려',
    year: 2016,
    ost: { title: 'For You', artist: 'EXO-CBX' },
    audio: '/audio/scarlet-heart.mp3',
  },
  {
    id: 'strong-woman',
    title: 'Strong Woman Do Bong-soon',
    titleKo: '힘쎈여자 도봉순',
    year: 2017,
    ost: { title: "You're My Garden", artist: 'Jeong Eun-ji' },
    audio: '/audio/strong-woman.mp3',
  },
  {
    id: 'weightlifting-fairy',
    title: 'Weightlifting Fairy Kim Bok-joo',
    titleKo: '역도요정 김복주',
    year: 2016,
    ost: { title: 'From Now On', artist: 'Kim Chung-ha' },
    audio: '/audio/weightlifting-fairy.mp3',
  },
  {
    id: 'sky-castle',
    title: 'SKY Castle',
    titleKo: 'SKY 캐슬',
    year: 2018,
    ost: { title: 'We All Lie', artist: 'Ha Jin' },
    audio: '/audio/sky-castle.mp3',
  },
  {
    id: 'while-you-slept',
    title: 'While You Were Sleeping',
    titleKo: '당신이 잠든 사이에',
    year: 2017,
    ost: { title: "It's You", artist: 'Henry Lau' },
    audio: '/audio/while-you-slept.mp3',
  },
  {
    id: 'mr-sunshine',
    title: 'Mr. Sunshine',
    titleKo: '미스터 션샤인',
    year: 2018,
    ost: { title: "And I'm Here", artist: 'Kim Feel' },
    audio: '/audio/mr-sunshine.mp3',
  },
  {
    id: 'queen-of-tears',
    title: 'Queen of Tears',
    titleKo: '눈물의 여왕',
    year: 2024,
    ost: { title: 'Love You With All My Heart', artist: 'Crush' },
    audio: '/audio/queen-of-tears.mp3',
  },
  {
    id: 'alchemy-of-souls',
    title: 'Alchemy of Souls',
    titleKo: '환혼',
    year: 2022,
    ost: { title: 'Light Me Up', artist: 'Hwang Chi-yeul' },
    audio: '/audio/alchemy-of-souls.mp3',
  },
  {
    id: 'my-mister',
    title: 'My Mister (My Ajusshi)',
    titleKo: '나의 아저씨',
    year: 2018,
    ost: { title: 'Adult', artist: 'Sondia' },
    audio: '/audio/my-mister.mp3',
  },
  {
    id: 'squid-game',
    title: 'Squid Game',
    titleKo: '오징어 게임',
    year: 2021,
    ost: { title: 'Way Back Then', artist: 'Jung Jae-il' },
    audio: '/audio/squid-game.mp3',
  },
  {
    id: 'love-alarm',
    title: 'Love Alarm',
    titleKo: '좋아하면 울리는',
    year: 2019,
    ost: { title: 'Love Alarm', artist: 'Motte' },
    audio: '/audio/love-alarm.mp3',
  },
  {
    id: 'extraordinary-you',
    title: 'Extraordinary You',
    titleKo: '어쩌다 발견한 하루',
    year: 2019,
    ost: { title: 'At a Distance', artist: 'MJ (ASTRO)' },
    audio: '/audio/extraordinary-you.mp3',
  },
];

export const TOTAL_DRAMAS = DRAMAS.length;

export function buildSearchIndex() {
  return DRAMAS.map(d => ({
    id: d.id,
    title: d.title,
    titleKo: d.titleKo,
    lower: d.title.toLowerCase(),
    lowerKo: d.titleKo.toLowerCase(),
  }));
}

export function searchDramas(query, index) {
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

export function getRandomPuzzle(excludeIdx) {
  let idx;
  do {
    idx = Math.floor(Math.random() * TOTAL_DRAMAS);
  } while (idx === excludeIdx && TOTAL_DRAMAS > 1);
  return { drama: DRAMAS[idx], index: idx };
}

export function getDramaByIndex(idx) {
  return DRAMAS[idx % TOTAL_DRAMAS];
}
