// ข้อมูลของแต่ละ "บ้าน" ที่เป็นผลลัพธ์ของแบบทดสอบ
const HOUSES = {
  tonthara: {
    key: 'tonthara',
    name: 'บ้านต้นธารา',
    theme: 'green',
    tagline: 'บ้านของคนที่กำลังค้นหาตัวเอง',
    description:
      'เป็นบ้านของคนที่กำลังค้นหาตัวเอง ค้นหาสิ่งที่ชอบและค้นหาความฝัน เป็นคนที่ชอบทำอะไรใหม่ๆ ลองทำหลายๆ อย่างเพื่อค้นหาตัวเอง แต่ยังไม่มีเป้าหมายที่ชัดเจน ไม่ต้องรีบร้อนหรือกดดันตัวเองนะ'
  },
  daonamtang: {
    key: 'daonamtang',
    name: 'บ้านดาวนำทาง',
    theme: 'yellow',
    tagline: 'บ้านของคนที่เริ่มเห็นเส้นทางของตัวเอง',
    description:
      'บ้านของคนที่เริ่มมีสิ่งที่สนใจ เริ่มเห็นภาพอนาคตของตัวเอง แต่ยังไม่รู้ว่าจะไปทางใด เพราะมีความสนใจมากกว่าหนึ่งสิ่ง รู้สึกว่ามีหลายทางให้เลือก แต่กังวลว่าถ้าเลือกทางนี้จะเหมาะกับตัวเองไหม ใช้เวลาคิดและทำความเข้าใจตัวเองนะ'
  },
  raekarun: {
    key: 'raekarun',
    name: 'บ้านแรกอรุณ',
    theme: 'blue',
    tagline: 'บ้านของคนที่มีเป้าหมายชัดเจน',
    description:
      'บ้านของคนที่มีเป้าหมายที่ชัดเจน และกำลังทำตามความฝัน มีสิ่งที่สนใจเป็นพิเศษ มุ่งมั่นที่จะทำตามเป้าหมาย เป็นคนที่พร้อมเรียนรู้และอยากพัฒนาตัวเอง เพียงแค่ขาดโอกาสหรือขาดคนสนับสนุน รวมทั้งขาดการลงมือทำ พัฒนาตัวเองไปเรื่อยๆ นะ ต้องได้ทำตามความฝันแน่นอน'
  }
};

// คำถามและตัวเลือกแบบปรนัยทั้ง 5 ข้อ แต่ละตัวเลือกจะโหวตให้ "บ้าน" หนึ่งหลัง
const QUESTIONS = [
  {
    id: 'q1',
    text: 'เวลามีคนถามว่าในอนาคตอยากทำอะไร ข้อไหนตรงกับเธอที่สุดหรอ?',
    options: [
      { value: 'a', label: 'มีสิ่งที่ชอบแล้วนะ แล้วก็ตั้งใจจะทำให้ได้ด้วย', house: 'raekarun' },
      { value: 'b', label: 'ก็พอมีสิ่งที่สนใจอยู่บ้าง แต่ก็ยังสับสน', house: 'daonamtang' },
      { value: 'c', label: 'ยังไม่รู้เลยว่าอยากทำอะไร อยากค้นหาตัวเองไปเรื่อยๆ', house: 'tonthara' }
    ]
  },
  {
    id: 'q2',
    text: 'ถ้ามีโอกาสได้ลองทำอะไรบางอย่าง จะเลือกทำอะไรหรอ',
    options: [
      { value: 'a', label: 'ลองทำหลายๆ อย่าง เผื่อจะเจอสิ่งที่ชอบ', house: 'tonthara' },
      { value: 'b', label: 'ลองทำสิ่งที่สนใจ จะได้รู้ว่าชอบจริงไหม', house: 'daonamtang' },
      { value: 'c', label: 'ทำสิ่งที่ตัวเองชอบและพัฒนาให้เก่งขึ้น', house: 'raekarun' }
    ]
  },
  {
    id: 'q3',
    text: 'กดดันไหมตอนคนถามว่าโตไปอยากทำอะไร',
    options: [
      { value: 'a', label: 'กดดันนิดหน่อย แต่ก็ตอบได้นะ', house: 'raekarun' },
      { value: 'b', label: 'กดดันสิ ยังไม่แน่ใจเลยว่าจะทำอะไร', house: 'daonamtang' },
      { value: 'c', label: 'กดดันมากเลยแหละ ก็ยังไม่รู้สิ่งที่ตัวเองชอบนี่นา', house: 'tonthara' }
    ]
  },
  {
    id: 'q4',
    text: 'ถ้ามีกิจกรรมให้ลองทำ เธออยากทำแบบไหนที่สุด',
    options: [
      { value: 'a', label: 'ได้ลองทำอะไรหลายๆ อย่างสิ ถึงจะสนุก', house: 'tonthara' },
      { value: 'b', label: 'ได้ลองทำในสิ่งที่เราสนใจดีที่สุดแล้ว', house: 'raekarun' },
      { value: 'c', label: 'ก็คงเป็นกิจกรรมที่ช่วยให้เข้าใจตัวเองมากขึ้น', house: 'daonamtang' }
    ]
  },
  {
    id: 'q5',
    text: 'เราให้พรกับเธอได้ 1 ข้อ เธอจะขอว่าอะไร',
    options: [
      { value: 'a', label: 'ขอให้ได้ทำตามความฝัน', house: 'raekarun' },
      { value: 'b', label: 'ขอให้ไม่สับสนในทางที่เลือก', house: 'daonamtang' },
      { value: 'c', label: 'ขอให้เข้าใจตัวเองมากขึ้น', house: 'tonthara' }
    ]
  }
];

// คำถามปลายเปิด (ไม่ใช้คำนวณผล แค่เก็บข้อมูลไว้อ่านประกอบ)
const OPEN_QUESTIONS = [
  { id: 'open1', text: 'ถ้ามีคนสนับสนุน เธออยากลองทำอะไรที่สุด' },
  { id: 'open2', text: 'ตอนนี้สนใจอะไรอยู่หรอ มีสิ่งที่ชอบเป็นพิเศษไหม' }
];

function calculateHouse(answers) {
  const score = { tonthara: 0, daonamtang: 0, raekarun: 0 };

  QUESTIONS.forEach(q => {
    const chosenValue = answers[q.id];
    const option = q.options.find(o => o.value === chosenValue);
    if (option) {
      score[option.house] += 1;
    }
  });

  let winner = 'tonthara';
  let best = -1;
  ['tonthara', 'daonamtang', 'raekarun'].forEach(key => {
    if (score[key] > best) {
      best = score[key];
      winner = key;
    }
  });

  return { houseKey: winner, house: HOUSES[winner], score };
}

module.exports = { HOUSES, QUESTIONS, OPEN_QUESTIONS, calculateHouse };
