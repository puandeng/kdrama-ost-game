#!/usr/bin/env python3
"""Convert filmography_raw.json into src/data/actors.js with Korean titles."""
import json
import re

# Korean title lookup — manually curated for well-known dramas
KOREAN_TITLES = {
    # Mega-hits & widely known
    "Squid Game": "오징어 게임",
    "Crash Landing on You": "사랑의 불시착",
    "Goblin": "도깨비",
    "Guardian: The Lonely and Great God": "도깨비",
    "Descendants of the Sun": "태양의 후예",
    "Boys Over Flowers": "꽃보다 남자",
    "My Love from the Star": "별에서 온 그대",
    "Hotel Del Luna": "호텔 델루나",
    "The Glory": "더 글로리",
    "Queen of Tears": "눈물의 여왕",
    "Vincenzo": "빈센조",
    "Reply 1988": "응답하라 1988",
    "Itaewon Class": "이태원 클라쓰",
    "Start-Up": "스타트업",
    "Sweet Home": "스위트홈",
    "Hometown Cha-Cha-Cha": "갯마을 차차차",
    "All of Us Are Dead": "지금 우리 학교는",
    "D.P.": "D.P.",
    "Snowdrop": "설강화",
    "True Beauty": "여신강림",
    "Business Proposal": "사내맞선",
    "Twenty-Five Twenty-One": "스물다섯 스물하나",
    "Extraordinary Attorney Woo": "이상한 변호사 우영우",
    "Alchemy of Souls": "환혼",
    "Mr. Sunshine": "미스터 션샤인",
    "Signal": "시그널",
    "Kingdom": "킹덤",
    "Vagabond": "배가본드",

    # Coffee Prince / classics
    "Coffee Prince": "커피프린스 1호점",
    "Full House": "풀하우스",
    "Secret Garden": "시크릿 가든",
    "My Name Is Kim Sam-soon": "내 이름은 김삼순",
    "My Lovely Sam Soon": "내 이름은 김삼순",
    "Winter Sonata": "겨울연가",
    "Autumn in My Heart": "가을동화",
    "Stairway to Heaven": "천국의 계단",
    "Jewel in the Palace": "대장금",

    # Popular dramas
    "The Heirs": "상속자들",
    "City Hunter": "시티헌터",
    "Personal Taste": "개인의 취향",
    "Legend of the Blue Sea": "푸른 바다의 전설",
    "The King: Eternal Monarch": "더 킹: 영원의 군주",
    "Dream High": "드림하이",
    "Dream High 2": "드림하이 2",
    "Moon Embracing the Sun": "해를 품은 달",
    "The Moon That Embraces the Sun": "해를 품은 달",
    "It's Okay to Not Be Okay": "사이코지만 괜찮아",
    "Sungkyunkwan Scandal": "성균관 스캔들",
    "Reborn Rich": "재벌집 막내아들",
    "Arthdal Chronicles": "아스달 연대기",
    "Scarlet Heart Ryeo": "달의 연인 보보경심 려",
    "Moon Lovers: Scarlet Heart Ryeo": "달의 연인 보보경심 려",
    "Producer": "프로듀사",
    "My Mister": "나의 아저씨",
    "She Was Pretty": "그녀는 예뻤다",
    "Hwarang": "화랑",
    "Fight for My Way": "쌈 마이웨이",
    "What's Wrong with Secretary Kim": "김비서가 왜 그럴까",
    "Something in the Rain": "밥 잘 사주는 예쁜 누나",
    "Thirty-Nine": "서른아홉",
    "Crash Course in Romance": "일타 스캔들",
    "Memories of the Alhambra": "알함브라 궁전의 추억",
    "School 2013": "학교 2013",
    "I Hear Your Voice": "너의 목소리가 들려",
    "I Can Hear Your Voice": "너의 목소리가 들려",
    "Pinocchio": "피노키오",
    "W: Two Worlds": "더블유",
    "W": "더블유",
    "While You Were Sleeping": "당신이 잠든 사이에",
    "Romance Is a Bonus Book": "로맨스는 별책부록",
    "Love in the Moonlight": "구르미 그린 달빛",
    "Encounter": "남자친구",
    "Record of Youth": "청춘기록",
    "My Liberation Notes": "나의 해방일지",
    "Bad and Crazy": "배드 앤 크레이지",
    "Little Women": "작은 아씨들",
    "18 Again": "18 어게인",
    "Youth of May": "오월의 청춘",
    "One Spring Night": "봄밤",
    "My ID Is Gangnam Beauty": "내 아이디는 강남미인",
    "Gangnam Beauty": "내 아이디는 강남미인",
    "Rookie Historian Goo Hae-ryung": "신입사관 구해령",
    "School 2017": "학교 2017",
    "The Uncanny Counter": "경이로운 소문",
    "Healer": "힐러",
    "Her Private Life": "그녀의 사생활",
    "Gu Family Book": "구가의 서",
    "Cheese in the Trap": "치즈인더트랩",
    "Doctors": "닥터스",
    "Weightlifting Fairy Kim Bok-joo": "역도요정 김복주",
    "Who Are You: School 2015": "후아유: 학교 2015",
    "Yumi's Cells": "유미의 세포들",
    "My Girlfriend Is a Gumiho": "내 여자친구는 구미호",
    "Oh My Venus": "오 마이 비너스",
    "A Love to Kill": "이 죽일놈의 사랑",

    # Gong Yoo dramas
    "School 4": "학교 4",
    "Hello My Teacher": "건빵선생과 별사탕",
    "One Fine Day": "어느 멋진 날",
    "The 1st Shop of Coffee Prince": "커피프린스 1호점",
    "Big": "빅",
    "Silent Sea": "고요의 바다",
    "The Silent Sea": "고요의 바다",
    "Trunk": "트렁크",

    # Kim Soo-hyun dramas
    "Kimchi Cheese Smile": "김치 치즈 스마일",
    "Jungle Fish": "정글 피쉬",
    "Will It Snow for Christmas?": "크리스마스에 눈이 올까요?",
    "Giant": "자이언트",
    "Secretly, Greatly": "은밀하게 위대하게",
    "The Producers": "프로듀사",
    "One Ordinary Day": "어느 날",

    # IU dramas
    "You Are the Best!": "최고다 이순신",
    "Bel Ami": "예쁜 남자",
    "Pretty Man": "예쁜 남자",

    # Lee Min-ho dramas
    "Secret Campus": "비밀의 교정",
    "Mackerel Run": "달려라 고등어",
    "Get Up": "일어나",
    "Faith": "신의",
    "Pachinko": "파친코",

    # Song Joong-ki dramas
    "Get Karl! Oh Soo-jung": "칼잡이 오수정",
    "Love Racing": "연애결혼",
    "Triple": "트리플",
    "Will It Snow for Christmas": "크리스마스에 눈이 올까요?",
    "Innocent Man": "세상 어디에도 없는 착한 남자",
    "The Innocent Man": "세상 어디에도 없는 착한 남자",
    "Nice Guy": "세상 어디에도 없는 착한 남자",

    # Park Seo-joon dramas
    "A Witch's Love": "마녀의 연애",
    "Kill Me, Heal Me": "킬미, 힐미",
    "A Witch's Romance": "마녀의 연애",
    "Midnight Runners": "청년경찰",
    "Dream": "드림",
    "Gyeongseong Creature": "경성크리쳐",

    # Son Ye-jin dramas
    "Delicious Proposal": "맛있는 청혼",
    "Great Ambition": "대망",
    "Summer Scent": "여름향기",
    "Alone in Love": "연애시대",
    "Spotlight": "스포트라이트",
    "Personal Preference": "개인의 취향",

    # Hyun Bin dramas
    "Bodyguard": "보디가드",
    "Nonstop 4": "논스톱 4",
    "Ireland": "아일랜드",
    "Friend, Our Legend": "친구, 우리들의 전설",
    "The Snow Queen": "눈의 여왕",
    "Worlds Within": "그들이 사는 세상",
    "Late Autumn": "만추",
    "Hyde Jekyll, Me": "하이드 지킬, 나",
    "Confidential Assignment": "공조",

    # Song Hye-kyo dramas
    "Autumn Tale": "가을동화",
    "Hotelier": "호텔리어",
    "All In": "올인",
    "That Winter, the Wind Blows": "그 겨울, 바람이 분다",
    "First Love": "첫사랑",
    "Happy Morning": "해피 모닝",
    "Sunflower": "해바라기",
    "Guardians": "가디언즈",
    "Dark Hero": "다크 히어로",
    "Now, We Are Breaking Up": "지금, 헤어지는 중입니다",
    "Black Nuns": "블랙 넌스",

    # Lee Jong-suk dramas
    "Prosecutor Princess": "검사 프린세스",
    "Secret Garden": "시크릿 가든",
    "High Kick: Revenge of the Short Legged": "하이킥! 짧은 다리의 역습",
    "Doctor Stranger": "닥터 이방인",
    "Hymn of Death": "사의 찬미",
    "Big Mouth": "빅마우스",
    "Decoy": "디코이",

    # Park Bo-gum dramas
    "Hero": "히어로",
    "Wonderful Mama": "원더풀 마마",
    "Wonderful Days": "참 좋은 시절",
    "Tomorrow Cantabile": "내일도 칸타빌레",
    "Good Doctor": "굿 닥터",

    # Kim Ji-won dramas
    "High Kick: Revenge of the Short Legged": "하이킥! 짧은 다리의 역습",
    "To the Beautiful You": "아름다운 그대에게",
    "Waiting for Love": "설레는 로맨스",
    "Gap-dong": "갑동이",
    "Lovestruck in the City": "도시남녀의 사랑법",

    # Wi Ha-joon dramas
    "Goodbye Mr. Black": "굿바이 미스터 블랙",
    "My Golden Life": "황금빛 내 인생",
    "Romance Is a Bonus Book": "로맨스는 별책부록",
    "Midnight": "자정",
    "Goosebumps": "소름",
    "The Worst of Evil": "최악의 악",

    # Lee Do-hyun dramas
    "Prison Playbook": "슬기로운 감빵생활",
    "Still 17": "서른이지만 열일곱입니다",
    "Clean with Passion for Now": "일단 뜨겁게 청소하라",
    "Melancholia": "멜랑꼴리아",
    "The Good Bad Mother": "힘쎈여자 강남순",

    # Jung Hae-in dramas
    "Bride of the Century": "백년의 신부",
    "Blood": "블러드",
    "Reply 1988": "응답하라 1988",
    "Prison Playbook": "슬기로운 감빵생활",
    "A Piece of Your Mind": "반의반",
    "Connect": "커넥트",
    "Mom's Friend's Son": "엄마친구아들",
    "Love Next Door": "해가 지는 곳으로",

    # Cha Eun-woo dramas
    "Hit the Top": "최고의 한방",
    "My Romantic Some Recipe": "나의 로맨틱 썸 레시피",
    "Island": "아일랜드",
    "Wonderful World": "원더풀 월드",
    "A Good Day to Be a Dog": "오늘도 사랑스럽개",

    # Kim Se-jeong dramas
    "The Sound of Your Heart": "마음의 소리",
    "I Wanna Hear Your Song": "너의 노래를 들려줘",
    "Today's Webtoon": "오늘의 웹툰",
    "Connection": "커넥션",

    # Park Min-young dramas
    "High Kick!": "거침없이 하이킹",
    "I Am Sam": "아이 앰 샘",
    "Hometown of Legends": "전설의 고향",
    "Running Gu": "달려라 구선생",
    "Glory Jane": "영광의 재인",
    "A New Leaf": "개과천선",
    "Remember: War of the Son": "리멤버 - 아들의 전쟁",
    "When the Weather Is Fine": "날씨가 좋으면 찾아가겠어요",
    "Forecasting Love and Weather": "기상청 사람들",
    "Love in Contract": "월수금화목토",
    "Marry My Husband": "내 남편과 결혼해줘",

    # Bae Suzy dramas
    "Uncontrollably Fond": "함부로 애틋하게",
    "Anna": "안나",
    "Doona!": "두나!",
    "All the Love You Wish For": "원하는 모든 사랑",

    # Lee Sung-kyung dramas
    "It's Okay, That's Love": "괜찮아 사랑이야",
    "Flower of Queen": "여왕의 꽃",
    "Swag": "스웨그",
    "About Time": "멈추고 싶은 순간: 어바웃 타임",
    "Dr. Romantic 2": "낭만닥터 김사부 2",
    "Dr. Romantic 3": "낭만닥터 김사부 3",
    "Shooting Stars": "별똥별",
    "Call It Love": "사랑이라 말해요",
    "Not Others": "남의 연애",

    # Nam Joo-hyuk dramas
    "The Idle Mermaid": "잉여공주",
    "Bride of Habaek": "하백의 신부",
    "The Light in Your Eyes": "눈이 부시게",
    "The School Nurse Files": "보건교사 안은영",
    "Vigilante": "비질란테",

    # Kim Go-eun dramas
    "Little Women": "작은 아씨들",

    # Park Shin-hye dramas
    "Nonstop 4": "논스톱 4",
    "Nonstop 5": "논스톱 5",
    "Tree of Heaven": "천국의 나무",
    "You're Beautiful": "미남이시네요",
    "Heartstrings": "넌 내게 반했어",
    "Don't Worry, I'm a Ghost": "걱정마세요, 귀신입니다",
    "Flower Boy Next Door": "이웃집 꽃미남",
    "Entertainer": "딴따라",
    "Sisyphus: The Myth": "시지프스: the myth",
    "The Heirs": "상속자들",
    "Doctor Slump": "닥터 슬럼프",

    # Shin Min-a dramas
    "Beautiful Days": "아름다운 날들",
    "Punch": "펀치",
    "Devil": "악마를 보았다",
    "Gumiho": "내 여자친구는 구미호",
    "Arang and the Magistrate": "아랑사또전",
    "My Tomorrow, Your Yesterday": "나의 내일, 너의 어제",
    "Our Blues": "우리들의 블루스",
    "No Gain No Love": "손해 보기 싫어서",
    "Diva Rival": "디바 라이벌",
    "Chief of Staff": "보좌관",
    "Tomorrow, with You": "내일 그대와",

    # More missing titles
    "Beyond Evil": "괴물",
    "Bloodhounds": "사냥개들",
    "Deep Rooted Tree": "뿌리깊은 나무",
    "Dating Agency: Cyrano": "연애조작단: 시라노",
    "Death's Game": "이재, 곧 죽습니다",
    "Dr. Jin": "닥터 진",
    "Dr. Romantic": "낭만닥터 김사부",
    "Hidden Identity": "신분을 숨겨라",
    "Man to Man": "맨투맨",
    "Night Light": "불야성",
    "Once Again": "한 번 다시",
    "Persona": "페르소나",
    "Pots of Gold": "잘 키운 딸 하나",
    "Queen for Seven Days": "7일의 왕비",
    "Remember": "리멤버 - 아들의 전쟁",
    "Salamander Guru and The Shadows": "도롱뇽도사와 그림자 조작단",
    "Seven Years of Love": "애정만만세",
    "Seoul 1945": "서울 1945",
    "Sharp": "반올림",
    "Soul Mechanic": "영혼수선공",
    "Temperature of Love": "사랑의 온도",
    "The Midnight Romance in Hagwon": "선재 업고 튀어",
    "Sunlight Pours Down": "쏟아지는 햇살",
    "Wedding Dress": "웨딩드레스",
    "White Nights 3.98": "화이트나이트",
    "Yeah, That's How It Is": "그래, 그런 거야",
    "Bicheonmu": "비천무",
    "DMZ, The Wild": "DMZ, 더 와일드",
    "Confidence Queen": "퀸메이커",
    "Moon River": "문리버",
    "Marching": "마칭",
    "Lucifer": "루시퍼",
    "My Youth": "나의 청춘",
    "Brewing Love": "풍문으로 들었소",
    "OB & GY": "산부인과",
    "Soonpoong Clinic": "순풍 산부인과",
    "Six Siblings": "육남매",
    "Surely Tomorrow": "내일은 사랑",
    "Prince Hours": "궁",
    "Castle in the Time": "시간의 성",
    "Shark: The Storm": "상어",
    "Siren's Kiss": "사이렌의 키스",
    "Don't Look Back: The Legend of Orpheus": "뒤돌아보지 마",
    "Perfect Crown": "퍼펙트 크라운",
    "Portraits of Delusion": "망상의 초상",
    "When Life Gives You Tangerines": "귤이 익어갈 무렵",
    "When the Stars Gossip": "별들이 수다떨 때",
    "In Your Radiant Season": "너의 빛나는 계절에",
    "The Remarried Empress": "재혼 황후",
    "The Reason I'm Getting Married": "결혼하는 이유",
    "The East Palace": "동궁",
    "How Am I?": "나 어떡해",
    "Romance": "로망스",
    "New Generation Report:Adults Don't Know": "신세대 보고서: 어른들은 몰라요",
    "Our Sticky Love": "찐찐한 우리 사이",
    "Made in Korea": "메이드 인 코리아",
    "20 Years": "20세",
    "Whenever the Heart Beats": "두근두근할 때",
    "Doctor X: Age of the White Mafia": "닥터 X",
    "The Wonderfools": "멋진 바보들",
    "Karma": "카르마",
    "KBS Drama Special – \"My Prettiest Moments\"": "KBS 드라마 스페셜",
    "You and Everything Else": "너와 모든 것",
    "Undercover Miss Hong": "언더커버 미스 홍",
    "The New Dad is Twenty-Nine": "새아빠는 스물아홉",
    "Law and the City": "법과 도시",
    "Ja Myung Go": "자명고",
    "Genie, Make a Wish": "소원을 말해봐",
}

# Additional title normalization (Wikipedia title -> canonical title)
TITLE_NORMALIZE = {
    "Guardian: The Lonely and Great God": "Goblin",
    "The 1st Shop of Coffee Prince": "Coffee Prince",
    "My Lovely Sam Soon": "My Name Is Kim Sam-soon",
    "The Moon That Embraces the Sun": "Moon Embracing the Sun",
    "Pretty Man": "Bel Ami",
    "Nice Guy": "Innocent Man",
    "The Nice Guy": "Innocent Man",
    "Moon Lovers: Scarlet Heart Ryeo": "Scarlet Heart Ryeo",
    "Gangnam Beauty": "My ID Is Gangnam Beauty",
    "The Silent Sea": "Silent Sea",
    "I Can Hear Your Voice": "I Hear Your Voice",
    "A Witch's Romance": "A Witch's Love",
    "Autumn Tale": "Autumn in My Heart",
    "The Innocent Man": "Innocent Man",
    "Hotel del Luna": "Hotel Del Luna",
    "The Legend of the Blue Sea": "Legend of the Blue Sea",
    "Hwarang: The Poet Warrior Youth": "Hwarang",
    "The Trunk": "Trunk",
    "The Bride of Habaek": "Bride of Habaek",
    "The Hymn of Death": "Hymn of Death",
    "Flower Boys Next Door": "Flower Boy Next Door",
    "The Scandal": "Sungkyunkwan Scandal",
    "Running, Gu": "Running Gu",
    "Dr. Romantic\nCall it Love": "Dr. Romantic",
}

# Entries to remove (parsing artifacts)
BAD_ENTRIES = {"Jong-suk", "Kim Ho-young"}

# Manual role overrides: (actor_id, drama_title) -> role
# Wikipedia doesn't reliably distinguish main/supporting/guest
ROLE_OVERRIDES = {
    # Kim Ji-won
    ("kim-ji-won", "The Heirs"): "supporting",
    ("kim-ji-won", "Descendants of the Sun"): "supporting",
    ("kim-ji-won", "To the Beautiful You"): "supporting",
    ("kim-ji-won", "Gap-dong"): "supporting",
    # Wi Ha-joon
    ("wi-ha-joon", "Squid Game"): "supporting",
    ("wi-ha-joon", "Something in the Rain"): "supporting",
    ("wi-ha-joon", "Romance Is a Bonus Book"): "supporting",
    ("wi-ha-joon", "My Golden Life"): "supporting",
    ("wi-ha-joon", "Goodbye Mr. Black"): "supporting",
    # Lee Do-hyun
    ("lee-do-hyun", "Hotel Del Luna"): "supporting",
    ("lee-do-hyun", "Prison Playbook"): "guest",
    ("lee-do-hyun", "Still 17"): "supporting",
    ("lee-do-hyun", "Clean with Passion for Now"): "supporting",
    # Jung Hae-in
    ("jung-hae-in", "While You Were Sleeping"): "supporting",
    ("jung-hae-in", "Reply 1988"): "guest",
    ("jung-hae-in", "Blood"): "supporting",
    ("jung-hae-in", "Bride of the Century"): "supporting",
    # Song Joong-ki
    ("song-joong-ki", "Sungkyunkwan Scandal"): "supporting",
    # Lee Jong-suk
    ("lee-jong-suk", "Prosecutor Princess"): "supporting",
    ("lee-jong-suk", "Secret Garden"): "supporting",
    # Lee Sung-kyung
    ("lee-sung-kyung", "Cheese in the Trap"): "supporting",
    ("lee-sung-kyung", "Doctors"): "supporting",
    ("lee-sung-kyung", "It's Okay, That's Love"): "supporting",
    # Nam Joo-hyuk
    ("nam-joo-hyuk", "Who Are You: School 2015"): "supporting",
    ("nam-joo-hyuk", "Cheese in the Trap"): "supporting",
    # Bae Suzy
    ("bae-suzy", "Dream High 2"): "guest",
    # Kim Soo-hyun
    ("kim-soo-hyun", "Hotel Del Luna"): "guest",
    ("kim-soo-hyun", "Crash Landing on You"): "guest",
    # Gong Yoo
    ("gong-yoo", "Squid Game"): "guest",
    ("gong-yoo", "School 4"): "guest",
    ("gong-yoo", "Dating Agency: Cyrano"): "guest",
    # Park Bo-gum
    ("park-bo-gum", "Wonderful Days"): "supporting",
    # Park Min-young
    ("park-min-young", "Sungkyunkwan Scandal"): "supporting",
    # Park Shin-hye
    ("park-shin-hye", "Stairway to Heaven"): "supporting",
    ("park-shin-hye", "Nonstop 4"): "guest",
}

# Manual additions for actors with known missing entries
MANUAL_ADDITIONS = {
    "jung-hae-in": [
        {"title": "Reply 1988", "role": "guest"},
    ],
}


def normalize_title(title):
    return TITLE_NORMALIZE.get(title, title)


def get_korean_title(title):
    return KOREAN_TITLES.get(title, "")


def main():
    with open("filmography_raw.json") as f:
        raw = json.load(f)

    # Filter bad entries and add manual additions
    for actor_id, actor_data in raw.items():
        actor_data["dramas"] = [
            d for d in actor_data["dramas"] if d["title"] not in BAD_ENTRIES
        ]
        if actor_id in MANUAL_ADDITIONS:
            existing_titles = {d["title"] for d in actor_data["dramas"]}
            for add in MANUAL_ADDITIONS[actor_id]:
                if add["title"] not in existing_titles:
                    actor_data["dramas"].append({
                        "title": add["title"],
                        "year": 0,
                        "role": add["role"],
                        "role_name": "",
                        "notes": "",
                    })

    # Collect all unique dramas with their Korean titles
    all_dramas = set()
    missing_ko = set()
    for actor_id, actor_data in raw.items():
        for d in actor_data["dramas"]:
            title = normalize_title(d["title"])
            all_dramas.add(title)
            ko = get_korean_title(d["title"]) or get_korean_title(title)
            if not ko:
                missing_ko.add(title)

    print(f"Total unique dramas: {len(all_dramas)}")
    print(f"Missing Korean titles: {len(missing_ko)}")
    if missing_ko:
        print("Missing:")
        for t in sorted(missing_ko):
            print(f"  - {t}")

    # Build actors JS
    lines = []
    lines.append("export const ROLE_CONFIG = {")
    lines.append("  main: { label: 'Main', points: 1 },")
    lines.append("  supporting: { label: 'Supporting', points: 3 },")
    lines.append("  guest: { label: 'Guest', points: 5 },")
    lines.append("};")
    lines.append("")
    lines.append("export const ROUNDS_PER_GAME = 5;")
    lines.append("")
    lines.append("export const EPISODE_THRESHOLDS = [1, 3, 5, 7, 10, 13, 16, 19, 22, 26, 30, 34, 38, 42, 46, 50];")
    lines.append("")
    lines.append("export const ACTORS = [")

    for actor_id, actor_data in raw.items():
        lines.append("  {")
        lines.append(f"    id: '{actor_id}',")
        lines.append(f"    name: '{actor_data['name']}',")
        lines.append(f"    nameKo: '{actor_data['nameKo']}',")
        lines.append("    dramas: [")

        seen_titles = set()
        for d in actor_data["dramas"]:
            title = normalize_title(d["title"])
            if title in seen_titles:
                continue
            seen_titles.add(title)

            ko = get_korean_title(d["title"]) or get_korean_title(title)
            # Apply role overrides
            role = ROLE_OVERRIDES.get((actor_id, title), d["role"])
            # Escape single quotes in titles
            title_escaped = title.replace("'", "\\'")
            ko_escaped = ko.replace("'", "\\'")

            lines.append(
                f"      {{ title: '{title_escaped}', titleKo: '{ko_escaped}', role: '{role}' }},"
            )

        lines.append("    ],")
        lines.append("  },")

    lines.append("];")
    lines.append("")

    # Add utility functions
    lines.append("""export function getRandomActors(count) {
  const shuffled = [...ACTORS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function buildDramaIndex() {
  const seen = new Set();
  const list = [];
  for (const actor of ACTORS) {
    for (const d of actor.dramas) {
      if (!seen.has(d.title)) {
        seen.add(d.title);
        list.push({
          title: d.title,
          titleKo: d.titleKo,
          lower: d.title.toLowerCase(),
          lowerKo: d.titleKo.toLowerCase(),
        });
      }
    }
  }
  return list.sort((a, b) => a.title.localeCompare(b.title));
}

export function searchAllDramas(query, index) {
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

export function getEpisode(score) {
  let ep = 0;
  for (let i = 0; i < EPISODE_THRESHOLDS.length; i++) {
    if (score >= EPISODE_THRESHOLDS[i]) ep = i + 1;
    else break;
  }
  return ep;
}
""")

    output = "\n".join(lines)
    with open("src/data/actors.js", "w") as f:
        f.write(output)

    print(f"\nWrote src/data/actors.js")
    # Count total dramas in output
    total_dramas = sum(len(a["dramas"]) for a in raw.values())
    print(f"Total drama entries: {total_dramas}")


if __name__ == "__main__":
    main()
