/* ============================================================
   KOREAN LANGUAGE LEARNING PLATFORM — script.js
   ============================================================ */

'use strict';

/* ============================================================
   DATA
   ============================================================ */

const CONSONANTS = [
  { char: 'ㄱ', rom: 'g/k',  name: 'Giyeok',   example: '가', exEn: 'go / ga' },
  { char: 'ㄴ', rom: 'n',    name: 'Nieun',     example: '나', exEn: 'I / na' },
  { char: 'ㄷ', rom: 'd/t',  name: 'Digeut',    example: '다', exEn: 'da' },
  { char: 'ㄹ', rom: 'r/l',  name: 'Rieul',     example: '라', exEn: 'la' },
  { char: 'ㅁ', rom: 'm',    name: 'Mieum',     example: '마', exEn: 'ma' },
  { char: 'ㅂ', rom: 'b/p',  name: 'Bieup',     example: '바', exEn: 'ba' },
  { char: 'ㅅ', rom: 's',    name: 'Siot',      example: '사', exEn: 'sa' },
  { char: 'ㅇ', rom: 'ng/-', name: 'Ieung',     example: '아', exEn: 'a' },
  { char: 'ㅈ', rom: 'j',    name: 'Jieut',     example: '자', exEn: 'ja' },
  { char: 'ㅊ', rom: 'ch',   name: 'Chieut',    example: '차', exEn: 'cha' },
  { char: 'ㅋ', rom: 'k',    name: 'Kieuk',     example: '카', exEn: 'ka' },
  { char: 'ㅌ', rom: 't',    name: 'Tieut',     example: '타', exEn: 'ta' },
  { char: 'ㅍ', rom: 'p',    name: 'Pieup',     example: '파', exEn: 'pa' },
  { char: 'ㅎ', rom: 'h',    name: 'Hieut',     example: '하', exEn: 'ha' },
];

const VOWELS = [
  { char: 'ㅏ', rom: 'a',   name: 'A',    example: '아', exEn: 'a' },
  { char: 'ㅑ', rom: 'ya',  name: 'Ya',   example: '야', exEn: 'ya' },
  { char: 'ㅓ', rom: 'eo',  name: 'Eo',   example: '어', exEn: 'eo' },
  { char: 'ㅕ', rom: 'yeo', name: 'Yeo',  example: '여', exEn: 'yeo' },
  { char: 'ㅗ', rom: 'o',   name: 'O',    example: '오', exEn: 'o' },
  { char: 'ㅛ', rom: 'yo',  name: 'Yo',   example: '요', exEn: 'yo' },
  { char: 'ㅜ', rom: 'u',   name: 'U',    example: '우', exEn: 'u' },
  { char: 'ㅠ', rom: 'yu',  name: 'Yu',   example: '유', exEn: 'yu' },
  { char: 'ㅡ', rom: 'eu',  name: 'Eu',   example: '으', exEn: 'eu' },
  { char: 'ㅣ', rom: 'i',   name: 'I',    example: '이', exEn: 'i' },
];

const SYLLABLE_EXAMPLES = [
  { eq: 'ㄱ + ㅏ', result: '가' },
  { eq: 'ㄴ + ㅏ', result: '나' },
  { eq: 'ㄷ + ㅏ', result: '다' },
  { eq: 'ㄹ + ㅏ', result: '라' },
  { eq: 'ㅁ + ㅏ', result: '마' },
  { eq: 'ㅂ + ㅏ', result: '바' },
  { eq: 'ㅅ + ㅏ', result: '사' },
  { eq: 'ㅇ + ㅏ', result: '아' },
];

const BATCHIM_EXAMPLES = [
  { syl: '각', rom: 'gak' },
  { syl: '간', rom: 'gan' },
  { syl: '갈', rom: 'gal' },
  { syl: '감', rom: 'gam' },
  { syl: '갑', rom: 'gap' },
  { syl: '강', rom: 'gang' },
  { syl: '밥', rom: 'bap' },
  { syl: '닭', rom: 'dak' },
  { syl: '곰', rom: 'gom' },
  { syl: '산', rom: 'san' },
  { syl: '물', rom: 'mul' },
  { syl: '눈', rom: 'nun' },
];

/* Approximate syllable composition map for the constructor */
const SYLLABLE_MAP = buildSyllableMap();

function buildSyllableMap() {
  const cons = ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const vows = ['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ'];
  // Precomputed subset for common consonant+vowel combinations
  const table = {
    'ㄱ': { 'ㅏ':'가','ㅑ':'갸','ㅓ':'거','ㅕ':'겨','ㅗ':'고','ㅛ':'교','ㅜ':'구','ㅠ':'규','ㅡ':'그','ㅣ':'기' },
    'ㄴ': { 'ㅏ':'나','ㅑ':'냐','ㅓ':'너','ㅕ':'녀','ㅗ':'노','ㅛ':'뇨','ㅜ':'누','ㅠ':'뉴','ㅡ':'느','ㅣ':'니' },
    'ㄷ': { 'ㅏ':'다','ㅑ':'댜','ㅓ':'더','ㅕ':'뎌','ㅗ':'도','ㅛ':'됴','ㅜ':'두','ㅠ':'듀','ㅡ':'드','ㅣ':'디' },
    'ㄹ': { 'ㅏ':'라','ㅑ':'랴','ㅓ':'러','ㅕ':'려','ㅗ':'로','ㅛ':'료','ㅜ':'루','ㅠ':'류','ㅡ':'르','ㅣ':'리' },
    'ㅁ': { 'ㅏ':'마','ㅑ':'먀','ㅓ':'머','ㅕ':'며','ㅗ':'모','ㅛ':'묘','ㅜ':'무','ㅠ':'뮤','ㅡ':'므','ㅣ':'미' },
    'ㅂ': { 'ㅏ':'바','ㅑ':'뱌','ㅓ':'버','ㅕ':'벼','ㅗ':'보','ㅛ':'뵤','ㅜ':'부','ㅠ':'뷰','ㅡ':'브','ㅣ':'비' },
    'ㅅ': { 'ㅏ':'사','ㅑ':'샤','ㅓ':'서','ㅕ':'셔','ㅗ':'소','ㅛ':'쇼','ㅜ':'수','ㅠ':'슈','ㅡ':'스','ㅣ':'시' },
    'ㅇ': { 'ㅏ':'아','ㅑ':'야','ㅓ':'어','ㅕ':'여','ㅗ':'오','ㅛ':'요','ㅜ':'우','ㅠ':'유','ㅡ':'으','ㅣ':'이' },
    'ㅈ': { 'ㅏ':'자','ㅑ':'쟈','ㅓ':'저','ㅕ':'져','ㅗ':'조','ㅛ':'죠','ㅜ':'주','ㅠ':'쥬','ㅡ':'즈','ㅣ':'지' },
    'ㅊ': { 'ㅏ':'차','ㅑ':'챠','ㅓ':'처','ㅕ':'쳐','ㅗ':'초','ㅛ':'쵸','ㅜ':'추','ㅠ':'츄','ㅡ':'츠','ㅣ':'치' },
    'ㅋ': { 'ㅏ':'카','ㅑ':'캬','ㅓ':'커','ㅕ':'켜','ㅗ':'코','ㅛ':'쿄','ㅜ':'쿠','ㅠ':'큐','ㅡ':'크','ㅣ':'키' },
    'ㅌ': { 'ㅏ':'타','ㅑ':'탸','ㅓ':'터','ㅕ':'텨','ㅗ':'토','ㅛ':'툐','ㅜ':'투','ㅠ':'튜','ㅡ':'트','ㅣ':'티' },
    'ㅍ': { 'ㅏ':'파','ㅑ':'퍄','ㅓ':'퍼','ㅕ':'펴','ㅗ':'포','ㅛ':'표','ㅜ':'푸','ㅠ':'퓨','ㅡ':'프','ㅣ':'피' },
    'ㅎ': { 'ㅏ':'하','ㅑ':'햐','ㅓ':'허','ㅕ':'혀','ㅗ':'호','ㅛ':'효','ㅜ':'후','ㅠ':'휴','ㅡ':'흐','ㅣ':'히' },
  };
  return table;
}

/* Vocabulary */
const VOCAB = {
  greetings: [
    { kr:'안녕하세요', rom:'an·nyeong·ha·se·yo', en:'Hello (formal)', ex_kr:'안녕하세요, 저는 학생이에요.', ex_en:'Hello, I am a student.' },
    { kr:'감사합니다', rom:'gam·sa·ham·ni·da',   en:'Thank you (formal)', ex_kr:'감사합니다!', ex_en:'Thank you!' },
    { kr:'죄송합니다', rom:'joe·song·ham·ni·da', en:'I am sorry (formal)', ex_kr:'죄송합니다, 늦었어요.', ex_en:'I am sorry, I am late.' },
    { kr:'안녕히 가세요', rom:'an·nyeong·hi ga·se·yo', en:'Goodbye (to person leaving)', ex_kr:'안녕히 가세요!', ex_en:'Goodbye!' },
    { kr:'네',  rom:'ne',   en:'Yes', ex_kr:'네, 알겠어요.', ex_en:'Yes, I understand.' },
    { kr:'아니요', rom:'a·ni·yo', en:'No', ex_kr:'아니요, 저는 학생이 아니에요.', ex_en:'No, I am not a student.' },
  ],
  numbers: [
    { kr:'일', rom:'il', en:'One (sino-Korean)', ex_kr:'일 층', ex_en:'First floor' },
    { kr:'이', rom:'i',  en:'Two (sino-Korean)', ex_kr:'이 분', ex_en:'Two minutes' },
    { kr:'삼', rom:'sam',en:'Three', ex_kr:'삼 월', ex_en:'March' },
    { kr:'사', rom:'sa', en:'Four',  ex_kr:'사 일', ex_en:'Four days' },
    { kr:'오', rom:'o',  en:'Five',  ex_kr:'오 시', ex_en:'Five o\'clock' },
    { kr:'하나', rom:'ha·na', en:'One (native Korean)', ex_kr:'하나, 둘, 셋', ex_en:'One, two, three' },
    { kr:'둘',  rom:'dul',    en:'Two (native)',  ex_kr:'둘 다', ex_en:'Both' },
    { kr:'셋',  rom:'set',    en:'Three (native)', ex_kr:'셋이에요.', ex_en:'There are three.' },
  ],
  people: [
    { kr:'저', rom:'jeo',   en:'I (formal)', ex_kr:'저는 학생이에요.', ex_en:'I am a student.' },
    { kr:'나', rom:'na',    en:'I (informal)', ex_kr:'나는 친구야.', ex_en:'I am a friend.' },
    { kr:'선생님', rom:'seon·saeng·nim', en:'Teacher', ex_kr:'선생님, 감사합니다.', ex_en:'Thank you, teacher.' },
    { kr:'학생', rom:'hak·saeng', en:'Student', ex_kr:'저는 학생이에요.', ex_en:'I am a student.' },
    { kr:'친구', rom:'chin·gu',   en:'Friend',  ex_kr:'제 친구예요.', ex_en:'This is my friend.' },
    { kr:'가족', rom:'ga·jok',    en:'Family',  ex_kr:'가족이 많아요?', ex_en:'Do you have a large family?' },
  ],
  places: [
    { kr:'학교', rom:'hak·gyo', en:'School', ex_kr:'학교에 가요.', ex_en:'I go to school.' },
    { kr:'집',   rom:'jip',     en:'House / Home', ex_kr:'집에 있어요.', ex_en:'I am at home.' },
    { kr:'도서관', rom:'do·seo·gwan', en:'Library', ex_kr:'도서관에서 공부해요.', ex_en:'I study at the library.' },
    { kr:'식당', rom:'sik·dang', en:'Restaurant', ex_kr:'식당에 가요.', ex_en:'I go to the restaurant.' },
    { kr:'병원', rom:'byeong·won', en:'Hospital', ex_kr:'병원에 가요.', ex_en:'I go to the hospital.' },
    { kr:'서울', rom:'se·ul', en:'Seoul', ex_kr:'서울에 살아요.', ex_en:'I live in Seoul.' },
  ],
  food: [
    { kr:'밥',  rom:'bap',       en:'Rice / Meal', ex_kr:'밥을 먹어요.', ex_en:'I eat rice.' },
    { kr:'물',  rom:'mul',       en:'Water', ex_kr:'물을 마셔요.', ex_en:'I drink water.' },
    { kr:'김치', rom:'gim·chi',  en:'Kimchi', ex_kr:'김치를 좋아해요.', ex_en:'I like kimchi.' },
    { kr:'국',  rom:'guk',       en:'Soup', ex_kr:'국이 뜨거워요.', ex_en:'The soup is hot.' },
    { kr:'빵',  rom:'ppang',     en:'Bread', ex_kr:'빵을 먹어요.', ex_en:'I eat bread.' },
    { kr:'커피', rom:'keo·pi',   en:'Coffee', ex_kr:'커피를 마셔요.', ex_en:'I drink coffee.' },
  ],
  daily: [
    { kr:'공부', rom:'gong·bu',     en:'Study', ex_kr:'한국어를 공부해요.', ex_en:'I study Korean.' },
    { kr:'일',   rom:'il',          en:'Work', ex_kr:'일을 해요.', ex_en:'I work.' },
    { kr:'운동', rom:'un·dong',     en:'Exercise', ex_kr:'운동을 해요.', ex_en:'I exercise.' },
    { kr:'책',   rom:'chaek',       en:'Book', ex_kr:'책을 읽어요.', ex_en:'I read a book.' },
    { kr:'시간', rom:'si·gan',      en:'Time', ex_kr:'시간이 없어요.', ex_en:'I have no time.' },
    { kr:'한국어', rom:'han·gu·geo', en:'Korean language', ex_kr:'한국어가 어려워요.', ex_en:'Korean is difficult.' },
  ],
};

/* Grammar lessons */
const GRAMMAR_LESSONS = [
  {
    num: '01',
    title: 'Topic Marker — 은/는',
    sentence: '저는 학생이에요.',
    morphemes: [
      { kr:'저', role:'Pronoun', gloss:'I' },
      { kr:'는', role:'Topic', gloss:'topic marker' },
      { kr:'학생', role:'Noun', gloss:'student' },
      { kr:'이에요', role:'Copula', gloss:'am/is/are' },
    ],
    translation: '"I am a student."',
    rule: '<strong>은/는</strong> attaches to the topic of the sentence. Use <strong>는</strong> after a vowel-final noun, <strong>은</strong> after a consonant-final noun.',
  },
  {
    num: '02',
    title: 'Object Marker — 을/를',
    sentence: '저는 밥을 먹어요.',
    morphemes: [
      { kr:'저', role:'Pronoun', gloss:'I' },
      { kr:'는', role:'Topic', gloss:'topic marker' },
      { kr:'밥', role:'Noun', gloss:'rice' },
      { kr:'을', role:'Object', gloss:'object marker' },
      { kr:'먹어요', role:'Verb', gloss:'eat (present)' },
    ],
    translation: '"I eat rice."',
    rule: '<strong>을/를</strong> marks the direct object. Use <strong>를</strong> after a vowel-final noun, <strong>을</strong> after a consonant-final noun.',
  },
  {
    num: '03',
    title: 'Location Marker — 에',
    sentence: '저는 학교에 가요.',
    morphemes: [
      { kr:'저', role:'Pronoun', gloss:'I' },
      { kr:'는', role:'Topic', gloss:'topic marker' },
      { kr:'학교', role:'Noun', gloss:'school' },
      { kr:'에', role:'Location', gloss:'to / at' },
      { kr:'가요', role:'Verb', gloss:'go (present)' },
    ],
    translation: '"I go to school."',
    rule: '<strong>에</strong> marks destination or location in static contexts. It attaches directly to the noun without change.',
  },
  {
    num: '04',
    title: 'Korean Sentence Order — SOV',
    sentence: '저는 한국어를 공부해요.',
    morphemes: [
      { kr:'저', role:'Subject', gloss:'I' },
      { kr:'는', role:'Topic', gloss:'topic marker' },
      { kr:'한국어', role:'Object', gloss:'Korean' },
      { kr:'를', role:'Object', gloss:'object marker' },
      { kr:'공부해요', role:'Verb', gloss:'study (present)' },
    ],
    translation: '"I study Korean."',
    rule: 'Korean follows <strong>Subject → Object → Verb</strong> order. The verb always appears at the end of the sentence. Markers, not word order, determine grammatical roles.',
  },
];

/* Grammar comparison pairs — extends the existing Grammar section, does not add a new page */
const GRAMMAR_COMPARISONS = [
  { pair:'은/는 vs 이/가', meaning:'Both can mark a subject, but 은/는 marks the topic (what the sentence is about) while 이/가 marks the grammatical subject, often introducing new or contrasted information.',
    examples:[{kr:'저는 학생이에요.', en:'I am a student. (topic: as for me)'},{kr:'제가 학생이에요.', en:'I am the student. (identifying who, among others)'}],
    usage:'Use 은/는 for topics, generalizations, and contrast. Use 이/가 for new information, questions like "who/what," and inside subordinate clauses.' },
  { pair:'에 vs 에서', meaning:'에 marks a destination or the location something exists (static); 에서 marks the location where an action happens (dynamic).',
    examples:[{kr:'학교에 가요.', en:'I go to school.'},{kr:'학교에서 공부해요.', en:'I study at school.'}],
    usage:'Use 에 with 있다/가다/오다-type verbs about existence or movement toward a place. Use 에서 with action verbs happening within a place.' },
  { pair:'안 vs 못', meaning:'안 negates by choice ("do not"); 못 negates by inability ("cannot").',
    examples:[{kr:'안 가요.', en:'I\'m not going. (choice)'},{kr:'못 가요.', en:'I can\'t go. (unable to)'}],
    usage:'Use 안 for simple negation or when the subject chooses not to act. Use 못 when circumstances prevent the action.' },
  { pair:'고 있다 vs 아/어 있다', meaning:'고 있다 shows an action in progress; 아/어 있다 shows the resulting state after an action is completed.',
    examples:[{kr:'앉고 있어요.', en:'I am (in the process of) sitting down.'},{kr:'앉아 있어요.', en:'I am seated / sitting.'}],
    usage:'고 있다 works with most action verbs for ongoing actions. 아/어 있다 is limited to verbs with a clear resulting state, like 앉다, 서다, 눕다.' },
  { pair:'지만 vs 는데', meaning:'Both can mean "but," yet 는데 is softer and often sets up background or a segue, while 지만 is a more direct contrast.',
    examples:[{kr:'비싸지만 맛있어요.', en:'It\'s expensive, but delicious. (direct contrast)'},{kr:'비싼데 맛있어요.', en:'It\'s expensive, and (by the way) it\'s delicious. (softer, connective)'}],
    usage:'Use 지만 for a clear contrast. Use 는데 for background information, mild contrast, or leading into a related comment or question.' },
  { pair:'아/어 보다 vs 아/어 버리다', meaning:'아/어 보다 means "to try doing"; 아/어 버리다 means an action was completed, often with a nuance of relief or regret.',
    examples:[{kr:'한번 먹어 보세요.', en:'Try eating it once.'},{kr:'다 먹어 버렸어요.', en:'I ended up eating it all. (finished, often with feeling)'}],
    usage:'Use 아/어 보다 to suggest or describe trying something new. Use 아/어 버리다 to emphasize an action\'s completion and its emotional weight.' },
  { pair:'Present vs. Progressive', meaning:'The plain present tense (아요/어요) can describe habits or immediate present; -고 있다 specifically marks an action unfolding right now.',
    examples:[{kr:'저는 매일 공부해요.', en:'I study every day. (habit)'},{kr:'저는 지금 공부하고 있어요.', en:'I am studying right now. (in progress)'}],
    usage:'Use plain present for habits, facts, and near-future plans. Use -고 있다 to emphasize that something is happening at this moment.' },
  { pair:'Past vs. Experience (ㄴ 적 있다)', meaning:'Simple past (았/었어요) states that something happened; -ㄴ/은 적 있다 emphasizes that it has happened at least once, as a life experience.',
    examples:[{kr:'작년에 한국에 갔어요.', en:'I went to Korea last year. (simple fact)'},{kr:'한국에 가 본 적 있어요.', en:'I have been to Korea before. (experience)'}],
    usage:'Use simple past for a specific, completed event. Use -ㄴ 적 있다 when the point is "I have done this at some point."' },
];

/* Sentence builder exercises */
const BUILDER_EXERCISES = [
  {
    level: 1,
    levelDesc: 'Basic Subject + Predicate',
    prompt: 'I am a student.',
    blocks: ['저는', '학생', '이에요', '학교'],
    answer: ['저는', '학생', '이에요'],
  },
  {
    level: 1,
    levelDesc: 'Basic Subject + Predicate',
    prompt: 'I am a friend.',
    blocks: ['저는', '친구', '이에요', '학교'],
    answer: ['저는', '친구', '이에요'],
  },
  {
    level: 2,
    levelDesc: 'Subject + Object + Verb',
    prompt: 'I eat rice.',
    blocks: ['저는', '밥을', '먹어요', '가요', '학교에'],
    answer: ['저는', '밥을', '먹어요'],
  },
  {
    level: 2,
    levelDesc: 'Subject + Object + Verb',
    prompt: 'I drink water.',
    blocks: ['저는', '물을', '마셔요', '밥을', '먹어요'],
    answer: ['저는', '물을', '마셔요'],
  },
  {
    level: 3,
    levelDesc: 'Subject + Location + Verb',
    prompt: 'I go to school.',
    blocks: ['저는', '학교에', '가요', '밥을', '먹어요'],
    answer: ['저는', '학교에', '가요'],
  },
  {
    level: 3,
    levelDesc: 'Subject + Location + Verb',
    prompt: 'I am at home.',
    blocks: ['저는', '집에', '있어요', '학교에', '가요'],
    answer: ['저는', '집에', '있어요'],
  },
  {
    level: 4,
    levelDesc: 'Full SOV Sentence',
    prompt: 'I study Korean.',
    blocks: ['저는', '한국어를', '공부해요', '학교에', '가요'],
    answer: ['저는', '한국어를', '공부해요'],
  },
  {
    level: 4,
    levelDesc: 'Full SOV Sentence',
    prompt: 'I read a book.',
    blocks: ['저는', '책을', '읽어요', '한국어를', '공부해요'],
    answer: ['저는', '책을', '읽어요'],
  },
  {
    level: 5,
    levelDesc: 'Past Tense',
    prompt: 'I went to school yesterday.',
    blocks: ['어제', '학교에', '갔어요', '저는', '책을'],
    answer: ['어제', '학교에', '갔어요'],
  },
  {
    level: 5,
    levelDesc: 'Past Tense',
    prompt: 'I studied Korean.',
    blocks: ['저는', '한국어를', '공부했어요', '학교에', '갔어요'],
    answer: ['저는', '한국어를', '공부했어요'],
  },
];

/* Practice: Hangul Quiz */
const HANGUL_QUIZ = [
  { char:'ㄱ', correct:'g/k', options:['g/k','n','m','s'] },
  { char:'ㄴ', correct:'n',   options:['r/l','n','b/p','h'] },
  { char:'ㄷ', correct:'d/t', options:['d/t','j','p','k'] },
  { char:'ㄹ', correct:'r/l', options:['r/l','n','m','s'] },
  { char:'ㅁ', correct:'m',   options:['b/p','g/k','m','s'] },
  { char:'ㅂ', correct:'b/p', options:['m','b/p','h','ng'] },
  { char:'ㅅ', correct:'s',   options:['j','s','ch','h'] },
  { char:'ㅇ', correct:'ng/-',options:['h','ng/-','n','g/k'] },
  { char:'ㅈ', correct:'j',   options:['ch','j','s','h'] },
  { char:'ㅎ', correct:'h',   options:['h','s','k','p'] },
  { char:'ㅏ', correct:'a',   options:['a','eo','o','u'] },
  { char:'ㅓ', correct:'eo',  options:['a','eo','o','eu'] },
  { char:'ㅗ', correct:'o',   options:['u','o','eu','i'] },
  { char:'ㅜ', correct:'u',   options:['o','u','eu','a'] },
  { char:'ㅣ', correct:'i',   options:['eu','i','ya','a'] },
];

/* Practice: Vocab Quiz */
const VOCAB_QUIZ = [
  { kr:'학교', correct:'school',  options:['school','friend','food','book'] },
  { kr:'친구', correct:'friend',  options:['family','student','friend','teacher'] },
  { kr:'밥',   correct:'rice',    options:['water','bread','rice','soup'] },
  { kr:'물',   correct:'water',   options:['coffee','water','food','bread'] },
  { kr:'책',   correct:'book',    options:['book','time','work','exercise'] },
  { kr:'집',   correct:'home',    options:['school','library','home','hospital'] },
  { kr:'선생님', correct:'teacher', options:['student','teacher','friend','family'] },
  { kr:'공부', correct:'study',   options:['work','exercise','eat','study'] },
  { kr:'감사합니다', correct:'thank you', options:['hello','sorry','thank you','goodbye'] },
  { kr:'한국어', correct:'Korean language', options:['school','Korean language','book','time'] },
];

/* Practice: Word Order */
const WORD_ORDER_EXERCISES = [
  { prompt:'저는 학교에 가요.', words:['학교에','저는','가요'], answer:'저는 학교에 가요.' },
  { prompt:'저는 밥을 먹어요.', words:['밥을','먹어요','저는'], answer:'저는 밥을 먹어요.' },
  { prompt:'저는 한국어를 공부해요.', words:['한국어를','저는','공부해요'], answer:'저는 한국어를 공부해요.' },
  { prompt:'어제 학교에 갔어요.', words:['학교에','어제','갔어요'], answer:'어제 학교에 갔어요.' },
  { prompt:'저는 책을 읽어요.', words:['읽어요','책을','저는'], answer:'저는 책을 읽어요.' },
];


/* ============================================================
   NAVIGATION
   ============================================================ */

let currentSection = 'overview';

function navigateTo(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Show target
  const target = document.getElementById('section-' + sectionId);
  if (target) target.classList.add('active');

  // Update sidebar nav
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.section === sectionId);
  });
  // Update mobile nav
  document.querySelectorAll('.mobile-nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.section === sectionId);
  });

  currentSection = sectionId;

  // Scroll main to top
  const main = document.getElementById('main');
  if (main) main.scrollTop = 0;
  window.scrollTo(0, 0);
}

function initNavigation() {
  document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo(this.dataset.section);
      closeMobileSidebar();
    });
  });

  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', function() {
      navigateTo(this.dataset.goto);
      closeMobileSidebar();
    });
  });
}

/* ============================================================
   MOBILE SIDEBAR (off-canvas toggle)
   ============================================================ */

function openMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const btn = document.getElementById('mobileMenuBtn');
  if (!sidebar) return;
  sidebar.classList.add('open');
  if (backdrop) backdrop.classList.add('visible');
  if (btn) btn.setAttribute('aria-expanded', 'true');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const btn = document.getElementById('mobileMenuBtn');
  if (!sidebar) return;
  sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('visible');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function initMobileSidebar() {
  const btn = document.getElementById('mobileMenuBtn');
  const backdrop = document.getElementById('sidebarBackdrop');
  const sidebar = document.getElementById('sidebar');
  if (!btn || !sidebar) return;

  btn.addEventListener('click', function() {
    if (sidebar.classList.contains('open')) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
  });

  if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) closeMobileSidebar();
  });
}


/* ============================================================
   HANGUL — Consonant / Vowel Grids
   ============================================================ */

function renderConsonantGrid() {
  const grid = document.getElementById('consonantGrid');
  if (!grid) return;
  CONSONANTS.forEach((c, i) => {
    const cell = document.createElement('div');
    cell.className = 'hangul-cell';
    cell.innerHTML = '<div class="hcell-char">' + c.char + '</div>' +
                     '<div class="hcell-rom">' + c.rom + '</div>';
    cell.addEventListener('click', function() {
      grid.querySelectorAll('.hangul-cell').forEach(el => el.classList.remove('selected'));
      this.classList.add('selected');
      showConsonantDetail(c);
    });
    grid.appendChild(cell);
  });
}

function showConsonantDetail(c) {
  const detail = document.getElementById('consonantDetail');
  if (!detail) return;
  detail.innerHTML =
    '<div class="detail-inner">' +
      '<div class="detail-char">' + c.char + '</div>' +
      '<div class="detail-info">' +
        '<div class="detail-name">' + c.name + '</div>' +
        '<div class="detail-rom">' + c.rom + '</div>' +
        '<div class="detail-example">' +
          '<span class="detail-ex-kr">' + c.example + '</span>' +
          '<span class="detail-ex-en">' + c.exEn + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  if (typeof trackExposure === 'function') trackExposure('hangul', c.char);
}

function renderVowelGrid() {
  const grid = document.getElementById('vowelGrid');
  if (!grid) return;
  VOWELS.forEach(v => {
    const cell = document.createElement('div');
    cell.className = 'hangul-cell';
    cell.innerHTML = '<div class="hcell-char">' + v.char + '</div>' +
                     '<div class="hcell-rom">' + v.rom + '</div>';
    cell.addEventListener('click', function() {
      grid.querySelectorAll('.hangul-cell').forEach(el => el.classList.remove('selected'));
      this.classList.add('selected');
      showVowelDetail(v);
    });
    grid.appendChild(cell);
  });
}

function showVowelDetail(v) {
  const detail = document.getElementById('vowelDetail');
  if (!detail) return;
  detail.innerHTML =
    '<div class="detail-inner">' +
      '<div class="detail-char">' + v.char + '</div>' +
      '<div class="detail-info">' +
        '<div class="detail-name">' + v.name + '</div>' +
        '<div class="detail-rom">' + v.rom + '</div>' +
        '<div class="detail-example">' +
          '<span class="detail-ex-kr">' + v.example + '</span>' +
          '<span class="detail-ex-en">' + v.exEn + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  if (typeof trackExposure === 'function') trackExposure('hangul', v.char);
}

function renderSyllableExamples() {
  const row = document.getElementById('syllableExamples');
  if (!row) return;
  SYLLABLE_EXAMPLES.forEach(ex => {
    const el = document.createElement('div');
    el.className = 'syl-example';
    el.innerHTML = '<div class="syl-ex-eq">' + ex.eq + '</div>' +
                   '<div class="syl-ex-result">' + ex.result + '</div>';
    row.appendChild(el);
  });
}

function renderBatchimGrid() {
  const grid = document.getElementById('batchimGrid');
  if (!grid) return;
  BATCHIM_EXAMPLES.forEach(b => {
    const cell = document.createElement('div');
    cell.className = 'batchim-cell';
    cell.innerHTML = '<div class="bc-syl">' + b.syl + '</div>' +
                     '<div class="bc-rom">' + b.rom + '</div>';
    grid.appendChild(cell);
  });
}

/* Hangul tabs */
function initHangulTabs() {
  document.querySelectorAll('.htab').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.htab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.htab-panel').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const panel = document.getElementById('htab-' + this.dataset.htab);
      if (panel) panel.classList.add('active');
    });
  });
}

/* Syllable Constructor */
let selConsonant = null;
let selVowel = null;

function renderConstructor() {
  const conDiv = document.getElementById('constructorConsonants');
  const vowDiv = document.getElementById('constructorVowels');
  if (!conDiv || !vowDiv) return;

  CONSONANTS.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'picker-char';
    btn.textContent = c.char;
    btn.addEventListener('click', function() {
      conDiv.querySelectorAll('.picker-char').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      selConsonant = c.char;
      updateConstructorResult();
    });
    conDiv.appendChild(btn);
  });

  VOWELS.forEach(v => {
    const btn = document.createElement('button');
    btn.className = 'picker-char';
    btn.textContent = v.char;
    btn.addEventListener('click', function() {
      vowDiv.querySelectorAll('.picker-char').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      selVowel = v.char;
      updateConstructorResult();
    });
    vowDiv.appendChild(btn);
  });
}

function updateConstructorResult() {
  const eqC = document.getElementById('eqConsonant');
  const eqV = document.getElementById('eqVowel');
  const eqR = document.getElementById('eqResult');
  if (eqC) eqC.textContent = selConsonant || '—';
  if (eqV) eqV.textContent = selVowel || '—';
  if (eqR) {
    if (selConsonant && selVowel && SYLLABLE_MAP[selConsonant] && SYLLABLE_MAP[selConsonant][selVowel]) {
      eqR.textContent = SYLLABLE_MAP[selConsonant][selVowel];
    } else {
      eqR.textContent = '—';
    }
  }
}


/* ============================================================
   VOCABULARY
   ============================================================ */

let currentVcat = 'greetings';

function renderVocab(cat) {
  const list = document.getElementById('vocabList');
  if (!list) return;
  list.innerHTML = '';
  const items = VOCAB[cat] || [];
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'vocab-item';
    row.innerHTML =
      '<div>' +
        '<div class="vocab-kr">' + item.kr + ' <button class="listen-btn" data-speak="' + item.kr + '" aria-label="Listen to ' + item.kr + '"><span class="listen-icon">▸</span> Listen</button></div>' +
        '<div class="vocab-rom rom-text">' + item.rom + '</div>' +
      '</div>' +
      '<div class="vocab-en">' + item.en + '</div>' +
      '<div class="vocab-example">' +
        '<div class="vocab-example-kr">' + item.ex_kr + '</div>' +
        '<div>' + item.ex_en + '</div>' +
      '</div>';
    list.appendChild(row);
    if (typeof trackExposure === 'function') trackExposure('vocab', item.kr);
  });
  if (typeof bindListenButtons === 'function') bindListenButtons(list);
  renderCollocations(cat);
  renderWordFamilies();
}

/* ---- Collocations — extends the existing Vocabulary section ---- */
const COLLOCATIONS = {
  people: [
    { base: '약속을 잡다', meaning: 'to make/set an appointment', combos: [
      { kr: '친구랑 약속을 잡다', en: 'to set up plans with a friend' },
      { kr: '약속을 취소하다', en: 'to cancel an appointment' },
    ]},
    { base: '시간을 보내다', meaning: 'to spend time', combos: [
      { kr: '가족과 시간을 보내다', en: 'to spend time with family' },
      { kr: '즐거운 시간을 보내다', en: 'to have a good time' },
    ]},
  ],
  places: [
    { base: '길을 찾다', meaning: 'to find the way', combos: [
      { kr: '길을 잃다', en: 'to get lost' },
      { kr: '지도를 보고 길을 찾다', en: 'to find the way using a map' },
    ]},
    { base: '사진을 찍다', meaning: 'to take a photo', combos: [
      { kr: '여행에서 사진을 찍다', en: 'to take photos while traveling' },
      { kr: '사진을 보내다', en: 'to send a photo' },
    ]},
  ],
  food: [
    { base: '먹다', meaning: 'to eat', combos: [
      { kr: '밥을 먹다', en: 'to eat a meal / rice' },
      { kr: '아침을 먹다', en: 'to eat breakfast' },
      { kr: '점심을 먹다', en: 'to eat lunch' },
      { kr: '저녁을 먹다', en: 'to eat dinner' },
    ]},
    { base: '마시다', meaning: 'to drink', combos: [
      { kr: '물을 마시다', en: 'to drink water' },
      { kr: '커피를 마시다', en: 'to drink coffee' },
    ]},
  ],
  daily: [
    { base: '공부하다', meaning: 'to study', combos: [
      { kr: '한국어를 공부하다', en: 'to study Korean' },
      { kr: '열심히 공부하다', en: 'to study hard' },
    ]},
    { base: '하다', meaning: 'to do', combos: [
      { kr: '운동을 하다', en: 'to exercise' },
      { kr: '일을 하다', en: 'to work' },
    ]},
  ],
};

function renderCollocations(cat) {
  const section = document.getElementById('section-vocabulary');
  if (!section) return;
  let wrap = document.getElementById('collocationWrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'collocation-wrap';
    wrap.id = 'collocationWrap';
    section.appendChild(wrap);
  }
  const entries = COLLOCATIONS[cat];
  if (!entries) { wrap.innerHTML = ''; return; }
  let html = '<h2 class="subsection-title">Collocations</h2><div class="collocation-list">';
  entries.forEach(e => {
    html += '<div class="collocation-card"><div class="collocation-base">' + e.base + ' <span class="collocation-meaning">— ' + e.meaning + '</span></div><div class="collocation-combos">';
    e.combos.forEach(c => { html += '<div class="collocation-combo"><span class="collocation-combo-kr">' + c.kr + '</span><span class="collocation-combo-en">' + c.en + '</span></div>'; });
    html += '</div></div>';
  });
  html += '</div>';
  wrap.innerHTML = html;
}

/* ---- Word families — extends the existing Vocabulary section ---- */
const WORD_FAMILIES = [
  { base: '공부', meaning: 'study (noun)', forms: [
    { kr: '공부하다', form: 'dictionary form', meaning: 'to study', example: '저는 매일 공부해요.' },
    { kr: '공부하는', form: 'present modifier', meaning: 'studying (adj., modifies a noun)', example: '공부하는 학생' },
    { kr: '공부한', form: 'past modifier', meaning: 'studied (adj., modifies a noun)', example: '공부한 내용' },
    { kr: '공부할', form: 'future modifier', meaning: 'will study (adj., modifies a noun)', example: '공부할 계획' },
    { kr: '공부하려고', form: 'intention connector', meaning: 'in order to study', example: '공부하려고 카페에 가요.' },
    { kr: '공부하면서', form: 'simultaneous connector', meaning: 'while studying', example: '음악을 들으면서 공부해요.' },
  ]},
  { base: '먹다', meaning: 'eat (dictionary form)', forms: [
    { kr: '먹다', form: 'dictionary form', meaning: 'to eat', example: '저는 밥을 먹다.' },
    { kr: '먹는', form: 'present modifier', meaning: 'eating (adj.)', example: '밥을 먹는 사람' },
    { kr: '먹은', form: 'past modifier', meaning: 'eaten / that ate (adj.)', example: '제가 먹은 음식' },
    { kr: '먹을', form: 'future modifier', meaning: 'will eat (adj.)', example: '먹을 음식' },
    { kr: '먹으려고', form: 'intention connector', meaning: 'in order to eat', example: '밥을 먹으려고 식당에 가요.' },
    { kr: '먹으면서', form: 'simultaneous connector', meaning: 'while eating', example: 'TV를 보면서 먹어요.' },
  ]},
];

function renderWordFamilies() {
  const section = document.getElementById('section-vocabulary');
  if (!section || document.getElementById('wordFamilyWrap')) return;
  const wrap = document.createElement('div');
  wrap.className = 'word-family-wrap';
  wrap.id = 'wordFamilyWrap';
  if (!levelAtLeast('Intermediate')) {
    wrap.innerHTML = '<h2 class="subsection-title">Word Families</h2>' + gatedNotice('Word Family view', 'Intermediate');
    section.appendChild(wrap);
    return;
  }
  let html = '<h2 class="subsection-title">Word Families</h2><div class="word-family-list">';
  WORD_FAMILIES.forEach((fam, i) => {
    html += '<div class="word-family-card">' +
      '<button class="word-family-toggle" data-idx="' + i + '">' + fam.base + ' <span class="word-family-meaning">— ' + fam.meaning + '</span></button>' +
      '<div class="word-family-body" id="wordFamilyBody' + i + '" style="display:none"><table class="word-family-table"><tbody>';
    fam.forms.forEach(f => {
      html += '<tr><td class="wf-kr">' + f.kr + '</td><td class="wf-form">' + f.form + '</td><td class="wf-meaning">' + f.meaning + '</td><td class="wf-example">' + f.example + '</td></tr>';
    });
    html += '</tbody></table></div></div>';
  });
  html += '</div>';
  wrap.innerHTML = html;
  section.appendChild(wrap);
  wrap.querySelectorAll('.word-family-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      const body = document.getElementById('wordFamilyBody' + this.dataset.idx);
      if (body) body.style.display = body.style.display === 'none' ? 'block' : 'none';
      this.classList.toggle('open');
    });
  });
}

function initVocabTabs() {
  document.querySelectorAll('.vtab').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.vtab').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentVcat = this.dataset.vcat;
      renderVocab(currentVcat);
    });
  });
}


/* ============================================================
   GRAMMAR
   ============================================================ */

function renderGrammar() {
  const container = document.getElementById('grammarLessons');
  if (!container) return;
  GRAMMAR_LESSONS.forEach(lesson => {
    const el = document.createElement('div');
    el.className = 'grammar-lesson';

    let morphHTML = '<div class="morpheme-stack">';
    lesson.morphemes.forEach((m, i) => {
      if (i > 0) morphHTML += '<div class="morpheme-connector">+</div>';
      morphHTML +=
        '<div class="morpheme">' +
          '<div class="morpheme-kr">' + m.kr + '</div>' +
          '<div class="morpheme-role">' + m.role + '</div>' +
          '<div class="morpheme-gloss">' + m.gloss + '</div>' +
        '</div>';
    });
    morphHTML += '</div>';

    el.innerHTML =
      '<div class="grammar-lesson-header">' +
        '<div class="grammar-lesson-num">' + lesson.num + '</div>' +
        '<div class="grammar-lesson-title">' + lesson.title + '</div>' +
      '</div>' +
      '<div class="grammar-lesson-body">' +
        '<div class="grammar-sentence">' + lesson.sentence + ' <button class="listen-btn" data-speak="' + lesson.sentence + '" aria-label="Listen"><span class="listen-icon">▸</span> Listen</button></div>' +
        morphHTML +
        '<div class="grammar-translation">' + lesson.translation + '</div>' +
        '<div class="grammar-rule">' + lesson.rule + '</div>' +
      '</div>';
    container.appendChild(el);
    if (typeof trackExposure === 'function') trackExposure('grammar', lesson.num);
  });
  if (typeof bindListenButtons === 'function') bindListenButtons(container);
  renderGrammarComparisons();
}

/* Grammar comparison mode — lives inside the existing Grammar section */
function renderGrammarComparisons() {
  const section = document.getElementById('section-grammar');
  if (!section || document.getElementById('grammarComparisons')) return;
  const wrap = document.createElement('div');
  wrap.className = 'comparison-wrap';
  wrap.innerHTML = '<h2 class="subsection-title">Grammar Comparisons</h2><div class="comparison-list" id="grammarComparisons"></div>';
  section.appendChild(wrap);
  const list = wrap.querySelector('#grammarComparisons');
  GRAMMAR_COMPARISONS.forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'comparison-card';
    let exHTML = '';
    c.examples.forEach(ex => { exHTML += '<div class="comparison-example"><span class="comparison-example-kr">' + ex.kr + '</span><span class="comparison-example-en">' + ex.en + '</span></div>'; });
    card.innerHTML =
      '<button class="comparison-toggle" data-idx="' + i + '">' + c.pair + '</button>' +
      '<div class="comparison-body" id="comparisonBody' + i + '" style="display:none">' +
        '<div class="comparison-meaning">' + c.meaning + '</div>' +
        '<div class="comparison-examples">' + exHTML + '</div>' +
        '<div class="comparison-usage"><strong>Usage:</strong> ' + c.usage + '</div>' +
      '</div>';
    list.appendChild(card);
  });
  list.querySelectorAll('.comparison-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      const body = document.getElementById('comparisonBody' + this.dataset.idx);
      if (body) body.style.display = body.style.display === 'none' ? 'block' : 'none';
      this.classList.toggle('open');
    });
  });
}


/* ============================================================
   SENTENCE BUILDER
   ============================================================ */

let builderIndex = 0;
let builderSlotWords = [];
let builderUsed = {};
let builderChecked = false;

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadBuilderExercise(idx) {
  builderChecked = false;
  builderSlotWords = [];
  builderUsed = {};

  const ex = BUILDER_EXERCISES[idx];
  const total = BUILDER_EXERCISES.length;
  const pct = Math.round((idx / total) * 100);

  // Update level info
  const levelNum = document.getElementById('builderLevelNum');
  const levelDesc = document.getElementById('builderLevelDesc');
  const levelFill = document.getElementById('builderLevelFill');
  if (levelNum) levelNum.textContent = ex.level;
  if (levelDesc) levelDesc.textContent = ex.levelDesc;
  if (levelFill) levelFill.style.width = pct + '%';

  // Prompt
  const promptEl = document.getElementById('builderPrompt');
  if (promptEl) promptEl.textContent = ex.prompt;

  // Clear feedback
  const fb = document.getElementById('builderFeedback');
  if (fb) { fb.textContent = ''; fb.className = 'builder-feedback'; }

  // Hide next button
  const nextBtn = document.getElementById('builderNext');
  if (nextBtn) nextBtn.style.display = 'none';

  // Clear explanation
  const expEl = document.getElementById('builderExplanation');
  if (expEl) expEl.textContent = '';

  // Render shuffled blocks (word pool depends on the active builder mode)
  const pool = (typeof getBuilderBlocksForMode === 'function')
    ? getBuilderBlocksForMode(ex, (typeof builderMode !== 'undefined' ? builderMode : 'distractor'))
    : shuffleArray(ex.blocks);
  const blocksLabel = document.getElementById('builderBlocksLabel');
  if (blocksLabel) {
    blocksLabel.textContent = (typeof builderMode !== 'undefined' && (builderMode === 'guided' || builderMode === 'order'))
      ? 'Arrange these words'
      : 'Available words';
  }
  renderBuilderBlocks(pool);

  // Clear slots
  renderBuilderSlots();
}

function renderBuilderBlocks(blocks) {
  const container = document.getElementById('builderBlocks');
  if (!container) return;
  container.innerHTML = '';
  blocks.forEach((word, i) => {
    const btn = document.createElement('button');
    btn.className = 'builder-block' + (builderUsed[i] ? ' used' : '');
    btn.textContent = word;
    btn.dataset.idx = i;
    btn.dataset.word = word;
    btn.addEventListener('click', function() {
      if (builderChecked) return;
      if (builderUsed[this.dataset.idx]) return;
      builderUsed[this.dataset.idx] = true;
      builderSlotWords.push({ word: this.dataset.word, blockIdx: this.dataset.idx });
      this.classList.add('used');
      renderBuilderSlots();
    });
    container.appendChild(btn);
  });
}

function renderBuilderSlots() {
  const container = document.getElementById('builderSlots');
  if (!container) return;
  container.innerHTML = '';
  if (builderSlotWords.length === 0) {
    const placeholder = document.createElement('span');
    placeholder.style.color = 'var(--text-dim)';
    placeholder.style.fontSize = '13px';
    placeholder.textContent = 'Select words below';
    container.appendChild(placeholder);
    return;
  }
  builderSlotWords.forEach((item, i) => {
    const slot = document.createElement('div');
    slot.className = 'builder-slot';
    slot.textContent = item.word;
    slot.addEventListener('click', function() {
      if (builderChecked) return;
      // Return to pool
      builderUsed[item.blockIdx] = false;
      builderSlotWords.splice(i, 1);
      // Re-enable block button
      const blocks = document.getElementById('builderBlocks');
      if (blocks) {
        const btn = blocks.querySelector('[data-idx="' + item.blockIdx + '"]');
        if (btn) btn.classList.remove('used');
      }
      renderBuilderSlots();
    });
    container.appendChild(slot);
  });
}

function checkBuilder() {
  if (builderChecked) return;
  const ex = BUILDER_EXERCISES[builderIndex];
  const answer = ex.answer;
  const userAnswer = builderSlotWords.map(s => s.word);

  const fb = document.getElementById('builderFeedback');
  const nextBtn = document.getElementById('builderNext');

  if (userAnswer.length === 0) {
    if (fb) { fb.textContent = 'Select words to form the sentence.'; fb.className = 'builder-feedback'; }
    return;
  }

  builderChecked = true;
  const correct = JSON.stringify(userAnswer) === JSON.stringify(answer);
  const expEl = document.getElementById('builderExplanation');

  if (correct) {
    if (fb) {
      fb.textContent = 'Correct. ' + answer.join(' ');
      fb.className = 'builder-feedback correct';
    }
    if (expEl) expEl.textContent = '';
    if (nextBtn) nextBtn.style.display = 'inline-block';
    if (typeof recordBuilderResult === 'function') recordBuilderResult(ex, true);
  } else {
    if (fb) {
      fb.textContent = 'Not quite. Correct order: ' + answer.join(' ');
      fb.className = 'builder-feedback incorrect';
    }
    if (expEl && typeof explainMistake === 'function') {
      expEl.textContent = explainMistake(userAnswer, answer);
    }
    if (typeof recordBuilderResult === 'function') recordBuilderResult(ex, false);
    // Allow retry
    setTimeout(() => {
      builderChecked = false;
    }, 1500);
  }
}

let builderMode = 'guided';

function getBuilderBlocksForMode(ex, mode) {
  if (mode === 'guided' || mode === 'order') return shuffleArray(ex.answer.slice());
  if (mode === 'semiguided') {
    const extra = ex.blocks.find(b => ex.answer.indexOf(b) === -1);
    const pool = ex.answer.slice();
    if (extra) pool.push(extra);
    return shuffleArray(pool);
  }
  return shuffleArray(ex.blocks.slice()); // distractor mode (also default original behavior)
}

function explainMistake(userAnswer, answer) {
  const verb = answer[answer.length - 1];
  if (userAnswer.length && userAnswer[userAnswer.length - 1] !== verb) {
    return 'Korean commonly places the verb at the end of the sentence — try moving "' + verb + '" to the last position.';
  }
  const topic = answer.find(w => w.endsWith('는') || w.endsWith('은'));
  if (topic && userAnswer.indexOf(topic) === -1) {
    return 'Check the topic marker 은/는 — it should attach to the subject of the sentence.';
  }
  return 'Compare word order and particles carefully — Korean follows Subject → Object → Verb.';
}

function initBuilder() {
  loadBuilderExercise(builderIndex);

  const checkBtn = document.getElementById('builderCheck');
  if (checkBtn) checkBtn.addEventListener('click', checkBuilder);

  const clearBtn = document.getElementById('builderClear');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (builderChecked) return;
      builderSlotWords = [];
      builderUsed = {};
      const blocks = document.getElementById('builderBlocks');
      if (blocks) blocks.querySelectorAll('.builder-block').forEach(b => b.classList.remove('used'));
      renderBuilderSlots();
    });
  }

  const nextBtn = document.getElementById('builderNext');
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      builderIndex = (builderIndex + 1) % BUILDER_EXERCISES.length;
      loadBuilderExercise(builderIndex);
    });
  }

  // Mode tabs
  document.querySelectorAll('.bmtab').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.bmtab').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      builderMode = this.dataset.bmode;
      const guidedPanel = document.getElementById('builderExerciseGuided');
      const freePanel = document.getElementById('builderExerciseFree');
      const progressBar = document.querySelector('.builder-progress-bar');
      if (builderMode === 'free') {
        if (guidedPanel) guidedPanel.style.display = 'none';
        if (freePanel) freePanel.style.display = 'flex';
        if (progressBar) progressBar.style.display = 'none';
        loadFreeWritingExercise(builderIndex);
      } else {
        if (guidedPanel) guidedPanel.style.display = 'flex';
        if (freePanel) freePanel.style.display = 'none';
        if (progressBar) progressBar.style.display = 'block';
        loadBuilderExercise(builderIndex);
      }
    });
  });

  initFreeWriting();
}

/* ---- Free Writing mode ---- */
function loadFreeWritingExercise(idx) {
  const ex = BUILDER_EXERCISES[idx % BUILDER_EXERCISES.length];
  const promptEl = document.getElementById('freePrompt');
  if (promptEl) promptEl.textContent = ex.prompt;
  const input = document.getElementById('freeInput');
  if (input) input.value = '';
  const fb = document.getElementById('freeFeedback');
  if (fb) { fb.textContent = ''; fb.className = 'builder-feedback'; }
  const expEl = document.getElementById('freeExplanation');
  if (expEl) expEl.textContent = '';
  const nextBtn = document.getElementById('freeNext');
  if (nextBtn) nextBtn.style.display = 'none';
}

function normalizeKorean(str) {
  return (str || '').trim().replace(/\s+/g, ' ').replace(/[.!?]/g, '');
}

function initFreeWriting() {
  const toggleBtn = document.getElementById('freeKeyboardToggle');
  const kbContainer = document.getElementById('freeKeyboard');
  const input = document.getElementById('freeInput');

  if (toggleBtn && kbContainer && input) {
    toggleBtn.addEventListener('click', function() {
      const visible = kbContainer.style.display !== 'none';
      kbContainer.style.display = visible ? 'none' : 'block';
      toggleBtn.textContent = visible ? 'Show Korean Keyboard' : 'Hide Korean Keyboard';
      if (!visible && typeof renderKoreanKeyboard === 'function' && !kbContainer.dataset.built) {
        renderKoreanKeyboard(kbContainer, input);
        kbContainer.dataset.built = '1';
      }
    });
  }

  const checkBtn = document.getElementById('freeCheck');
  const nextBtn = document.getElementById('freeNext');

  if (checkBtn) {
    checkBtn.addEventListener('click', function() {
      const ex = BUILDER_EXERCISES[builderIndex % BUILDER_EXERCISES.length];
      const expected = ex.answer.join('');
      const userVal = input ? input.value : '';
      const fb = document.getElementById('freeFeedback');
      const expEl = document.getElementById('freeExplanation');
      if (!userVal.trim()) {
        if (fb) { fb.textContent = 'Type your answer in Korean.'; fb.className = 'builder-feedback'; }
        return;
      }
      const isCorrect = normalizeKorean(userVal) === normalizeKorean(expected);
      if (isCorrect) {
        if (fb) { fb.textContent = 'Correct. ' + expected; fb.className = 'builder-feedback correct'; }
        if (expEl) expEl.textContent = '';
        if (nextBtn) nextBtn.style.display = 'inline-block';
        if (typeof recordBuilderResult === 'function') recordBuilderResult(ex, true);
      } else {
        if (fb) { fb.textContent = 'Not quite.'; fb.className = 'builder-feedback incorrect'; }
        if (expEl) {
          expEl.textContent = 'Your answer: ' + userVal + '  ·  Correct answer: ' + expected;
        }
        if (typeof recordBuilderResult === 'function') recordBuilderResult(ex, false);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      builderIndex = (builderIndex + 1) % BUILDER_EXERCISES.length;
      loadFreeWritingExercise(builderIndex);
    });
  }
}


/* ============================================================
   PRACTICE
   ============================================================ */

let practiceMode = 'hangul-quiz';
let practiceIdx = 0;

function initPracticeTabs() {
  document.querySelectorAll('.ptab').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      practiceMode = this.dataset.pmode;
      practiceIdx = 0;
      loadPractice();
    });
  });
}

function loadPractice() {
  const area = document.getElementById('practiceArea');
  if (!area) return;
  area.innerHTML = '';
  if (practiceMode === 'hangul-quiz') renderHangulQuiz(area);
  else if (practiceMode === 'vocab-quiz') renderVocabQuiz(area);
  else if (practiceMode === 'word-order') renderWordOrder(area);
  else if (practiceMode === 'listening' && typeof renderListeningQuiz === 'function') renderListeningQuiz(area);
  else if (practiceMode === 'translation' && typeof renderTranslationQuiz === 'function') renderTranslationQuiz(area);
  else if (practiceMode === 'free-writing' && typeof renderFreeWritingQuiz === 'function') renderFreeWritingQuiz(area);
  else if (practiceMode === 'dictation' && typeof renderDictationQuiz === 'function') renderDictationQuiz(area);
  else if (practiceMode === 'conversation' && typeof renderConversationPractice === 'function') renderConversationPractice(area);
  else if (practiceMode === 'debate' && typeof renderDebatePractice === 'function') renderDebatePractice(area);
}

/* ============================================================
   CONVERSATION SCENARIOS — a mode inside the existing Practice
   system, not a new section.
   ============================================================ */
const CONVERSATION_SCENARIOS = [
  { id:'cafe', title:'Cafe', level:'Beginner',
    situation:'You are ordering a drink at a cafe.',
    lines:[{ speaker:'Staff', kr:'어서 오세요. 뭐 드릴까요?', en:'Welcome. What can I get you?' }],
    prompt:'How do you order an iced americano?',
    choices:[
      { kr:'아이스 아메리카노 하나 주세요.', correct:true, feedback:'Correct — "주세요" is the standard polite way to order.' },
      { kr:'아이스 아메리카노 먹고 싶어요.', correct:false, feedback:'Understandable, but 주세요 is more natural for ordering than 먹고 싶어요.' },
      { kr:'아이스 아메리카노 있어요?', correct:false, feedback:'This asks "do you have it?" rather than placing the order.' },
    ] },
  { id:'restaurant', title:'Restaurant', level:'Beginner',
    situation:'You are asking for the menu at a restaurant.',
    lines:[{ speaker:'Staff', kr:'몇 분이세요?', en:'How many people?' }],
    prompt:'How do you say "two people, please"?',
    choices:[
      { kr:'두 명이에요.', correct:true, feedback:'Correct — 명 counts people.' },
      { kr:'두 개예요.', correct:false, feedback:'개 counts objects, not people — use 명.' },
      { kr:'두 시예요.', correct:false, feedback:'시 means "o\'clock" — not what\'s being asked here.' },
    ] },
  { id:'convenience', title:'Convenience Store', level:'Beginner',
    situation:'You are paying at a convenience store.',
    lines:[{ speaker:'Staff', kr:'봉투 필요하세요?', en:'Do you need a bag?' }],
    prompt:'How do you say "no, I don\'t need one"?',
    choices:[
      { kr:'아니요, 괜찮아요.', correct:true, feedback:'Correct — a natural, polite way to decline.' },
      { kr:'네, 주세요.', correct:false, feedback:'This means "yes, please" — the opposite of declining.' },
      { kr:'모르겠어요.', correct:false, feedback:'This means "I don\'t know," not a decline.' },
    ] },
  { id:'shopping', title:'Shopping', level:'Elementary',
    situation:'You are asking about the price of a jacket.',
    lines:[{ speaker:'Staff', kr:'어떤 사이즈 찾으세요?', en:'What size are you looking for?' }],
    prompt:'How do you ask "how much is this"?',
    choices:[
      { kr:'이거 얼마예요?', correct:true, feedback:'Correct — 얼마예요? is the standard way to ask a price.' },
      { kr:'이거 뭐예요?', correct:false, feedback:'This asks "what is this," not the price.' },
      { kr:'이거 어디예요?', correct:false, feedback:'This asks "where is this," not the price.' },
    ] },
  { id:'school', title:'School', level:'Elementary',
    situation:'A classmate asks about your class schedule.',
    lines:[{ speaker:'Classmate', kr:'다음 수업이 뭐예요?', en:'What\'s your next class?' }],
    prompt:'How do you say "next class is Korean"?',
    choices:[
      { kr:'다음 수업은 한국어예요.', correct:true, feedback:'Correct — 은/는 marks the topic here.' },
      { kr:'다음 수업을 한국어예요.', correct:false, feedback:'을 is an object marker; it doesn\'t fit here.' },
      { kr:'다음 수업에 한국어예요.', correct:false, feedback:'에 marks location/time, not the topic of the sentence.' },
    ] },
  { id:'work', title:'Work', level:'Intermediate',
    situation:'A coworker asks if you can finish a report today.',
    lines:[{ speaker:'Coworker', kr:'오늘까지 보고서를 끝낼 수 있어요?', en:'Can you finish the report by today?' }],
    prompt:'How do you say "I think I can finish it"?',
    choices:[
      { kr:'끝낼 수 있을 것 같아요.', correct:true, feedback:'Correct — 것 같아요 softens the statement naturally, common in the workplace.' },
      { kr:'끝냈어요.', correct:false, feedback:'This states it\'s already finished — not what was asked.' },
      { kr:'끝내고 싶어요.', correct:false, feedback:'This expresses a desire to finish, not an assessment of ability.' },
    ] },
  { id:'transportation', title:'Transportation', level:'Intermediate',
    situation:'You are asking which bus goes downtown.',
    lines:[{ speaker:'Stranger', kr:'어디 가세요?', en:'Where are you headed?' }],
    prompt:'How do you ask "which bus should I take to go downtown"?',
    choices:[
      { kr:'시내에 가려면 몇 번 버스를 타야 해요?', correct:true, feedback:'Correct — 려면 (in order to) + 타야 해요 (must take) is natural here.' },
      { kr:'시내에 버스가 있어요?', correct:false, feedback:'This just asks if a bus exists, not which number to take.' },
      { kr:'시내가 어디예요?', correct:false, feedback:'This asks where downtown is, not which bus to take.' },
    ] },
  { id:'directions', title:'Asking Directions', level:'Elementary',
    situation:'You are lost and need to find the subway station.',
    lines:[{ speaker:'You', kr:'지하철역이 어디예요?', en:'Where is the subway station?' }],
    prompt:'A local replies "쭉 가서 오른쪽으로 도세요." What does this mean?',
    choices:[
      { kr:'Go straight, then turn right.', correct:true, feedback:'Correct — 쭉 가다 (go straight) + 오른쪽으로 돌다 (turn right).' },
      { kr:'Turn left at the light.', correct:false, feedback:'왼쪽 would mean left; this sentence uses 오른쪽 (right).' },
      { kr:'It is very far from here.', correct:false, feedback:'No distance is mentioned — this gives directions, not distance.' },
    ] },
  { id:'meeting', title:'Meeting Someone', level:'Beginner',
    situation:'You are meeting someone for the first time.',
    lines:[{ speaker:'New acquaintance', kr:'처음 뵙겠습니다.', en:'Nice to meet you. (very formal)' }],
    prompt:'What is the natural polite reply?',
    choices:[
      { kr:'네, 만나서 반갑습니다.', correct:true, feedback:'Correct — 만나서 반갑습니다 is the standard polite reply.' },
      { kr:'네, 안녕히 가세요.', correct:false, feedback:'This means "goodbye" — said when someone is leaving, not meeting.' },
      { kr:'아니요, 괜찮아요.', correct:false, feedback:'This declines something — not appropriate as a greeting reply.' },
    ] },
  { id:'plans', title:'Making Plans', level:'Intermediate',
    situation:'A friend suggests meeting this weekend.',
    lines:[{ speaker:'Friend', kr:'이번 주말에 시간 있어요?', en:'Do you have time this weekend?' }],
    prompt:'How do you suggest meeting Saturday afternoon?',
    choices:[
      { kr:'토요일 오후에 만날까요?', correct:true, feedback:'Correct — ㄹ까요? proposes doing something together.' },
      { kr:'토요일 오후에 만나요.', correct:false, feedback:'This is a plain statement, less natural as a suggestion than ㄹ까요?.' },
      { kr:'토요일 오후에 만났어요.', correct:false, feedback:'This is past tense — it says the meeting already happened.' },
    ] },
  { id:'requests', title:'Making Requests', level:'Elementary',
    situation:'You need help carrying a heavy bag.',
    lines:[{ speaker:'You', kr:'가방이 너무 무거워요.', en:'The bag is too heavy.' }],
    prompt:'How do you politely ask someone to help you?',
    choices:[
      { kr:'좀 도와주시겠어요?', correct:true, feedback:'Correct — 아/어 주시겠어요? is a polite way to make a request.' },
      { kr:'도와요.', correct:false, feedback:'This is a plain statement ("(I) help"), not a request.' },
      { kr:'도와줬어요.', correct:false, feedback:'This is past tense, describing help already given.' },
    ] },
  { id:'apologizing', title:'Apologizing', level:'Elementary',
    situation:'You arrived late to meet a friend.',
    lines:[{ speaker:'Friend', kr:'왜 이렇게 늦었어요?', en:'Why are you so late?' }],
    prompt:'How do you apologize and explain you were stuck in traffic?',
    choices:[
      { kr:'죄송해요, 길이 막혔어요.', correct:true, feedback:'Correct — 죄송해요 (I\'m sorry) + 길이 막히다 (traffic is jammed).' },
      { kr:'괜찮아요, 길이 막혔어요.', correct:false, feedback:'괜찮아요 means "it\'s okay" — said to reassure someone else, not to apologize yourself.' },
      { kr:'감사해요, 길이 막혔어요.', correct:false, feedback:'감사해요 means "thank you," not an apology.' },
    ] },
];

let conversationIdx = 0;

function renderConversationPractice(area) {
  const available = CONVERSATION_SCENARIOS.filter(s => levelAtLeast(s.level));
  if (available.length === 0) { area.innerHTML = gatedNotice('Conversation Practice', 'Elementary'); return; }
  const scenario = available[conversationIdx % available.length];
  const card = document.createElement('div');
  card.className = 'quiz-card conversation-card';
  let linesHTML = '';
  scenario.lines.forEach(l => { linesHTML += '<div class="conversation-line"><span class="conversation-speaker">' + l.speaker + ':</span> <span class="conversation-kr">' + l.kr + '</span><div class="conversation-en">' + l.en + '</div></div>'; });
  let choicesHTML = '';
  scenario.choices.forEach((c, i) => { choicesHTML += '<button class="quiz-option conversation-choice" data-idx="' + i + '">' + c.kr + '</button>'; });
  card.innerHTML =
    '<div class="conversation-meta"><span class="conversation-level">' + scenario.level + '</span><span class="conversation-title">' + scenario.title + '</span></div>' +
    '<div class="conversation-situation">' + scenario.situation + '</div>' +
    linesHTML +
    '<div class="quiz-question-label">' + scenario.prompt + '</div>' +
    '<div class="quiz-options">' + choicesHTML + '</div>' +
    '<div class="quiz-feedback" id="conversationFeedback"></div>' +
    '<button class="quiz-next" id="conversationNext">Next Scenario</button>';
  area.appendChild(card);
  if (typeof bindListenButtons === 'function') bindListenButtons(card);
  card.querySelectorAll('.conversation-choice').forEach(btn => {
    btn.addEventListener('click', function() {
      const choice = scenario.choices[Number(this.dataset.idx)];
      card.querySelectorAll('.conversation-choice').forEach(b => b.classList.add('disabled'));
      this.classList.add(choice.correct ? 'correct' : 'incorrect');
      const fb = card.querySelector('#conversationFeedback');
      fb.textContent = choice.feedback;
      fb.className = 'quiz-feedback ' + (choice.correct ? 'correct' : 'incorrect');
      if (!choice.correct) recordQuizMistake('conversation', scenario.title, 'Conversation Scenario');
      if (typeof trackExposure === 'function') trackExposure('sentences', 'conversation-' + scenario.title);
    });
  });
  card.querySelector('#conversationNext').addEventListener('click', () => { conversationIdx++; loadPractice(); });
}

/* ============================================================
   DEBATE / OPINION — advanced mode inside the existing Practice
   system, gated to Advanced level and above.
   ============================================================ */
const DEBATE_TOPICS = [
  { level:'Advanced', kr:'스마트폰 사용이 현대 사회에 미치는 영향에 대해 어떻게 생각하시나요?', en:'What do you think about the impact of smartphone use on modern society?',
    vocab:['영향 (influence)','현대 사회 (modern society)','의존하다 (to depend on)','장점/단점 (pros/cons)'],
    grammar:['-다고 생각하다 (I think that...)','-에 대해 (about/regarding)','-ㄴ/는 반면에 (whereas)'],
    connectors:['첫째 (firstly)','또한 (also)','그러나 (however)','반면에 (on the other hand)','따라서 (therefore)','결론적으로 (in conclusion)'] },
  { level:'Advanced', kr:'온라인 수업의 장단점은 무엇이라고 생각하시나요?', en:'What do you think are the pros and cons of online classes?',
    vocab:['장점 (advantage)','단점 (disadvantage)','효율적 (efficient)','집중하다 (to concentrate)'],
    grammar:['-기 때문에 (because)','-는 데 도움이 되다 (helps to...)','-지만 (but)'],
    connectors:['첫째 (firstly)','둘째 (secondly)','그러나 (however)','따라서 (therefore)','결론적으로 (in conclusion)'] },
  { level:'Highly Proficient', kr:'한국에서 살고 싶은 이유에 대해 말해 보세요.', en:'Talk about your reasons for wanting to live in Korea.',
    vocab:['문화 (culture)','기회 (opportunity)','매력적이다 (to be attractive/appealing)'],
    grammar:['-고 싶은 이유는 …이다 (the reason I want to... is)','-ㄹ 수 있다 (can/be able to)'],
    connectors:['우선 (first of all)','게다가 (moreover)','또한 (also)','결론적으로 (in conclusion)'] },
];

let debateIdx = 0;

function renderDebatePractice(area) {
  if (!levelAtLeast('Advanced')) { area.innerHTML = gatedNotice('Debate / Opinion Practice', 'Advanced'); return; }
  const topic = DEBATE_TOPICS.filter(t => levelAtLeast(t.level))[debateIdx % DEBATE_TOPICS.filter(t => levelAtLeast(t.level)).length];
  const card = document.createElement('div');
  card.className = 'quiz-card debate-card';
  card.innerHTML =
    '<div class="conversation-meta"><span class="conversation-level">' + topic.level + '</span><span class="conversation-title">Debate / Opinion</span></div>' +
    '<div class="debate-topic-kr">' + topic.kr + ' <button class="listen-btn" data-speak="' + topic.kr + '"><span class="listen-icon">▸</span> Listen</button></div>' +
    '<div class="debate-topic-en">' + topic.en + '</div>' +
    '<div class="debate-helpers">' +
      '<div class="debate-helper-col"><div class="debate-helper-title">Useful Vocabulary</div><ul>' + topic.vocab.map(v => '<li>' + v + '</li>').join('') + '</ul></div>' +
      '<div class="debate-helper-col"><div class="debate-helper-title">Useful Grammar</div><ul>' + topic.grammar.map(g => '<li>' + g + '</li>').join('') + '</ul></div>' +
      '<div class="debate-helper-col"><div class="debate-helper-title">Connectors</div><ul>' + topic.connectors.map(c => '<li>' + c + '</li>').join('') + '</ul></div>' +
    '</div>' +
    '<textarea class="free-writing-input" id="debateInput" rows="5" placeholder="한국어로 의견을 써 보세요…" aria-label="Debate response"></textarea>' +
    '<div class="builder-actions"><button class="btn-check" id="debateCheck">Self-Review</button><button class="btn-next" id="debateNext">Next Topic</button></div>' +
    '<div class="builder-feedback" id="debateFeedback"></div>';
  area.appendChild(card);
  if (typeof bindListenButtons === 'function') bindListenButtons(card);
  card.querySelector('#debateCheck').addEventListener('click', function() {
    const val = card.querySelector('#debateInput').value.trim();
    const fb = card.querySelector('#debateFeedback');
    if (!val) { fb.textContent = 'Write a response before requesting self-review.'; fb.className = 'builder-feedback'; return; }
    const usedConnector = topic.connectors.some(c => val.indexOf(c.split(' ')[0]) !== -1);
    const wordCount = val.replace(/\s+/g, '').length;
    fb.innerHTML =
      '<div class="debate-self-review">' +
        '<div>Length: ' + wordCount + ' characters — ' + (wordCount < 40 ? 'try expanding with a reason and an example.' : 'good length for this level.') + '</div>' +
        '<div>Connector usage: ' + (usedConnector ? 'at least one connector used — good structure.' : 'consider adding a connector like 첫째 or 결론적으로 to organize your argument.') + '</div>' +
        '<div class="builder-explanation">This is guided self-review, not automated grading — compare your writing against the vocabulary and grammar provided above.</div>' +
      '</div>';
    trackExposure('sentences', 'debate-' + topic.kr.slice(0, 10));
  });
  card.querySelector('#debateNext').addEventListener('click', () => { debateIdx++; loadPractice(); });
}


/* Dictation — reuses the existing audio (speak) and Korean-input systems */
const DICTATION_ITEMS = [
  { kr: '안녕하세요.', en: 'Hello.' },
  { kr: '저는 학생이에요.', en: 'I am a student.' },
  { kr: '한국어를 공부해요.', en: 'I study Korean.' },
  { kr: '오늘 날씨가 좋아요.', en: 'The weather is nice today.' },
  { kr: '내일 친구를 만날 거예요.', en: 'I will meet my friend tomorrow.' },
];

function diffSpacing(user, expected) {
  return normalizeKorean(user.replace(/\s+/g, '')) === normalizeKorean(expected.replace(/\s+/g, ''));
}

function renderDictationQuiz(area) {
  const item = DICTATION_ITEMS[practiceIdx % DICTATION_ITEMS.length];
  const card = document.createElement('div');
  card.className = 'quiz-card dictation-card';
  card.innerHTML =
    '<div class="quiz-question-label">Listen, then type exactly what you hear.</div>' +
    '<button class="listen-btn dictation-play" data-speak="' + item.kr + '"><span class="listen-icon">▸</span> Play Audio</button>' +
    '<textarea class="free-writing-input" id="dictationInput" rows="2" placeholder="한국어로 입력하세요…" aria-label="Dictation input"></textarea>' +
    '<div class="builder-actions"><button class="btn-check" id="dictationCheck">Check</button><button class="btn-next" id="dictationNext" style="display:none">Next</button></div>' +
    '<div class="builder-feedback" id="dictationFeedback"></div>';
  area.appendChild(card);
  if (typeof bindListenButtons === 'function') bindListenButtons(card);

  const checkBtn = card.querySelector('#dictationCheck');
  const nextBtn = card.querySelector('#dictationNext');
  const fb = card.querySelector('#dictationFeedback');
  checkBtn.addEventListener('click', function() {
    const userVal = card.querySelector('#dictationInput').value;
    const exact = userVal.trim() === item.kr;
    const closeEnough = diffSpacing(userVal, item.kr);
    if (exact) {
      fb.innerHTML = '<span class="quiz-feedback correct">Correct — exact match.</span>';
    } else if (closeEnough) {
      fb.innerHTML = '<span class="quiz-feedback correct">Correct — minor spacing difference only.</span><div class="dictation-compare">Your answer: ' + userVal + '<br>Correct answer: ' + item.kr + '</div>';
    } else {
      fb.innerHTML = '<span class="quiz-feedback incorrect">Not quite.</span><div class="dictation-compare">Your answer: ' + (userVal || '(empty)') + '<br>Correct answer: ' + item.kr + '<br>' + item.en + '</div>';
      recordQuizMistake('dictation', item.kr, 'Dictation');
    }
    if (typeof trackExposure === 'function') trackExposure('sentences', item.kr);
    nextBtn.style.display = 'inline-block';
  });
  nextBtn.addEventListener('click', () => { practiceIdx++; loadPractice(); });
}

/* Hangul Quiz */
function renderHangulQuiz(area) {
  const items = HANGUL_QUIZ;
  const item = items[practiceIdx % items.length];
  const shuffled = shuffleArray(item.options);

  const card = document.createElement('div');
  card.className = 'quiz-card';

  let optHTML = '';
  shuffled.forEach(opt => {
    optHTML += '<button class="quiz-option" data-opt="' + opt + '">' + opt + '</button>';
  });

  card.innerHTML =
    '<div class="quiz-question-label">What sound does this character make?</div>' +
    '<div class="quiz-char">' + item.char + '</div>' +
    '<div class="quiz-options">' + optHTML + '</div>' +
    '<div class="quiz-feedback" id="quizFeedback"></div>' +
    '<button class="quiz-next" id="quizNext">Next</button>';

  area.appendChild(card);

  card.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function() {
      card.querySelectorAll('.quiz-option').forEach(b => {
        b.classList.add('disabled');
        if (b.dataset.opt === item.correct) b.classList.add('correct');
      });
      const fb = card.querySelector('#quizFeedback');
      const next = card.querySelector('#quizNext');
      if (this.dataset.opt === item.correct) {
        this.classList.add('correct');
        if (fb) { fb.textContent = 'Correct.'; fb.className = 'quiz-feedback correct'; }
      } else {
        this.classList.add('incorrect');
        if (fb) { fb.textContent = 'Incorrect. The answer is: ' + item.correct; fb.className = 'quiz-feedback incorrect'; }
        if (typeof recordQuizMistake === 'function') recordQuizMistake('hangul', item.char, 'Hangul Quiz');
      }
      if (typeof trackExposure === 'function') trackExposure('hangul', item.char);
      if (next) next.classList.add('visible');
    });
  });

  const nextBtn = card.querySelector('#quizNext');
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      practiceIdx++;
      loadPractice();
    });
  }
}

/* Vocab Quiz */
function renderVocabQuiz(area) {
  const items = VOCAB_QUIZ;
  const item = items[practiceIdx % items.length];
  const shuffled = shuffleArray(item.options);

  const card = document.createElement('div');
  card.className = 'quiz-card';

  let optHTML = '';
  shuffled.forEach(opt => {
    optHTML += '<button class="quiz-option" data-opt="' + opt + '">' + opt + '</button>';
  });

  card.innerHTML =
    '<div class="quiz-question-label">What does this word mean?</div>' +
    '<div class="quiz-char" style="font-size:52px">' + item.kr + '</div>' +
    '<div class="quiz-options">' + optHTML + '</div>' +
    '<div class="quiz-feedback" id="quizFeedback"></div>' +
    '<button class="quiz-next" id="quizNext">Next</button>';

  area.appendChild(card);

  card.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function() {
      card.querySelectorAll('.quiz-option').forEach(b => {
        b.classList.add('disabled');
        if (b.dataset.opt === item.correct) b.classList.add('correct');
      });
      const fb = card.querySelector('#quizFeedback');
      const next = card.querySelector('#quizNext');
      if (this.dataset.opt === item.correct) {
        this.classList.add('correct');
        if (fb) { fb.textContent = 'Correct.'; fb.className = 'quiz-feedback correct'; }
      } else {
        this.classList.add('incorrect');
        if (fb) { fb.textContent = 'Incorrect. The answer is: ' + item.correct; fb.className = 'quiz-feedback incorrect'; }
        if (typeof recordQuizMistake === 'function') recordQuizMistake('vocab', item.kr, 'Vocabulary Quiz');
      }
      if (typeof trackExposure === 'function') trackExposure('vocab', item.kr);
      if (next) next.classList.add('visible');
    });
  });

  const nextBtn = card.querySelector('#quizNext');
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      practiceIdx++;
      loadPractice();
    });
  }
}

/* Word Order */
let woSlots = [];
let woUsed = {};
let woChecked = false;

function renderWordOrder(area) {
  const exercises = WORD_ORDER_EXERCISES;
  const ex = exercises[practiceIdx % exercises.length];
  const shuffledWords = shuffleArray(ex.words);
  woSlots = [];
  woUsed = {};
  woChecked = false;

  const card = document.createElement('div');
  card.className = 'quiz-card';

  card.innerHTML =
    '<div class="quiz-question-label">Arrange the words in the correct order:</div>' +
    '<div style="font-size:16px; color:var(--text-muted); margin-bottom:20px;">' + ex.prompt + '</div>' +
    '<div class="word-order-slots" id="woSlots" style="margin-bottom:12px;"></div>' +
    '<div class="word-order-slots" id="woBlocks" style="margin-bottom:16px; border-color:var(--border);"></div>' +
    '<div class="word-order-feedback" id="woFeedback"></div>' +
    '<div style="display:flex; gap:10px; margin-top:8px;">' +
      '<button class="word-order-check" id="woCheck">Check</button>' +
      '<button class="word-order-next" id="woNext">Next</button>' +
    '</div>';

  area.appendChild(card);

  const slotsEl = card.querySelector('#woSlots');
  const blocksEl = card.querySelector('#woBlocks');

  // Render blocks
  shuffledWords.forEach((word, i) => {
    const btn = document.createElement('button');
    btn.className = 'word-order-block';
    btn.textContent = word;
    btn.dataset.idx = i;
    btn.dataset.word = word;
    btn.addEventListener('click', function() {
      if (woChecked) return;
      if (woUsed[i]) return;
      woUsed[i] = true;
      woSlots.push({ word: word, idx: i });
      btn.style.opacity = '0.25';
      btn.style.pointerEvents = 'none';
      renderWoSlots(slotsEl, blocksEl, shuffledWords);
    });
    blocksEl.appendChild(btn);
  });

  function renderWoSlots(slotsEl, blocksEl, words) {
    slotsEl.innerHTML = '';
    if (woSlots.length === 0) {
      const ph = document.createElement('span');
      ph.style.color = 'var(--text-dim)';
      ph.style.fontSize = '13px';
      ph.textContent = 'Select words below';
      slotsEl.appendChild(ph);
      return;
    }
    woSlots.forEach((item, si) => {
      const s = document.createElement('button');
      s.className = 'word-order-slot';
      s.textContent = item.word;
      s.addEventListener('click', function() {
        if (woChecked) return;
        woUsed[item.idx] = false;
        woSlots.splice(si, 1);
        // Re-enable block
        const blk = blocksEl.querySelector('[data-idx="' + item.idx + '"]');
        if (blk) { blk.style.opacity = ''; blk.style.pointerEvents = ''; }
        renderWoSlots(slotsEl, blocksEl, words);
      });
      slotsEl.appendChild(s);
    });
  }

  const checkBtn = card.querySelector('#woCheck');
  const nextBtn = card.querySelector('#woNext');
  const fbEl = card.querySelector('#woFeedback');

  if (checkBtn) {
    checkBtn.addEventListener('click', function() {
      if (woChecked) return;
      if (woSlots.length === 0) {
        if (fbEl) fbEl.textContent = 'Select words to form the sentence.';
        return;
      }
      woChecked = true;
      const userAnswer = woSlots.map(s => s.word).join(' ');
      if (userAnswer === ex.answer) {
        if (fbEl) { fbEl.textContent = 'Correct.'; fbEl.className = 'word-order-feedback correct'; }
        if (nextBtn) nextBtn.style.display = 'inline-block';
      } else {
        if (fbEl) {
          fbEl.textContent = 'Incorrect. Correct order: ' + ex.answer;
          fbEl.className = 'word-order-feedback incorrect';
        }
        if (typeof recordQuizMistake === 'function') recordQuizMistake('sentence', ex.answer, 'Word Order Practice');
        setTimeout(() => { woChecked = false; }, 1500);
      }
      if (typeof trackExposure === 'function') trackExposure('sentences', ex.answer);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      practiceIdx++;
      loadPractice();
    });
  }
}


/* ============================================================
   STORAGE (namespaced, safe — never touches unrelated keys)
   ============================================================ */

const STORAGE_KEY = 'koreanLearning';

function loadState() {
  let state = null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = JSON.parse(raw);
  } catch (e) {
    state = null;
  }
  if (!state || typeof state !== 'object') state = {};
  state.settings = state.settings || { romanization: true };
  state.progress = state.progress || { completedLessons: [], builderCorrect: 0, builderTotal: 0 };
  state.exposure = state.exposure || { hangul: [], vocab: [], grammar: [], sentences: [] };
  state.mistakes = state.mistakes || [];
  state.streak = state.streak || { count: 0, lastDate: null };
  return state;
}

let appState = loadState();

function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    /* localStorage unavailable — app still works for this session */
  }
}

function trackExposure(category, id) {
  if (!appState.exposure[category]) appState.exposure[category] = [];
  if (appState.exposure[category].indexOf(id) === -1) {
    appState.exposure[category].push(id);
    saveState();
    if (typeof renderSkillMastery === 'function') renderSkillMastery();
    if (typeof renderOverviewProgress === 'function') renderOverviewProgress();
  }
}

function recordBuilderResult(ex, correct) {
  appState.progress.builderTotal++;
  if (correct) {
    appState.progress.builderCorrect++;
  } else {
    appState.mistakes.unshift({
      type: 'sentence',
      kr: ex.answer.join(' '),
      note: 'Sentence Builder — ' + ex.levelDesc,
      ts: Date.now(),
    });
    appState.mistakes = appState.mistakes.slice(0, 20);
  }
  trackExposure('sentences', ex.answer.join(' '));
  saveState();
  if (typeof renderReview === 'function') renderReview();
  if (typeof renderSkillMastery === 'function') renderSkillMastery();
  if (typeof renderOverviewProgress === 'function') renderOverviewProgress();
}

function recordQuizMistake(type, kr, note) {
  appState.mistakes.unshift({ type: type, kr: kr, note: note, ts: Date.now() });
  appState.mistakes = appState.mistakes.slice(0, 20);
  saveState();
  if (typeof renderReview === 'function') renderReview();
  if (typeof renderSkillMastery === 'function') renderSkillMastery();
  if (typeof renderOverviewProgress === 'function') renderOverviewProgress();
}

/* ---- Streak ---- */
function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const s = appState.streak;
  if (s.lastDate === today) {
    // already counted today
  } else if (s.lastDate) {
    const prev = new Date(s.lastDate);
    const diffDays = Math.round((new Date(today) - prev) / 86400000);
    s.count = diffDays === 1 ? s.count + 1 : 1;
    s.lastDate = today;
  } else {
    s.count = 1;
    s.lastDate = today;
  }
  saveState();
  const el = document.getElementById('sidebarStreak');
  if (el) el.textContent = 'Streak — ' + s.count + (s.count === 1 ? ' day' : ' days');
}


/* ============================================================
   ROMANIZATION TOGGLE
   ============================================================ */

function initRomToggle() {
  const btn = document.getElementById('romToggle');
  const stateEl = document.getElementById('romToggleState');
  if (!btn) return;

  function apply() {
    const on = appState.settings.romanization;
    document.body.classList.toggle('rom-off', !on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (stateEl) stateEl.textContent = on ? 'ON' : 'OFF';
  }

  btn.addEventListener('click', function() {
    appState.settings.romanization = !appState.settings.romanization;
    saveState();
    apply();
  });

  apply();
  applyRomanizationLevelHint();
}

/* Romanization stays fully user-controlled at every level — Korean text is
   never replaced. At higher levels this only adjusts emphasis/visibility of
   the toggle control itself, as a hint, not a forced change to appState. */
function applyRomanizationLevelHint() {
  const btn = document.getElementById('romToggle');
  if (!btn) return;
  const lvl = getLearnerLevel();
  btn.classList.remove('rom-toggle-deemphasized', 'rom-toggle-immersion');
  if (lvl === 'Advanced' || lvl === 'Highly Proficient') {
    btn.classList.add('rom-toggle-deemphasized');
    btn.title = 'Romanization is de-emphasized at your level, but still available if needed.';
  } else if (lvl === 'Immersion') {
    btn.classList.add('rom-toggle-immersion');
    btn.title = 'Romanization is hidden by default at Immersion level. Toggle it back on any time.';
  } else {
    btn.title = '';
  }
}


/* ============================================================
   AUDIO / PRONUNCIATION (Web Speech API)
   ============================================================ */

let koreanVoice = null;

function initSpeech() {
  if (!('speechSynthesis' in window)) return;
  function pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    koreanVoice = voices.find(v => v.lang === 'ko-KR') || voices.find(v => v.lang && v.lang.indexOf('ko') === 0) || null;
  }
  pickVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }
}

function speak(text, rate) {
  if (!text) return;
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ko-KR';
    utter.rate = rate || 1;
    if (koreanVoice) utter.voice = koreanVoice;
    window.speechSynthesis.speak(utter);
  } catch (e) {
    /* fail gracefully — speech unavailable */
  }
}

function bindListenButtons(root) {
  const scope = root || document;
  scope.querySelectorAll('.listen-btn[data-speak]').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    if (!('speechSynthesis' in window)) {
      btn.disabled = true;
      btn.title = 'Speech synthesis unavailable in this browser';
      return;
    }
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      speak(this.dataset.speak, this.dataset.rate ? parseFloat(this.dataset.rate) : 1);
    });
  });
}

function enhanceReadingAudio() {
  document.querySelectorAll('.rl-word').forEach(el => {
    const krEl = el.querySelector('.rl-word-kr');
    if (!krEl || el.dataset.audioAdded) return;
    el.dataset.audioAdded = '1';
    const btn = document.createElement('button');
    btn.className = 'listen-btn';
    btn.innerHTML = '<span class="listen-icon">▸</span> Listen';
    btn.setAttribute('aria-label', 'Listen to ' + krEl.textContent);
    btn.addEventListener('click', () => speak(krEl.textContent));
    el.appendChild(btn);
  });
  document.querySelectorAll('.rl-sentence').forEach(el => {
    const krEl = el.querySelector('.rl-sentence-kr');
    if (!krEl || el.dataset.audioAdded) return;
    el.dataset.audioAdded = '1';
    const btn = document.createElement('button');
    btn.className = 'listen-btn';
    btn.innerHTML = '<span class="listen-icon">▸</span> Listen';
    btn.setAttribute('aria-label', 'Listen to ' + krEl.textContent);
    btn.addEventListener('click', () => speak(krEl.textContent));
    el.appendChild(btn);
  });
  bindListenButtons(document);
}


/* ============================================================
   KOREAN VIRTUAL KEYBOARD + SYLLABLE COMPOSITION
   ============================================================ */

const CHO_LIST = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNG_LIST = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONG_LIST = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

function composeHangul(cho, jung, jong) {
  const ci = CHO_LIST.indexOf(cho);
  const vi = JUNG_LIST.indexOf(jung);
  const ji = JONG_LIST.indexOf(jong || '');
  if (ci < 0 || vi < 0 || ji < 0) return null;
  return String.fromCharCode(0xAC00 + (ci * 21 + vi) * 28 + ji);
}

function isCho(ch) { return CHO_LIST.indexOf(ch) !== -1; }
function isJung(ch) { return JUNG_LIST.indexOf(ch) !== -1; }

function renderKoreanKeyboard(container, inputEl) {
  if (!container || !inputEl) return;
  container.innerHTML = '';

  const state = { cho: null, jung: null, jong: null };

  function resetState() { state.cho = null; state.jung = null; state.jong = null; }

  function handleConsonant(ch) {
    const val = inputEl.value;
    if (state.cho && !state.jung) {
      // Replace pending lone consonant with the newly pressed one
      inputEl.value = val.slice(0, -1) + ch;
      state.cho = ch;
    } else if (state.cho && state.jung && !state.jong) {
      // Tentatively attach as batchim
      const composed = composeHangul(state.cho, state.jung, ch);
      if (composed) {
        inputEl.value = val.slice(0, -1) + composed;
        state.jong = ch;
      } else {
        inputEl.value = val + ch;
        resetState();
        state.cho = ch;
      }
    } else {
      inputEl.value = val + ch;
      resetState();
      state.cho = ch;
    }
    inputEl.focus();
  }

  function handleVowel(ch) {
    const val = inputEl.value;
    if (state.cho && state.jung && state.jong) {
      // Batchim becomes the onset of a new syllable
      const baseNoJong = composeHangul(state.cho, state.jung, '');
      const newSyllable = composeHangul(state.jong, ch, '');
      inputEl.value = val.slice(0, -1) + (baseNoJong || '') + (newSyllable || ch);
      state.cho = state.jong; state.jung = ch; state.jong = null;
    } else if (state.cho && !state.jung) {
      const composed = composeHangul(state.cho, ch, '');
      inputEl.value = val.slice(0, -1) + (composed || (state.cho + ch));
      state.jung = ch;
    } else {
      // No pending consonant — use the silent ㅇ onset
      const composed = composeHangul('ㅇ', ch, '');
      inputEl.value = val + (composed || ch);
      resetState();
      state.cho = 'ㅇ'; state.jung = ch;
    }
    inputEl.focus();
  }

  function handleBackspace() {
    inputEl.value = inputEl.value.slice(0, -1);
    resetState();
    inputEl.focus();
  }

  function makeRow(chars, handler) {
    const row = document.createElement('div');
    row.className = 'kb-row';
    chars.forEach(ch => {
      const key = document.createElement('button');
      key.type = 'button';
      key.className = 'kb-key';
      key.textContent = ch;
      key.addEventListener('click', () => handler(ch));
      row.appendChild(key);
    });
    container.appendChild(row);
  }

  makeRow(['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'], handleConsonant);
  makeRow(['ㄲ','ㄸ','ㅃ','ㅆ','ㅉ'], handleConsonant);
  makeRow(['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ'], handleVowel);
  makeRow(['ㅐ','ㅒ','ㅔ','ㅖ','ㅘ','ㅚ','ㅝ','ㅢ'], handleVowel);

  const utilRow = document.createElement('div');
  utilRow.className = 'kb-row';
  const spaceKey = document.createElement('button');
  spaceKey.type = 'button';
  spaceKey.className = 'kb-key kb-wide';
  spaceKey.textContent = 'Space';
  spaceKey.addEventListener('click', () => { inputEl.value += ' '; resetState(); inputEl.focus(); });
  const backKey = document.createElement('button');
  backKey.type = 'button';
  backKey.className = 'kb-key kb-wide';
  backKey.textContent = 'Backspace';
  backKey.addEventListener('click', handleBackspace);
  utilRow.appendChild(spaceKey);
  utilRow.appendChild(backKey);
  container.appendChild(utilRow);
}


/* ============================================================
   LESSONS (guided curriculum)
   ============================================================ */

const LESSONS = [
  { id:1, category:'Hangul Foundation', title:'Korean Alphabet', desc:'An overview of Hangul and how it works.', difficulty:'Beginner',
    intro:'Hangul is the Korean writing system, created in 1443. It is made of consonants and vowels combined into syllable blocks.',
    examples:[{kr:'한글', rom:'han·geul', en:'the Hangul alphabet'}],
    explanation:'Every Korean syllable is written as a block combining at least one consonant and one vowel. Explore the Hangul section for the full consonant and vowel charts.',
    practicePrompt:'How many basic consonants does Hangul have?', practiceOptions:['10','14','20'], practiceAnswer:'14' },
  { id:2, category:'Hangul Foundation', title:'Basic Vowels', desc:'The 10 basic Korean vowels.', difficulty:'Beginner',
    intro:'Korean has 10 basic vowels, each represented by a simple shape based on vertical and horizontal lines and dots.',
    examples:[{kr:'아', rom:'a', en:'ah sound'}, {kr:'어', rom:'eo', en:'uh sound'}, {kr:'이', rom:'i', en:'ee sound'}],
    explanation:'Vowels never stand alone in writing — they combine with a consonant (often the silent ㅇ) to form a syllable block.',
    practicePrompt:'Which vowel makes the "ee" sound?', practiceOptions:['ㅏ','ㅣ','ㅡ'], practiceAnswer:'ㅣ' },
  { id:3, category:'Hangul Foundation', title:'Basic Consonants', desc:'The 14 basic Korean consonants.', difficulty:'Beginner',
    intro:'Basic consonants form the onset of a syllable block. Their shapes are based on the position of the mouth and tongue.',
    examples:[{kr:'ㄱ', rom:'g/k', en:'giyeok'}, {kr:'ㄴ', rom:'n', en:'nieun'}, {kr:'ㅁ', rom:'m', en:'mieum'}],
    explanation:'Practice recognizing each consonant\'s shape and sound in the Hangul section before moving on.',
    practicePrompt:'What sound does ㄴ represent?', practiceOptions:['n','m','s'], practiceAnswer:'n' },
  { id:4, category:'Hangul Foundation', title:'Double Consonants', desc:'Tense consonants: ㄲ ㄸ ㅃ ㅆ ㅉ.', difficulty:'Beginner',
    intro:'Doubling a consonant creates a "tense" sound — pronounced with more force and no aspiration.',
    examples:[{kr:'까', rom:'kka', en:'tense version of 가'}, {kr:'싸다', rom:'ssa·da', en:'to be cheap'}],
    explanation:'Tense consonants are distinct phonemes in Korean, not simply "doubled" sounds — they change word meaning.',
    practicePrompt:'ㅆ is the tense version of which consonant?', practiceOptions:['ㅅ','ㅈ','ㅎ'], practiceAnswer:'ㅅ' },
  { id:5, category:'Hangul Foundation', title:'Compound Vowels', desc:'Combined vowel sounds like ㅘ, ㅝ, ㅢ.', difficulty:'Beginner',
    intro:'Compound vowels combine two basic vowel shapes into a single glide sound.',
    examples:[{kr:'와', rom:'wa', en:'wa sound'}, {kr:'워', rom:'wo', en:'wo sound'}, {kr:'의', rom:'ui', en:'ui sound'}],
    explanation:'These appear often in loanwords and grammar endings, so recognizing them speeds up reading.',
    practicePrompt:'Which compound vowel means "ui"?', practiceOptions:['ㅢ','ㅘ','ㅚ'], practiceAnswer:'ㅢ' },
  { id:6, category:'Hangul Foundation', title:'Syllable Blocks', desc:'How consonants and vowels combine.', difficulty:'Beginner',
    intro:'A syllable block always starts with a consonant (onset), followed by a vowel, and optionally a final consonant (batchim).',
    examples:[{kr:'가', rom:'ga', en:'ㄱ + ㅏ'}, {kr:'나', rom:'na', en:'ㄴ + ㅏ'}],
    explanation:'Try the Syllable Constructor in the Hangul section to build your own blocks.',
    practicePrompt:'ㄱ + ㅏ makes which syllable?', practiceOptions:['가','나','다'], practiceAnswer:'가' },
  { id:7, category:'Hangul Foundation', title:'Batchim', desc:'The final consonant in a syllable block.', difficulty:'Beginner',
    intro:'받침 (batchim) is a consonant placed underneath a vowel to close a syllable, changing both the sound and meaning.',
    examples:[{kr:'각', rom:'gak', en:'ㄱ + ㅏ + ㄱ'}, {kr:'밥', rom:'bap', en:'rice / meal'}],
    explanation:'Almost any consonant can serve as batchim, though pronunciation sometimes simplifies in speech.',
    practicePrompt:'What is the batchim in 밥?', practiceOptions:['ㅂ','ㅁ','ㄱ'], practiceAnswer:'ㅂ' },
  { id:8, category:'Hangul Foundation', title:'Basic Reading', desc:'Reading full words and short phrases.', difficulty:'Beginner',
    intro:'With consonants, vowels, and batchim combined, you can begin reading real Korean words.',
    examples:[{kr:'학교', rom:'hak·gyo', en:'school'}, {kr:'안녕하세요', rom:'an·nyeong·ha·se·yo', en:'hello'}],
    explanation:'Visit the Reading section to practice with characters, words, and full sentences.',
    practicePrompt:'What does 학교 mean?', practiceOptions:['school','friend','book'], practiceAnswer:'school' },
  { id:9, category:'Beginner Korean', title:'Basic Greetings', desc:'Common greetings for everyday use.', difficulty:'Beginner',
    intro:'Korean greetings vary with formality. 안녕하세요 is the standard polite greeting used with most people.',
    examples:[{kr:'안녕하세요', rom:'an·nyeong·ha·se·yo', en:'Hello (formal)'}, {kr:'감사합니다', rom:'gam·sa·ham·ni·da', en:'Thank you (formal)'}],
    explanation:'Formal speech (합니다/해요 forms) is the safe default with strangers, elders, or in professional settings.',
    practicePrompt:'What does 감사합니다 mean?', practiceOptions:['Hello','Thank you','Goodbye'], practiceAnswer:'Thank you' },
  { id:10, category:'Beginner Korean', title:'Introducing Yourself', desc:'Basic self-introduction sentences.', difficulty:'Beginner',
    intro:'Introducing yourself typically uses the topic marker 은/는 with your name or role, plus the copula 이에요/예요.',
    examples:[{kr:'저는 학생이에요.', rom:'jeo·neun hak·saeng·i·e·yo', en:'I am a student.'}],
    explanation:'저 (I, formal) + 는 (topic marker) + 학생 (student) + 이에요 (am/is).',
    practicePrompt:'How do you say "I am a student"?', practiceOptions:['저는 학생이에요.','저는 친구예요.','학교에 가요.'], practiceAnswer:'저는 학생이에요.' },
  { id:11, category:'Beginner Korean', title:'Topic Marker 은/는', desc:'Marking the topic of a sentence.', difficulty:'Beginner',
    intro:'은/는 marks what a sentence is about. Use 는 after a vowel-final noun, 은 after a consonant-final noun.',
    examples:[{kr:'저는 학생이에요.', rom:'jeo·neun hak·saeng·i·e·yo', en:'I am a student.'}],
    explanation:'저 ends in a vowel, so it takes 는 rather than 은.',
    practicePrompt:'학생 ends in a consonant. Which marker follows it if it were the topic?', practiceOptions:['은','는','을'], practiceAnswer:'은' },
  { id:12, category:'Beginner Korean', title:'Object Marker 을/를', desc:'Marking the direct object.', difficulty:'Beginner',
    intro:'을/를 marks the direct object of a verb. Use 를 after a vowel-final noun, 을 after a consonant-final noun.',
    examples:[{kr:'저는 밥을 먹어요.', rom:'jeo·neun bab·eul meog·eo·yo', en:'I eat rice.'}],
    explanation:'밥 ends in the consonant ㅂ, so it takes 을.',
    practicePrompt:'한국어 ends in a vowel. Which object marker follows it?', practiceOptions:['을','를','에'], practiceAnswer:'를' },
  { id:13, category:'Beginner Korean', title:'Location Marker 에', desc:'Marking destination or static location.', difficulty:'Beginner',
    intro:'에 marks a destination ("to") or a location where something exists ("at/in"). It attaches directly to the noun.',
    examples:[{kr:'저는 학교에 가요.', rom:'jeo·neun hak·gyo·e ga·yo', en:'I go to school.'}],
    explanation:'에 does not change form based on the final sound of the noun — it always attaches as is.',
    practicePrompt:'Which marker means "to/at"?', practiceOptions:['에','을','는'], practiceAnswer:'에' },
  { id:14, category:'Beginner Korean', title:'Basic Sentence Order', desc:'Subject → Object → Verb.', difficulty:'Beginner',
    intro:'Korean is an SOV language — the verb always comes at the end. Markers, not position, show grammatical roles.',
    examples:[{kr:'저는 한국어를 공부해요.', rom:'jeo·neun han·gu·geo·reul gong·bu·hae·yo', en:'I study Korean.'}],
    explanation:'저는 (subject/topic) + 한국어를 (object) + 공부해요 (verb) — the verb closes the sentence.',
    practicePrompt:'Where does the verb go in a Korean sentence?', practiceOptions:['First','Middle','Last'], practiceAnswer:'Last' },
  { id:15, category:'Beginner Korean', title:'Present Tense', desc:'Forming the present tense with 아요/어요.', difficulty:'Beginner',
    intro:'The polite present tense typically ends in 아요 or 어요, depending on the verb stem\'s final vowel.',
    examples:[{kr:'가요', rom:'ga·yo', en:'go (present)'}, {kr:'먹어요', rom:'meog·eo·yo', en:'eat (present)'}],
    explanation:'Stems with ㅏ/ㅗ take 아요; most other stems take 어요.',
    practicePrompt:'What does 가요 mean?', practiceOptions:['go','eat','study'], practiceAnswer:'go' },
  { id:16, category:'Beginner Korean', title:'Basic Politeness', desc:'Formal vs. polite speech levels.', difficulty:'Beginner',
    intro:'Korean has multiple speech levels. 이에요/예요 and 아요/어요 endings are polite and appropriate for daily use.',
    examples:[{kr:'네, 알겠어요.', rom:'ne, al·gess·eo·yo', en:'Yes, I understand.'}],
    explanation:'These polite forms work well with strangers, coworkers, and people older than you.',
    practicePrompt:'Which ending is polite present tense?', practiceOptions:['어요','다','자'], practiceAnswer:'어요' },

  /* ---------------- ELEMENTARY ---------------- */
  { id:17, category:'Elementary Korean', level:'Elementary', title:'Past Tense', desc:'Forming the past tense with 았/었어요.', difficulty:'Elementary',
    intro:'Korean past tense inserts 았 or 었 before the polite ending, chosen the same way as present tense vowel harmony.',
    examples:[{kr:'갔어요', rom:'gass·eo·yo', en:'went'}, {kr:'먹었어요', rom:'meog·eoss·eo·yo', en:'ate'}],
    explanation:'가다 (ㅏ stem) takes 았어요; 먹다 (other stems) takes 었어요.',
    practicePrompt:'What does 갔어요 mean?', practiceOptions:['went','go','will go'], practiceAnswer:'went' },
  { id:18, category:'Elementary Korean', level:'Elementary', title:'Future / Intention', desc:'Expressing future plans with (으)ㄹ 거예요.', difficulty:'Elementary',
    intro:'(으)ㄹ 거예요 expresses future plans or predictions, attached to the verb stem.',
    examples:[{kr:'내일 갈 거예요.', rom:'nae·il gal geo·ye·yo', en:'I will go tomorrow.'}],
    explanation:'갈 comes from 가다 + ㄹ 거예요, dropping 다 and adding the future marker.',
    practicePrompt:'Which ending expresses future plans?', practiceOptions:['ㄹ 거예요','었어요','고 있어요'], practiceAnswer:'ㄹ 거예요' },
  { id:19, category:'Elementary Korean', level:'Elementary', title:'Negation', desc:'Negating verbs with 안 and 지 않다.', difficulty:'Elementary',
    intro:'안 goes before the verb for short-form negation; -지 않다 attaches to the stem for long-form negation.',
    examples:[{kr:'안 가요.', rom:'an ga·yo', en:'I am not going.'}, {kr:'가지 않아요.', rom:'ga·ji an·a·yo', en:'I am not going.'}],
    explanation:'Both forms are interchangeable in meaning; long-form negation sounds slightly more formal.',
    practicePrompt:'Which word means "not" placed before a verb?', practiceOptions:['안','못','는'], practiceAnswer:'안' },
  { id:20, category:'Elementary Korean', level:'Elementary', title:'Requests', desc:'Making polite requests with 아/어 주세요.', difficulty:'Elementary',
    intro:'아/어 주세요 turns a verb into a polite request, literally "please do X for me."',
    examples:[{kr:'도와주세요.', rom:'do·wa·ju·se·yo', en:'Please help me.'}],
    explanation:'도와 (help, irregular ㅂ stem) + 주세요 forms the polite request.',
    practicePrompt:'What does 도와주세요 mean?', practiceOptions:['Please help me','I am helping','Help was given'], practiceAnswer:'Please help me' },
  { id:21, category:'Elementary Korean', level:'Elementary', title:'Desires with 고 싶다', desc:'Expressing "want to" with -고 싶어요.', difficulty:'Elementary',
    intro:'-고 싶어요 attaches to a verb stem to express a desire to do something.',
    examples:[{kr:'먹고 싶어요.', rom:'meok·go sip·eo·yo', en:'I want to eat.'}],
    explanation:'먹다 → 먹 (stem) + 고 싶어요.',
    practicePrompt:'What does 먹고 싶어요 mean?', practiceOptions:['I want to eat','I ate','I am eating'], practiceAnswer:'I want to eat' },
  { id:22, category:'Elementary Korean', level:'Elementary', title:'Ability with 을/ㄹ 수 있다', desc:'Expressing "can/cannot" do something.', difficulty:'Elementary',
    intro:'(으)ㄹ 수 있다/없다 expresses ability or possibility, attached to the verb stem.',
    examples:[{kr:'한국어를 할 수 있어요.', rom:'han·gu·geo·reul hal su iss·eo·yo', en:'I can speak Korean.'}],
    explanation:'할 (하다 + ㄹ) + 수 있어요 = "can do."',
    practicePrompt:'Which pattern means "can do"?', practiceOptions:['ㄹ 수 있다','고 싶다','지 않다'], practiceAnswer:'ㄹ 수 있다' },
  { id:23, category:'Elementary Korean', level:'Elementary', title:'Time Expressions', desc:'Talking about days, times, and frequency.', difficulty:'Elementary',
    intro:'Time words like 오늘 (today), 내일 (tomorrow), and 매일 (every day) typically appear near the start of a sentence.',
    examples:[{kr:'저는 매일 공부해요.', rom:'jeo·neun mae·il gong·bu·hae·yo', en:'I study every day.'}],
    explanation:'매일 is an adverb of frequency and does not take a particle.',
    practicePrompt:'What does 매일 mean?', practiceOptions:['every day','today','sometimes'], practiceAnswer:'every day' },
  { id:24, category:'Elementary Korean', level:'Elementary', title:'Daily Routines', desc:'Describing a typical day in connected sentences.', difficulty:'Elementary',
    intro:'Daily-routine sentences link several simple sentences using -고 (and) to describe a sequence of actions.',
    examples:[{kr:'아침에 일어나고 밥을 먹어요.', rom:'a·chim·e il·eo·na·go bab·eul meog·eo·yo', en:'I wake up in the morning and eat.'}],
    explanation:'-고 simply connects two clauses in sequence without implying cause or contrast.',
    practicePrompt:'Which connector links two actions in sequence?', practiceOptions:['고','지만','면'], practiceAnswer:'고' },

  /* ---------------- INTERMEDIATE ---------------- */
  { id:25, category:'Intermediate Korean', level:'Intermediate', title:'Reason with -아/어서', desc:'Expressing cause and effect.', difficulty:'Intermediate',
    intro:'-아/어서 connects two clauses where the first is the reason for the second. It cannot be used with commands or suggestions.',
    examples:[{kr:'배고파서 밥을 먹었어요.', rom:'bae·go·pa·seo bab·eul meog·eoss·eo·yo', en:'Because I was hungry, I ate.'}],
    explanation:'배고프다 (be hungry) → 배고파서 links the reason to the result clause.',
    practicePrompt:'Which ending means "because"?', practiceOptions:['아/어서','지만','면서'], practiceAnswer:'아/어서' },
  { id:26, category:'Intermediate Korean', level:'Intermediate', title:'Contrast with -지만', desc:'Expressing "but/although."', difficulty:'Intermediate',
    intro:'-지만 attaches to a verb or adjective stem to introduce a contrasting clause.',
    examples:[{kr:'맛있지만 비싸요.', rom:'mas·it·ji·man bi·ssa·yo', en:'It is delicious, but expensive.'}],
    explanation:'맛있다 → 맛있지만 introduces the contrast that follows.',
    practicePrompt:'Which ending means "but"?', practiceOptions:['지만','아서','면'], practiceAnswer:'지만' },
  { id:27, category:'Intermediate Korean', level:'Intermediate', title:'Conditional -면', desc:'Expressing "if/when."', difficulty:'Intermediate',
    intro:'-면 attaches to a verb stem to form a conditional or temporal clause, "if" or "when."',
    examples:[{kr:'시간이 있으면 갈게요.', rom:'si·gan·i iss·eu·myeon gal·ge·yo', en:'If I have time, I will go.'}],
    explanation:'있다 → 있으면 (consonant stem takes 으면).',
    practicePrompt:'Which ending means "if"?', practiceOptions:['면','지만','고'], practiceAnswer:'면' },
  { id:28, category:'Intermediate Korean', level:'Intermediate', title:'Progressive -고 있다', desc:'Expressing an ongoing action.', difficulty:'Intermediate',
    intro:'-고 있다 attaches to a verb stem to show an action in progress, similar to English "-ing."',
    examples:[{kr:'공부하고 있어요.', rom:'gong·bu·ha·go iss·eo·yo', en:'I am studying.'}],
    explanation:'공부하다 → 공부하고 있어요, distinct from the resultative -아/어 있다.',
    practicePrompt:'Which pattern shows an action in progress?', practiceOptions:['고 있다','아/어 있다','ㄴ 적 있다'], practiceAnswer:'고 있다' },
  { id:29, category:'Intermediate Korean', level:'Intermediate', title:'Experience -ㄴ/은 적 있다', desc:'Expressing "have ever done."', difficulty:'Intermediate',
    intro:'-ㄴ/은 적 있다 attaches to a past verb stem to express having done something before.',
    examples:[{kr:'한국에 가 본 적 있어요.', rom:'han·gu·ge ga bon jeog iss·eo·yo', en:'I have been to Korea before.'}],
    explanation:'Often combined with -아/어 보다 (to try) to mean "have tried doing."',
    practicePrompt:'Which pattern expresses past experience?', practiceOptions:['ㄴ 적 있다','고 있다','ㄹ 거예요'], practiceAnswer:'ㄴ 적 있다' },
  { id:30, category:'Intermediate Korean', level:'Intermediate', title:'Nominalization -기 / -음', desc:'Turning verbs into nouns.', difficulty:'Intermediate',
    intro:'-기 and -음/-ㅁ attach to a verb stem to create a noun form, used in titles, lists, and formal writing.',
    examples:[{kr:'한국어 배우기', rom:'han·gu·geo bae·u·gi', en:'learning Korean'}],
    explanation:'-기 is more common in everyday and instructional contexts; -음 sounds more formal or abstract.',
    practicePrompt:'Which suffix turns a verb into a noun?', practiceOptions:['기','지만','면서'], practiceAnswer:'기' },
  { id:31, category:'Intermediate Korean', level:'Intermediate', title:'Indirect Speech', desc:'Reporting what someone said.', difficulty:'Intermediate',
    intro:'Indirect quotation uses -다고 하다 (statements), -냐고 하다 (questions), and -라고 하다 (commands).',
    examples:[{kr:'내일 온다고 했어요.', rom:'nae·il on·da·go haess·eo·yo', en:'They said they would come tomorrow.'}],
    explanation:'온다 (come, plain form) + 고 하다 reports the original statement.',
    practicePrompt:'Which ending reports a statement someone made?', practiceOptions:['다고 하다','고 있다','면서'], practiceAnswer:'다고 하다' },
  { id:32, category:'Intermediate Korean', level:'Intermediate', title:'Simultaneous -면서', desc:'Doing two things at once.', difficulty:'Intermediate',
    intro:'-면서 attaches to a verb stem to describe two actions happening at the same time, by the same subject.',
    examples:[{kr:'음악을 들으면서 공부해요.', rom:'eum·ag·eul deul·eu·myeon·seo gong·bu·hae·yo', en:'I study while listening to music.'}],
    explanation:'듣다 (irregular ㄷ) → 들으면서.',
    practicePrompt:'Which ending means "while doing"?', practiceOptions:['면서','지만','ㄴ 적 있다'], practiceAnswer:'면서' },

  /* ---------------- NATURAL KOREAN ---------------- */
  { id:33, category:'Natural Korean', level:'Upper Intermediate', title:'Spoken Contractions', desc:'How formal pronouns and topics shrink in speech.', difficulty:'Upper Intermediate',
    intro:'In natural spoken Korean, topic-marked pronouns and demonstratives contract: 저는→전, 나는→난, 이것은→이건.',
    examples:[{kr:'전 괜찮아요.', rom:'jeon gwaen·chan·a·yo', en:'I\'m fine. (contracted from 저는)'}],
    explanation:'These contractions are standard in speech but are usually avoided in formal writing.',
    practicePrompt:'What is the spoken contraction of 저는?', practiceOptions:['전','절','제가'], practiceAnswer:'전' },
  { id:34, category:'Natural Korean', level:'Upper Intermediate', title:'Casual Confirmations', desc:'Shortened tags like 그렇죠 and 진짜?', difficulty:'Upper Intermediate',
    intro:'Casual speech shortens confirmation phrases: 그렇습니다→그렇죠, 진짜요?→진짜?, dropping the polite 요 in very informal contexts.',
    examples:[{kr:'진짜?', rom:'jin·jja', en:'Really? (very casual, among close friends)'}],
    explanation:'Dropping 요 entirely is 반말 (informal speech) and only appropriate with close friends or younger people.',
    practicePrompt:'Which is the casual version of 진짜요?', practiceOptions:['진짜?','진짜입니다','진짜였어요'], practiceAnswer:'진짜?' },
  { id:35, category:'Natural Korean', level:'Upper Intermediate', title:'Spoken vs. Written Register', desc:'Recognizing when contractions are appropriate.', difficulty:'Upper Intermediate',
    intro:'Written Korean (essays, articles, formal messages) rarely uses contractions; spoken Korean uses them constantly.',
    examples:[{kr:'그건 제 책이에요.', rom:'geu·geon je chaeg·i·e·yo', en:'That is my book. (spoken, from 그것은)'}],
    explanation:'Using 그것은 instead of 그건 in casual conversation can sound stiff or overly formal.',
    practicePrompt:'Where are contractions like 이건/그건 most appropriate?', practiceOptions:['Spoken conversation','Formal essays','Legal documents'], practiceAnswer:'Spoken conversation' },

  /* ---------------- HONORIFICS & SPEECH LEVELS ---------------- */
  { id:36, category:'Honorifics & Speech Levels', level:'Upper Intermediate', title:'Speech Level Overview', desc:'반말, 해요체, and 합니다체 compared.', difficulty:'Upper Intermediate',
    intro:'Korean has distinct speech levels: 반말 (informal, close friends), 해요체 (polite, everyday default), and 합니다체 (formal, broadcasts and presentations).',
    examples:[{kr:'뭐 해?', rom:'mwo hae', en:'What are you doing? (반말)'}, {kr:'뭐 해요?', rom:'mwo hae·yo', en:'What are you doing? (해요체)'}, {kr:'무엇을 합니까?', rom:'mu·eos·eul ham·ni·kka', en:'What are you doing? (합니다체)'}],
    explanation:'해요체 is the safest default for learners; 합니다체 fits presentations, news, and customer service.',
    practicePrompt:'Which speech level is used with close friends of the same age?', practiceOptions:['반말','해요체','합니다체'], practiceAnswer:'반말' },
  { id:37, category:'Honorifics & Speech Levels', level:'Upper Intermediate', title:'Subject Honorifics -시-', desc:'Raising the subject with -시-.', difficulty:'Upper Intermediate',
    intro:'The honorific infix -시- is inserted before the ending to show respect toward the subject of the sentence, typically an elder or superior.',
    examples:[{kr:'선생님께서 오세요.', rom:'seon·saeng·nim·kke·seo o·se·yo', en:'The teacher is coming. (honorific)'}],
    explanation:'께서 is the honorific subject marker (replacing 이/가), and 오세요 contains -시-.',
    practicePrompt:'Which infix shows respect toward the subject?', practiceOptions:['시','겠','았'], practiceAnswer:'시' },
  { id:38, category:'Honorifics & Speech Levels', level:'Upper Intermediate', title:'Humble Forms', desc:'Lowering yourself to show respect to others.', difficulty:'Upper Intermediate',
    intro:'Humble forms replace plain verbs with modest equivalents when speaking about your own actions to someone senior, e.g. 주다→드리다, 말하다→말씀드리다.',
    examples:[{kr:'선생님께 드릴게요.', rom:'seon·saeng·nim·kke deu·ril·ge·yo', en:'I will give it to the teacher. (humble)'}],
    explanation:'께 is the honorific counterpart of 에게, used when the recipient is someone you show respect to.',
    practicePrompt:'What is the humble form of 주다 (to give)?', practiceOptions:['드리다','주세요','주셨어요'], practiceAnswer:'드리다' },

  /* ---------------- ADVANCED ---------------- */
  { id:39, category:'Advanced Korean', level:'Advanced', title:'Formal Written Style', desc:'The -다 plain style used in essays and news.', difficulty:'Advanced',
    intro:'Formal written Korean (essays, news articles, academic text) uses the plain -다 ending rather than 해요/합니다 forms.',
    examples:[{kr:'한국어는 배우기 쉽지 않다.', rom:'han·gu·geo·neun bae·u·gi swip·ji anh·da', en:'Korean is not easy to learn. (written style)'}],
    explanation:'The -다 style has no built-in listener — it reads as an objective statement, common in articles and reports.',
    practicePrompt:'Which ending is typical of formal written Korean?', practiceOptions:['다','해요','합니다'], practiceAnswer:'다' },
  { id:40, category:'Advanced Korean', level:'Advanced', title:'Common Idioms', desc:'Figurative expressions used in daily speech.', difficulty:'Advanced',
    intro:'Idioms carry meaning beyond their literal words. 발이 넓다 ("wide feet") means "to know a lot of people."',
    examples:[{kr:'그는 발이 넓어요.', rom:'geu·neun bal·i neolb·eo·yo', en:'He knows a lot of people. (lit. "his feet are wide")'}],
    explanation:'Idioms should be learned as fixed units — the literal translation rarely matches the intended meaning.',
    practicePrompt:'What does 발이 넓다 mean?', practiceOptions:['Knows many people','Walks quickly','Has big feet'], practiceAnswer:'Knows many people' },
  { id:41, category:'Advanced Korean', level:'Advanced', title:'Proverbs', desc:'Traditional sayings and their lessons.', difficulty:'Advanced',
    intro:'Proverbs (속담) condense cultural wisdom into short, often metaphorical, sentences.',
    examples:[{kr:'시작이 반이다.', rom:'si·jag·i ban·i·da', en:'Starting is half (the work). (i.e. "well begun is half done")'}],
    explanation:'This proverb encourages taking the first step, since starting is considered the hardest part.',
    practicePrompt:'What does 시작이 반이다 mean?', practiceOptions:['Starting is half the work','Finishing matters most','Patience is a virtue'], practiceAnswer:'Starting is half the work' },
  { id:42, category:'Advanced Korean', level:'Advanced', title:'Opinion Writing', desc:'Structuring an argument in Korean.', difficulty:'Advanced',
    intro:'Korean opinion writing typically opens with a position, supports it with reasons (이유), and closes with a summary (결론).',
    examples:[{kr:'제 생각에는 …이/가 중요하다고 봅니다.', rom:'je saeng·gag·e·neun …i/ga jung·yo·ha·da·go bom·ni·da', en:'In my opinion, I think … is important.'}],
    explanation:'제 생각에는 (in my opinion) is a standard opener for stating a position in formal writing.',
    practicePrompt:'Which phrase introduces an opinion in formal Korean?', practiceOptions:['제 생각에는','그건 그렇고','아무튼'], practiceAnswer:'제 생각에는' },

  /* ---------------- HIGHLY PROFICIENT ---------------- */
  { id:43, category:'Highly Proficient', level:'Highly Proficient', title:'Debate Language', desc:'Agreeing, disagreeing, and conceding a point.', difficulty:'Highly Proficient',
    intro:'Debate register uses set phrases: 동의합니다 (I agree), 반대합니다 (I disagree), 일리가 있지만 (that has a point, but).',
    examples:[{kr:'일리가 있지만 저는 다르게 생각합니다.', rom:'il·li·ga it·ji·man jeo·neun da·reu·ge saeng·gag·ham·ni·da', en:'That has a point, but I think differently.'}],
    explanation:'일리가 있다 concedes partial validity before pivoting to a counterargument — a common debate strategy.',
    practicePrompt:'Which phrase means "I disagree"?', practiceOptions:['반대합니다','동의합니다','모르겠습니다'], practiceAnswer:'반대합니다' },
  { id:44, category:'Highly Proficient', level:'Highly Proficient', title:'Register Shifting', desc:'Reading context to choose the right register.', difficulty:'Highly Proficient',
    intro:'Fluent speakers shift register based on audience, setting, and relationship — the same idea can be phrased informally, politely, or formally.',
    examples:[{kr:'미안 / 죄송해요 / 죄송합니다', rom:'mi·an / joe·song·hae·yo / joe·song·ham·ni·da', en:'sorry (반말 / 해요체 / 합니다체)'}],
    explanation:'Choosing the wrong register — even with correct grammar — can sound rude or oddly stiff.',
    practicePrompt:'What primarily determines register choice in Korean?', practiceOptions:['Audience and relationship','Sentence length','Verb tense'], practiceAnswer:'Audience and relationship' },

  /* ---------------- IMMERSION ---------------- */
  { id:45, category:'Immersion', level:'Immersion', title:'생각을 한국어로 하기', desc:'한국어로만 생각하고 표현하는 연습.', difficulty:'Immersion',
    intro:'번역하지 말고, 상황을 보고 한국어로 바로 반응해 보세요.',
    examples:[{kr:'하루 종일 아무것도 못 먹었어요.', rom:'', en:'상황: 배가 많이 고파요. 어떻게 말할까요?'}],
    explanation:'자연스러운 반응: "배고파요." 번역보다 상황에 맞는 표현을 먼저 떠올리는 연습이 중요합니다.',
    practicePrompt:'하루 종일 못 먹었을 때 자연스러운 표현은?', practiceOptions:['배고파요','배불러요','졸려요'], practiceAnswer:'배고파요' },
  { id:46, category:'Immersion', level:'Immersion', title:'뉴스 읽기', desc:'짧은 기사 형식의 글 읽고 이해하기.', difficulty:'Immersion',
    intro:'실제와 비슷한 문어체 문장을 읽고 핵심 내용을 파악하는 연습입니다.',
    examples:[{kr:'정부는 내년부터 새로운 정책을 시행한다고 밝혔다.', rom:'', en:'(정답 힌트 없이 읽고 이해해 보세요)'}],
    explanation:'문어체 -다 어미와 간접 인용 -고 밝히다 표현에 익숙해지는 것이 목표입니다.',
    practicePrompt:'이 문장에서 정부가 한 일은?', practiceOptions:['정책 시행을 발표했다','정책을 폐지했다','아무 말도 안 했다'], practiceAnswer:'정책 시행을 발표했다' },
];

let currentLessonId = null;

/* ---- TOPIK Preparation — uses the existing Lessons architecture,
   tags a subset of existing lessons instead of creating new content. ---- */
const TOPIK_MAP = {
  1:'I', 2:'I', 3:'I', 6:'I', 8:'I', 9:'I', 10:'I', 11:'I', 12:'I', 13:'I', 14:'I', 15:'I', 16:'I',
  17:'I', 19:'I', 23:'I',
  25:'II', 26:'II', 27:'II', 28:'II', 29:'II', 30:'II', 31:'II', 36:'II', 39:'II', 42:'II',
};
let topikFilter = 'all';

function initTopikFilter() {
  const container = document.getElementById('section-lessons');
  if (!container || document.getElementById('topikFilterRow')) return;
  const row = document.createElement('div');
  row.className = 'topik-filter-row';
  row.id = 'topikFilterRow';
  row.innerHTML =
    '<button class="topik-filter-btn active" data-topik="all">All Lessons</button>' +
    '<button class="topik-filter-btn" data-topik="I">TOPIK I Preparation</button>' +
    '<button class="topik-filter-btn" data-topik="II">TOPIK II Preparation</button>';
  const curriculum = document.getElementById('lessonCurriculum');
  container.insertBefore(row, curriculum);
  row.querySelectorAll('.topik-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      row.querySelectorAll('.topik-filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      topikFilter = this.dataset.topik;
      renderLessonList();
    });
  });
}

function getLessonStatus(lesson) {
  if (appState.progress.completedLessons.indexOf(lesson.id) !== -1) return 'completed';
  const firstIncomplete = LESSONS.find(l => appState.progress.completedLessons.indexOf(l.id) === -1);
  if (firstIncomplete && firstIncomplete.id === lesson.id) return 'current';
  return 'not-started';
}

function renderLessonList() {
  const container = document.getElementById('lessonCurriculum');
  if (!container) return;
  container.innerHTML = '';

  if (topikFilter !== 'all') {
    const note = document.createElement('div');
    note.className = 'topik-disclaimer';
    note.textContent = 'TOPIK Preparation uses this platform\u2019s own lessons to build relevant skills. It is not an official TOPIK exam simulator and is not affiliated with the TOPIK test administrators.';
    container.appendChild(note);
  }

  const filtered = topikFilter === 'all' ? LESSONS : LESSONS.filter(l => TOPIK_MAP[l.id] === topikFilter);

  if (topikFilter === 'II' && !levelAtLeast('Intermediate')) {
    container.innerHTML = gatedNotice('TOPIK II Preparation', 'Intermediate');
    renderContinueLearning();
    return;
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="review-empty">No lessons tagged for this TOPIK path yet.</div>';
    renderContinueLearning();
    return;
  }

  const categories = [];
  filtered.forEach(l => { if (categories.indexOf(l.category) === -1) categories.push(l.category); });

  categories.forEach(cat => {
    const catEl = document.createElement('div');
    catEl.className = 'lesson-category';
    const listEl = document.createElement('div');
    listEl.className = 'lesson-list';

    filtered.filter(l => l.category === cat).forEach(lesson => {
      const status = getLessonStatus(lesson);
      const card = document.createElement('button');
      const masteryScore = status === 'completed' ? Math.min(1, 0.6 + (appState.progress.builderTotal ? 0.4 * (appState.progress.builderCorrect / appState.progress.builderTotal) : 0)) : (status === 'current' ? 0.15 : 0);
      const mLabel = masteryLabel(masteryScore);
      card.className = 'lesson-card ' + (status === 'completed' ? 'completed' : status === 'current' ? 'current' : '');
      card.innerHTML =
        '<div class="lesson-card-num">' + String(lesson.id).padStart(2, '0') + '</div>' +
        '<div class="lesson-card-body">' +
          '<div class="lesson-card-title">' + lesson.title + '</div>' +
          '<div class="lesson-card-desc">' + lesson.desc + '</div>' +
        '</div>' +
        '<div class="lesson-card-meta">' +
          '<span class="lesson-card-diff">' + lesson.difficulty + '</span>' +
          '<span class="lesson-card-status">' + (status === 'completed' ? 'Completed' : status === 'current' ? 'Current' : 'Not Started') + '</span>' +
          (TOPIK_MAP[lesson.id] ? '<span class="lesson-card-topik">TOPIK ' + TOPIK_MAP[lesson.id] + '</span>' : '') +
          (status === 'completed' ? '<span class="lesson-card-mastery mastery-' + mLabel.toLowerCase().replace(' ', '-') + '">' + mLabel + '</span>' : '') +
        '</div>';
      card.addEventListener('click', () => openLesson(lesson.id));
      listEl.appendChild(card);
    });

    catEl.innerHTML = '<div class="lesson-category-title">' + cat + '</div>';
    catEl.appendChild(listEl);
    container.appendChild(catEl);
  });

  renderContinueLearning();
}

function openLesson(id) {
  const lesson = LESSONS.find(l => l.id === id);
  if (!lesson) return;
  currentLessonId = id;

  const curriculum = document.getElementById('lessonCurriculum');
  const contEl = document.getElementById('lessonContinue');
  const view = document.getElementById('lessonView');
  const inner = document.getElementById('lessonViewInner');
  if (!view || !inner) return;
  if (curriculum) curriculum.style.display = 'none';
  if (contEl) contEl.style.display = 'none';
  view.classList.add('active');

  let exHTML = '';
  lesson.examples.forEach(ex => {
    exHTML +=
      '<div class="lesson-example-row">' +
        '<span class="lesson-example-kr">' + ex.kr + '</span>' +
        '<span class="lesson-rom rom-text">' + ex.rom + '</span>' +
        '<span class="lesson-example-en">' + ex.en + '</span>' +
        '<button class="listen-btn" data-speak="' + ex.kr + '" aria-label="Listen"><span class="listen-icon">▸</span> Listen</button>' +
      '</div>';
  });

  const isCompleted = appState.progress.completedLessons.indexOf(lesson.id) !== -1;

  inner.innerHTML =
    '<div class="lesson-view-eyebrow">' + lesson.category + ' · Lesson ' + String(lesson.id).padStart(2, '0') + '</div>' +
    '<div class="lesson-view-title">' + lesson.title + '</div>' +
    '<div class="lesson-block">' +
      '<div class="lesson-block-label">Introduction</div>' +
      '<div class="lesson-explanation">' + lesson.intro + '</div>' +
    '</div>' +
    '<div class="lesson-block">' +
      '<div class="lesson-block-label">Examples</div>' +
      exHTML +
    '</div>' +
    '<div class="lesson-block">' +
      '<div class="lesson-block-label">Explanation</div>' +
      '<div class="lesson-explanation">' + lesson.explanation + '</div>' +
    '</div>' +
    '<div class="lesson-block">' +
      '<div class="lesson-block-label">Practice</div>' +
      '<div class="lesson-practice-prompt">' + lesson.practicePrompt + '</div>' +
      '<div class="quiz-options" id="lessonPracticeOptions"></div>' +
      '<div class="quiz-feedback" id="lessonPracticeFeedback"></div>' +
    '</div>' +
    '<div class="lesson-nav-actions">' +
      '<button class="lesson-complete-btn" id="lessonCompleteBtn"' + (isCompleted ? ' disabled' : '') + '>' +
        (isCompleted ? 'Lesson Completed' : 'Complete Lesson') +
      '</button>' +
    '</div>';

  bindListenButtons(inner);

  const optWrap = document.getElementById('lessonPracticeOptions');
  let answered = false;
  if (optWrap) {
    shuffleArray(lesson.practiceOptions).forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', function() {
        if (answered) return;
        answered = true;
        const fb = document.getElementById('lessonPracticeFeedback');
        optWrap.querySelectorAll('.quiz-option').forEach(b => {
          b.classList.add('disabled');
          if (b.textContent === lesson.practiceAnswer) b.classList.add('correct');
        });
        if (opt === lesson.practiceAnswer) {
          btn.classList.add('correct');
          if (fb) { fb.textContent = 'Correct.'; fb.className = 'quiz-feedback correct'; }
        } else {
          btn.classList.add('incorrect');
          if (fb) { fb.textContent = 'Not quite. The answer is: ' + lesson.practiceAnswer; fb.className = 'quiz-feedback incorrect'; }
          recordQuizMistake('lesson', lesson.practicePrompt, 'Lesson ' + lesson.id + ' — ' + lesson.title);
        }
      });
      optWrap.appendChild(btn);
    });
  }

  const completeBtn = document.getElementById('lessonCompleteBtn');
  if (completeBtn) {
    completeBtn.addEventListener('click', function() {
      if (appState.progress.completedLessons.indexOf(lesson.id) === -1) {
        appState.progress.completedLessons.push(lesson.id);
        saveState();
      }
      completeBtn.textContent = 'Lesson Completed';
      completeBtn.disabled = true;
      updateSidebarLevel();
      if (typeof renderSkillMastery === 'function') renderSkillMastery();
      if (typeof renderOverviewProgress === 'function') renderOverviewProgress();
      if (typeof renderLessonList === 'function') renderLessonList();
    });
  }

  const main = document.getElementById('main');
  if (main) main.scrollTop = 0;
  window.scrollTo(0, 0);
}

function closeLessonView() {
  const curriculum = document.getElementById('lessonCurriculum');
  const contEl = document.getElementById('lessonContinue');
  const view = document.getElementById('lessonView');
  if (view) view.classList.remove('active');
  if (curriculum) curriculum.style.display = '';
  if (contEl) contEl.style.display = '';
  renderLessonList();
}

function initLessonNav() {
  const backBtn = document.getElementById('lessonBack');
  if (backBtn) backBtn.addEventListener('click', closeLessonView);
}

function renderContinueLearning() {
  const target = document.getElementById('lessonContinue');
  const overviewTarget = document.getElementById('overviewContinue');
  const firstIncomplete = LESSONS.find(l => appState.progress.completedLessons.indexOf(l.id) === -1);
  const html = firstIncomplete
    ? '<div class="continue-card">' +
        '<div class="continue-card-info">' +
          '<div class="continue-card-eyebrow">Continue Learning</div>' +
          '<div class="continue-card-title">Lesson ' + String(firstIncomplete.id).padStart(2, '0') + ' — ' + firstIncomplete.title + '</div>' +
          '<div class="continue-card-status">' + (appState.progress.completedLessons.length ? 'In Progress' : 'Start Learning') + '</div>' +
        '</div>' +
        '<button class="continue-card-btn" id="continueLearningBtn">' + (appState.progress.completedLessons.length ? 'Continue' : 'Start Learning') + '</button>' +
      '</div>'
    : '<div class="continue-card"><div class="continue-card-info"><div class="continue-card-eyebrow">Guided Curriculum</div><div class="continue-card-title">All lessons completed</div><div class="continue-card-status">Great work — revisit any lesson anytime.</div></div></div>';

  if (target) {
    target.innerHTML = html;
    const btn = target.querySelector('#continueLearningBtn');
    if (btn && firstIncomplete) btn.addEventListener('click', () => openLesson(firstIncomplete.id));
  }
  if (overviewTarget) {
    overviewTarget.innerHTML = html;
    const btn2 = overviewTarget.querySelector('#continueLearningBtn');
    if (btn2 && firstIncomplete) btn2.addEventListener('click', () => { navigateTo('lessons'); openLesson(firstIncomplete.id); });
  }
}

function updateSidebarLevel() {
  const el = document.querySelector('.sidebar-level');
  if (!el) return;
  const done = appState.progress.completedLessons.length;
  const levelNum = Math.max(1, Math.floor(done / 4) + 1);
  el.textContent = getLearnerLevel() + ' \u00b7 Level ' + levelNum;
  renderContinueLearning();
  if (typeof applyRomanizationLevelHint === 'function') applyRomanizationLevelHint();
}


/* ============================================================
   REVIEW SYSTEM
   ============================================================ */

/* ============================================================
   SKILL MASTERY — extends the existing progress system, not a
   replacement. Computed from real activity already in appState.
   ============================================================ */

/* ---- Learner level gating — used to recommend/gate advanced content ---- */
const LEVEL_ORDER = ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Highly Proficient', 'Immersion'];

function getLearnerLevel() {
  const done = appState.progress.completedLessons;
  let highest = 'Beginner';
  LESSONS.forEach(l => {
    if (done.indexOf(l.id) !== -1) {
      const lvl = l.level || 'Beginner';
      if (LEVEL_ORDER.indexOf(lvl) > LEVEL_ORDER.indexOf(highest)) highest = lvl;
    }
  });
  return highest;
}

function levelAtLeast(target) {
  return LEVEL_ORDER.indexOf(getLearnerLevel()) >= LEVEL_ORDER.indexOf(target);
}

function gatedNotice(label, requiredLevel) {
  return '<div class="gated-notice">' + label + ' unlocks at <strong>' + requiredLevel + '</strong> level. Complete more lessons in Guided Curriculum to reach it — your current level is <strong>' + getLearnerLevel() + '</strong>.</div>';
}

function masteryLabel(score) {
  if (score <= 0) return 'Not Started';
  if (score < 0.25) return 'Learning';
  if (score < 0.5) return 'Practicing';
  if (score < 0.8) return 'Developing';
  return 'Mastered';
}

function computeSkillMastery() {
  const exp = appState.exposure;
  const lessonsDone = appState.progress.completedLessons.length;
  const totalLessons = LESSONS.length;
  const recentMistakeTypes = {};
  appState.mistakes.forEach(m => { recentMistakeTypes[m.type] = (recentMistakeTypes[m.type] || 0) + 1; });
  const builderAcc = appState.progress.builderTotal > 0 ? appState.progress.builderCorrect / appState.progress.builderTotal : 0;

  const hangulScore = Math.min(1, exp.hangul.length / 30);
  const vocabScore = Math.min(1, exp.vocab.length / Object.values(VOCAB).flat().length);
  const grammarScore = Math.min(1, (0.5 * Math.min(1, exp.grammar.length / GRAMMAR_LESSONS.length)) + (0.5 * Math.min(1, lessonsDone / totalLessons)));
  const sentenceScore = Math.min(1, (0.6 * builderAcc) + (0.4 * Math.min(1, exp.sentences.length / 20)));
  const listeningScore = Math.min(1, Math.max(0, exp.vocab.length / Object.values(VOCAB).flat().length - (recentMistakeTypes.listening || 0) * 0.05));
  const writingScore = Math.min(1, exp.sentences.length / 25);

  return [
    { name: 'Hangul', score: hangulScore },
    { name: 'Vocabulary', score: vocabScore },
    { name: 'Grammar', score: grammarScore },
    { name: 'Sentence Construction', score: sentenceScore },
    { name: 'Listening', score: listeningScore },
    { name: 'Writing', score: writingScore },
  ];
}

/* Overview progress bars (Hangul/Vocabulary/Grammar/Sentence Construction)
   read from the exact same computeSkillMastery() scores used by Skill
   Mastery below — one source of truth, no separate metric. */
function renderOverviewProgress() {
  const scores = computeSkillMastery();
  const map = { 'Hangul': 'hangul', 'Vocabulary': 'vocabulary', 'Grammar': 'grammar', 'Sentence Construction': 'sentence' };
  scores.forEach(skill => {
    const key = map[skill.name];
    if (!key) return;
    const fill = document.getElementById('overviewProgressFill-' + key);
    const value = document.getElementById('overviewProgressValue-' + key);
    const pct = Math.round(skill.score * 100);
    if (fill) fill.style.width = pct + '%';
    if (value) value.textContent = pct + '%';
  });
}

function renderSkillMastery() {
  const overview = document.getElementById('section-overview');
  if (!overview) return;
  let wrap = document.getElementById('skillMasteryWrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'skill-mastery';
    wrap.id = 'skillMasteryWrap';
    wrap.innerHTML = '<h2 class="subsection-title">Skill Mastery</h2><div class="mastery-grid" id="masteryGrid"></div>';
    overview.appendChild(wrap);
  }
  const grid = document.getElementById('masteryGrid');
  grid.innerHTML = '';
  computeSkillMastery().forEach(skill => {
    const label = masteryLabel(skill.score);
    const el = document.createElement('div');
    el.className = 'mastery-card mastery-' + label.toLowerCase().replace(' ', '-');
    el.innerHTML =
      '<div class="mastery-skill">' + skill.name + '</div>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + Math.round(skill.score * 100) + '%"></div></div>' +
      '<div class="mastery-label">' + label + '</div>';
    grid.appendChild(el);
  });
}

function renderReview() {
  const summary = document.getElementById('reviewSummary');
  const mistakesEl = document.getElementById('reviewMistakes');
  const sessionEl = document.getElementById('reviewSession');
  if (!summary) return;

  const exp = appState.exposure;
  summary.innerHTML =
    '<div class="review-summary-card"><div class="review-summary-num">' + exp.vocab.length + '</div><div class="review-summary-label">Vocabulary</div></div>' +
    '<div class="review-summary-card"><div class="review-summary-num">' + exp.hangul.length + '</div><div class="review-summary-label">Hangul Characters</div></div>' +
    '<div class="review-summary-card"><div class="review-summary-num">' + exp.grammar.length + '</div><div class="review-summary-label">Grammar Concepts</div></div>' +
    '<div class="review-summary-card"><div class="review-summary-num">' + exp.sentences.length + '</div><div class="review-summary-label">Sentences</div></div>';

  if (mistakesEl) {
    let mHTML = '<div class="review-mistakes-title">Mistakes to Revisit</div>';
    if (appState.mistakes.length === 0) {
      mHTML += '<div class="review-empty">No recorded mistakes yet — they will appear here as you practice.</div>';
    } else {
      appState.mistakes.slice(0, 10).forEach(m => {
        mHTML += '<div class="review-mistake-item"><span class="review-mistake-kr">' + m.kr + '</span><span class="review-mistake-note">' + m.note + '</span></div>';
      });
    }
    mistakesEl.innerHTML = mHTML;
  }

  if (sessionEl) {
    // Don't wipe an in-progress review question when renderReview() is
    // re-triggered by other state changes elsewhere in the app — only
    // (re)build the start/empty state when no question is on screen.
    const activeArea = document.getElementById('reviewQuestionArea');
    const sessionActive = activeArea && activeArea.children.length > 0;
    if (!sessionActive) {
      const totalExposed = exp.vocab.length + exp.hangul.length + exp.grammar.length + exp.sentences.length;
      sessionEl.innerHTML = totalExposed > 0
        ? '<button class="review-session-start" id="reviewStartBtn">Start Review Session</button><div class="review-question-area" id="reviewQuestionArea"></div>'
        : '<div class="review-empty">Visit Hangul, Vocabulary, and Grammar to build up material for review.</div>';
      const startBtn = document.getElementById('reviewStartBtn');
      if (startBtn) startBtn.addEventListener('click', () => { reviewQIdx = 0; renderReviewQuestion(); });
    }
  }
}

let reviewQIdx = 0;

function buildReviewPool() {
  const pool = [];
  appState.exposure.vocab.forEach(kr => {
    for (const cat in VOCAB) {
      const item = VOCAB[cat].find(v => v.kr === kr);
      if (item) { pool.push({ type: 'vocab', kr: item.kr, correct: item.en, options: [item.en] }); break; }
    }
  });
  appState.exposure.hangul.forEach(ch => {
    const item = CONSONANTS.find(c => c.char === ch) || VOWELS.find(v => v.char === ch);
    if (item) pool.push({ type: 'hangul', kr: item.char, correct: item.rom, options: [item.rom] });
  });

  // Adaptive weighting: items the learner has recently gotten wrong are
  // duplicated into the pool so they surface more often, without a second
  // review system — this just reorders/reweights the existing pool.
  const missCounts = {};
  appState.mistakes.forEach(m => { missCounts[m.kr] = (missCounts[m.kr] || 0) + 1; });
  const weighted = [];
  pool.forEach(item => {
    const extra = Math.min(3, missCounts[item.kr] || 0);
    for (let i = 0; i < 1 + extra; i++) weighted.push(item);
  });
  return shuffleArray(weighted.length ? weighted : pool);
}

function renderReviewQuestion() {
  const area = document.getElementById('reviewQuestionArea');
  if (!area) return;
  const pool = buildReviewPool();
  if (pool.length === 0) { area.innerHTML = '<div class="review-empty">Nothing left to review right now.</div>'; return; }
  const item = pool[reviewQIdx % pool.length];

  const distractorPool = item.type === 'vocab'
    ? Object.values(VOCAB).flat().map(v => v.en)
    : CONSONANTS.concat(VOWELS).map(c => c.rom);
  const options = [item.correct];
  while (options.length < 4) {
    const cand = distractorPool[Math.floor(Math.random() * distractorPool.length)];
    if (options.indexOf(cand) === -1) options.push(cand);
  }

  const card = document.createElement('div');
  card.className = 'quiz-card';
  let optHTML = '';
  shuffleArray(options).forEach(opt => { optHTML += '<button class="quiz-option" data-opt="' + opt + '">' + opt + '</button>'; });
  card.innerHTML =
    '<div class="quiz-question-label">' + (item.type === 'vocab' ? 'What does this word mean?' : 'What sound does this represent?') + '</div>' +
    '<div class="quiz-char" style="font-size:52px">' + item.kr + '</div>' +
    '<div class="quiz-options">' + optHTML + '</div>' +
    '<div class="quiz-feedback" id="reviewQFeedback"></div>' +
    '<button class="quiz-next" id="reviewQNext">Next</button>';
  area.innerHTML = '';
  area.appendChild(card);

  card.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function() {
      card.querySelectorAll('.quiz-option').forEach(b => { b.classList.add('disabled'); if (b.dataset.opt === item.correct) b.classList.add('correct'); });
      const fb = card.querySelector('#reviewQFeedback');
      const next = card.querySelector('#reviewQNext');
      if (this.dataset.opt === item.correct) {
        this.classList.add('correct');
        if (fb) { fb.textContent = 'Correct.'; fb.className = 'quiz-feedback correct'; }
      } else {
        this.classList.add('incorrect');
        if (fb) { fb.textContent = 'Incorrect. The answer is: ' + item.correct; fb.className = 'quiz-feedback incorrect'; }
        recordQuizMistake(item.type, item.kr, 'Missed in Review');
      }
      if (next) next.classList.add('visible');
    });
  });
  const nextBtn = card.querySelector('#reviewQNext');
  if (nextBtn) nextBtn.addEventListener('click', () => { reviewQIdx++; renderReviewQuestion(); });
}


/* ============================================================
   ADDITIONAL PRACTICE MODES
   ============================================================ */

/* Listening difficulty progression — same Listening tab, gated by learner level */
const LISTENING_LEVELS = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Immersion'];

function listeningLevelForLearner() {
  const lvl = getLearnerLevel();
  if (lvl === 'Beginner') return 'Beginner';
  if (lvl === 'Elementary') return 'Elementary';
  if (lvl === 'Intermediate' || lvl === 'Upper Intermediate') return 'Intermediate';
  if (lvl === 'Advanced') return 'Advanced';
  return 'Immersion';
}

function renderListeningQuiz(area) {
  const items = VOCAB_QUIZ;
  const item = items[practiceIdx % items.length];
  const shuffled = shuffleArray(item.options);
  const listeningLevel = listeningLevelForLearner();
  const rate = listeningLevel === 'Beginner' ? 0.75 : listeningLevel === 'Elementary' ? 0.9 : 1;
  const transcriptMode = listeningLevel === 'Beginner' || listeningLevel === 'Elementary' ? 'shown'
    : listeningLevel === 'Intermediate' ? 'optional'
    : listeningLevel === 'Advanced' ? 'delayed'
    : 'hidden';

  const card = document.createElement('div');
  card.className = 'quiz-card';
  let optHTML = '';
  shuffled.forEach(opt => { optHTML += '<button class="quiz-option" data-opt="' + opt + '">' + opt + '</button>'; });

  let transcriptHTML = '';
  if (transcriptMode === 'shown') {
    transcriptHTML = '<div class="listening-transcript">' + item.kr + '</div>';
  } else if (transcriptMode === 'optional') {
    transcriptHTML = '<button class="listening-transcript-toggle" id="transcriptToggle">Show transcript</button><div class="listening-transcript" id="transcriptText" style="display:none">' + item.kr + '</div>';
  } else if (transcriptMode === 'delayed') {
    transcriptHTML = '<div class="listening-transcript-note">Transcript unlocks after you answer.</div><div class="listening-transcript" id="transcriptText" style="display:none">' + item.kr + '</div>';
  } else {
    transcriptHTML = '<div class="listening-transcript-note">Immersion level — Korean only, no transcript.</div>';
  }

  card.innerHTML =
    '<div class="conversation-meta"><span class="conversation-level">' + listeningLevel + (transcriptMode === 'hidden' ? ' \u00b7 Immersion' : '') + '</span></div>' +
    '<div class="quiz-question-label">Listen, then choose what it means</div>' +
    '<button class="listen-btn" data-speak="' + item.kr + '" data-rate="' + rate + '" style="margin-bottom:16px"><span class="listen-icon">▸</span> Listen</button>' +
    transcriptHTML +
    '<div class="quiz-options">' + optHTML + '</div>' +
    '<div class="quiz-feedback" id="quizFeedback"></div>' +
    '<button class="quiz-next" id="quizNext">Next</button>';
  area.appendChild(card);
  bindListenButtons(card);

  const toggleBtn = card.querySelector('#transcriptToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      const t = card.querySelector('#transcriptText');
      t.style.display = t.style.display === 'none' ? 'block' : 'none';
    });
  }

  card.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function() {
      card.querySelectorAll('.quiz-option').forEach(b => { b.classList.add('disabled'); if (b.dataset.opt === item.correct) b.classList.add('correct'); });
      const fb = card.querySelector('#quizFeedback');
      const next = card.querySelector('#quizNext');
      if (transcriptMode === 'delayed') {
        const t = card.querySelector('#transcriptText');
        if (t) t.style.display = 'block';
      }
      if (this.dataset.opt === item.correct) {
        this.classList.add('correct');
        if (fb) { fb.textContent = 'Correct. (' + item.kr + ')'; fb.className = 'quiz-feedback correct'; }
      } else {
        this.classList.add('incorrect');
        if (fb) { fb.textContent = 'Incorrect. It was ' + item.kr + ' — ' + item.correct; fb.className = 'quiz-feedback incorrect'; }
        recordQuizMistake('listening', item.kr, 'Missed in Listening practice');
      }
      if (next) next.classList.add('visible');
    });
  });
  const nextBtn = card.querySelector('#quizNext');
  if (nextBtn) nextBtn.addEventListener('click', () => { practiceIdx++; loadPractice(); });
}

const TRANSLATION_ITEMS = [
  { kr:'안녕하세요.', correct:'Hello. (formal greeting)', options:['Hello. (formal greeting)','Thank you.','I am a student.'] },
  { kr:'감사합니다.', correct:'Thank you.', options:['Thank you.','Goodbye.','I go to school.'] },
  { kr:'저는 학생이에요.', correct:'I am a student.', options:['I am a student.','I go to school.','I eat rice.'] },
  { kr:'한국어를 공부해요.', correct:'I study Korean.', options:['I study Korean.','I read a book.','I am at home.'] },
];

function renderTranslationQuiz(area) {
  const item = TRANSLATION_ITEMS[practiceIdx % TRANSLATION_ITEMS.length];
  const shuffled = shuffleArray(item.options);
  const card = document.createElement('div');
  card.className = 'quiz-card';
  let optHTML = '';
  shuffled.forEach(opt => { optHTML += '<button class="quiz-option" data-opt="' + opt + '">' + opt + '</button>'; });
  card.innerHTML =
    '<div class="quiz-question-label">What does this sentence mean?</div>' +
    '<div class="grammar-sentence" style="margin-bottom:20px">' + item.kr + ' <button class="listen-btn" data-speak="' + item.kr + '"><span class="listen-icon">▸</span> Listen</button></div>' +
    '<div class="quiz-options">' + optHTML + '</div>' +
    '<div class="quiz-feedback" id="quizFeedback"></div>' +
    '<button class="quiz-next" id="quizNext">Next</button>';
  area.appendChild(card);
  bindListenButtons(card);
  card.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function() {
      card.querySelectorAll('.quiz-option').forEach(b => { b.classList.add('disabled'); if (b.dataset.opt === item.correct) b.classList.add('correct'); });
      const fb = card.querySelector('#quizFeedback');
      const next = card.querySelector('#quizNext');
      if (this.dataset.opt === item.correct) {
        this.classList.add('correct');
        if (fb) { fb.textContent = 'Correct.'; fb.className = 'quiz-feedback correct'; }
      } else {
        this.classList.add('incorrect');
        if (fb) { fb.textContent = 'Incorrect. The answer is: ' + item.correct; fb.className = 'quiz-feedback incorrect'; }
        recordQuizMistake('sentence', item.kr, 'Missed in Translation practice');
      }
      if (next) next.classList.add('visible');
    });
  });
  const nextBtn = card.querySelector('#quizNext');
  if (nextBtn) nextBtn.addEventListener('click', () => { practiceIdx++; loadPractice(); });
}

function renderFreeWritingQuiz(area) {
  const ex = BUILDER_EXERCISES[practiceIdx % BUILDER_EXERCISES.length];
  const expected = ex.answer.join('');
  const card = document.createElement('div');
  card.className = 'quiz-card';
  card.innerHTML =
    '<div class="quiz-question-label">Write in Korean</div>' +
    '<div style="font-size:16px; color:var(--text-muted); margin-bottom:16px;">' + ex.prompt + '</div>' +
    '<textarea class="free-writing-input" id="pfwInput" rows="2" placeholder="한국어로 입력하세요…" aria-label="Free writing input"></textarea>' +
    '<div class="keyboard-toggle-row"><button class="keyboard-toggle" id="pfwKbToggle" type="button">Show Korean Keyboard</button></div>' +
    '<div class="korean-keyboard" id="pfwKeyboard" style="display:none"></div>' +
    '<div class="builder-feedback" id="pfwFeedback"></div>' +
    '<div class="builder-explanation" id="pfwExplanation"></div>' +
    '<div class="builder-actions"><button class="btn-check" id="pfwCheck">Check</button><button class="btn-next" id="pfwNext" style="display:none">Next Exercise</button></div>';
  area.appendChild(card);

  const input = card.querySelector('#pfwInput');
  const kbToggle = card.querySelector('#pfwKbToggle');
  const kbContainer = card.querySelector('#pfwKeyboard');
  if (kbToggle) {
    kbToggle.addEventListener('click', function() {
      const visible = kbContainer.style.display !== 'none';
      kbContainer.style.display = visible ? 'none' : 'block';
      kbToggle.textContent = visible ? 'Show Korean Keyboard' : 'Hide Korean Keyboard';
      if (!visible && !kbContainer.dataset.built) { renderKoreanKeyboard(kbContainer, input); kbContainer.dataset.built = '1'; }
    });
  }
  const checkBtn = card.querySelector('#pfwCheck');
  const nextBtn = card.querySelector('#pfwNext');
  if (checkBtn) {
    checkBtn.addEventListener('click', function() {
      const fb = card.querySelector('#pfwFeedback');
      const expEl = card.querySelector('#pfwExplanation');
      const userVal = input ? input.value : '';
      if (!userVal.trim()) { if (fb) { fb.textContent = 'Type your answer in Korean.'; fb.className = 'builder-feedback'; } return; }
      const isCorrect = normalizeKorean(userVal) === normalizeKorean(expected);
      if (isCorrect) {
        if (fb) { fb.textContent = 'Correct. ' + expected; fb.className = 'builder-feedback correct'; }
        if (expEl) expEl.textContent = '';
        if (nextBtn) nextBtn.style.display = 'inline-block';
      } else {
        if (fb) { fb.textContent = 'Not quite.'; fb.className = 'builder-feedback incorrect'; }
        if (expEl) expEl.textContent = 'Your answer: ' + userVal + '  ·  Correct answer: ' + expected;
        recordQuizMistake('sentence', expected, 'Missed in Free Writing practice');
      }
    });
  }
  if (nextBtn) nextBtn.addEventListener('click', () => { practiceIdx++; loadPractice(); });
}


/* ============================================================
   SEARCH
   ============================================================ */

function buildSearchIndex() {
  const idx = [];
  Object.keys(VOCAB).forEach(cat => {
    VOCAB[cat].forEach(item => idx.push({ kr: item.kr, meta: item.en, type: 'Vocabulary', goto: 'vocabulary' }));
  });
  GRAMMAR_LESSONS.forEach(l => idx.push({ kr: l.sentence, meta: l.title, type: 'Grammar', goto: 'grammar' }));
  CONSONANTS.forEach(c => idx.push({ kr: c.char, meta: c.name + ' — ' + c.rom, type: 'Hangul', goto: 'hangul' }));
  VOWELS.forEach(v => idx.push({ kr: v.char, meta: v.name + ' — ' + v.rom, type: 'Hangul', goto: 'hangul' }));
  return idx;
}

function initSearch() {
  const input = document.getElementById('globalSearch');
  const results = document.getElementById('globalSearchResults');
  if (!input || !results) return;
  const index = buildSearchIndex();

  input.addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    if (!q) { results.classList.remove('visible'); results.innerHTML = ''; return; }
    const matches = index.filter(item =>
      item.kr.toLowerCase().indexOf(q) !== -1 || item.meta.toLowerCase().indexOf(q) !== -1
    ).slice(0, 8);
    results.innerHTML = matches.length
      ? matches.map(m => '<button class="search-result-item" data-goto="' + m.goto + '"><div class="search-result-kr">' + m.kr + '</div><div class="search-result-meta">' + m.type + ' · ' + m.meta + '</div></button>').join('')
      : '<div class="search-result-empty">No matches found.</div>';
    results.classList.add('visible');
    results.querySelectorAll('.search-result-item').forEach(btn => {
      btn.addEventListener('click', function() {
        navigateTo(this.dataset.goto);
        results.classList.remove('visible');
        input.value = '';
      });
    });
  });

  document.addEventListener('click', function(e) {
    if (!results.contains(e.target) && e.target !== input) results.classList.remove('visible');
  });
}


/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initMobileSidebar();

  // Hangul section
  renderConsonantGrid();
  renderVowelGrid();
  renderSyllableExamples();
  renderBatchimGrid();
  initHangulTabs();
  renderConstructor();

  // Vocabulary
  renderVocab('greetings');
  initVocabTabs();

  // Grammar
  renderGrammar();

  // Sentence Builder
  initBuilder();

  // Practice
  initPracticeTabs();
  loadPractice();

  // New: lessons, review, romanization, search, audio, streak
  initRomToggle();
  initSpeech();
  enhanceReadingAudio();
  renderLessonList();
  initTopikFilter();
  initLessonNav();
  renderReview();
  initSearch();
  updateStreak();
  updateSidebarLevel();
  renderSkillMastery();
  renderOverviewProgress();
});