// ─────────────────────────────────────────────────────────────────────────────
// emotionData.ts
// 실제 서버 이미지 경로로 교체할 때: img 필드만 수정하면 됩니다.
// 경로 패턴: /resource/img/reform/feeling/img_soso_05.png
// ─────────────────────────────────────────────────────────────────────────────

export interface EmotionItem {
  cd: string;        // 감정 코드
  img: string;       // 이미지 경로
  color: string;     // 휠 링 색상
  priceList: number[]; // 금액 목록 (셔플됨)
  textList: string[];  // 문구 목록 (셔플됨)
  // 런타임에 추가되는 필드
  text?: string;     // 현재 표시 문구 (textList[0])
  price?: number;    // 현재 표시 금액 (priceList[0])
  index?: number;    // 배열 인덱스
}

// 더미 이미지: 실제 경로로 교체하세요
const IMG = (name: string) => `/resource/img/reform/feeling/${name}`;

export const EMOTION_DATA: EmotionItem[] = [
  // ── SOSO (담담 ~ 쏘쏘) ────────────────────────────────────────────────────
  {
    cd: 'S05',
    img: IMG('img_soso_05.png'),
    color: '#FFD500',
    priceList: [1004, 1004, 333],
    textList: ['담담한 기분:)', '내 마음에 평화', '소소한 행복이 소중해'],
  },
  {
    cd: 'S04',
    img: IMG('img_soso_04.png'),
    color: '#BFF50F',
    priceList: [1000, 5898, 5898],
    textList: ['나도 내 기분을 잘 모르겠어', '기분이 오락가락', '하루종일 정신없네'],
  },
  {
    cd: 'S03',
    img: IMG('img_soso_03.png'),
    color: '#BFF50F',
    priceList: [1234, 20000, 222],
    textList: ['오늘은 적당히 나쁘지 않은듯!', '이만하면 그럭저럭 괜찮군', '갓생은 내일부터'],
  },
  {
    cd: 'S02',
    img: IMG('img_soso_02.png'),
    color: '#84E409',
    priceList: [10004, 1000, 1000],
    textList: ['만사가 귀찮은 하루', '아무 생각이 없다', '그냥저냥 soso한 날'],
  },
  {
    cd: 'S01',
    img: IMG('img_soso_01.png'),
    color: '#3ECC6B',
    priceList: [5959, 2929, 2929],
    textList: ['오... 어떡하지....?', '흠 이게 뭐람...?', '이건 좀 아닌거 같은데..'],
  },

  // ── SAD (우울 ~ 슬픔) ─────────────────────────────────────────────────────
  {
    cd: 'De5',
    img: IMG('img_sad_05.png'),
    color: '#00BD9D',
    priceList: [9009, 5959, 5959],
    textList: ['힝 마음이 울적해', '오구오구 힘든하루였어', '토닥토닥 셀프위로가 필요해'],
  },
  {
    cd: 'De4',
    img: IMG('img_sad_04.png'),
    color: '#42C3FF',
    priceList: [808, 808, 9009],
    textList: ['세상이 너무 험난해', '눈에서 자꾸 땀이 흐르네ㅠ', '속상하고 섭섭해 진짜 ㅠㅠ'],
  },
  {
    cd: 'De3',
    img: IMG('img_sad_03.png'),
    color: '#00A8EB',
    priceList: [5959, 808, 808],
    textList: ['우울하다 우울해ㅠ', '따흐흑 눙....물...', '난 이번 생은 틀렸어...'],
  },
  {
    cd: 'De2',
    img: IMG('img_sad_02.png'),
    color: '#4788FF',
    priceList: [119, 5959, 5959],
    textList: ['너무 힘들어 ㅠ_ㅠ', '흑흑 혼자 있고싶어', 'ㅎㅏ....진짜 울고싶다'],
  },
  {
    cd: 'De1',
    img: IMG('img_sad_01.png'),
    color: '#3D6AFF',
    priceList: [5959, 119, 119],
    textList: ['오구오구 힐링이 필요해', '아이고 삭신이야...', '흑흑 마음이 아프다'],
  },

  // ── ANGER (짜증 ~ 분노) ───────────────────────────────────────────────────
  {
    cd: 'A05',
    img: IMG('img_anger_05.png'),
    color: '#7357FF',
    priceList: [444, 444, 444],
    textList: ['그냥 다 때려치고싶어ㅜ_ㅜ', '완전 멘탈붕괴', '이게 사는건가...'],
  },
  {
    cd: 'A04',
    img: IMG('img_anger_04.png'),
    color: '#CB2EE0',
    priceList: [2848, 666, 666],
    textList: ['아니 정말 보자보자 하니까?!', '오늘 나 좀 건드리지마라', '자꾸이러면 삐뚤어질거야'],
  },
  {
    cd: 'A03',
    img: IMG('img_anger_03.png'),
    color: '#FF4782',
    priceList: [11010, 11010, 1818],
    textList: ['흥! 세상 짜증나네', '이게 말이야 방구야', '(할말하않) (대충 심한욕)'],
  },
  {
    cd: 'A02',
    img: IMG('img_anger_02.png'),
    color: '#FF5252',
    priceList: [444, 444, 1818],
    textList: ['이러다 정말 화날지도 몰라', '진짜 나 다 때려칠거야!!!', '아니 도대체 왜이러는건데!?'],
  },
  {
    cd: 'A01',
    img: IMG('img_anger_01.png'),
    color: '#FF3224',
    priceList: [1010, 1818, 1818],
    textList: ['이건 대략 10년치 스트레스다', '뭐라는거야 진짜 -_-', '열받네 진짜-_- 부들부들...'],
  },

  // ── HAPPY (설렘 ~ 행복) ───────────────────────────────────────────────────
  {
    cd: 'H05',
    img: IMG('img_happy_05.png'),
    color: '#FF8F00',
    priceList: [486, 486, 555],
    textList: ['하루종일 행복한 날', '오늘은 사랑이 넘쳐 ♡', '매일이 오늘 같기를!'],
  },
  {
    cd: 'H04',
    img: IMG('img_happy_04.png'),
    color: '#FFAA00',
    priceList: [888, 888, 10000],
    textList: ['ㅋㅋㅋ 진짜 빵터졌다 ㅋㅋㅋ', '온종일 웃음이 멈추질 않아 ㅋㅋㅋ', '웃음 에너지 풀충전 완료:D'],
  },
  {
    cd: 'H03',
    img: IMG('img_happy_03.png'),
    color: '#FFC300',
    priceList: [555, 8282, 555],
    textList: ['나를 위해 짝짝짝', '둠칫둠칫 파티다 파티!', '오오오 완전 신나!'],
  },
  {
    cd: 'H02',
    img: IMG('img_happy_02.png'),
    color: '#FFD500',
    priceList: [777, 777, 1111],
    textList: ['뭘해도 다 되는 하루', '오늘 하루종일 완전 럭키!', '나 천재인가? 좀 쩌는듯'],
  },
  {
    cd: 'H01',
    img: IMG('img_happy_01.png'),
    color: '#FFD500',
    priceList: [777, 8787, 777],
    textList: ['왠지 두근두근 설레는 날!', '기분이 반짝반짝', '완전 기분 좋아!'],
  },
];
