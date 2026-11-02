// Change this to your FastAPI base URL (or set VITE_API_URL in frontend/.env)
export const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const photos = [
  { src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900', name: 'Taj Mahal', place: 'Agra, Uttar Pradesh' },
  { src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900', name: 'The Colours of Rajasthan', place: 'Rajasthan' },
  { src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900', name: 'Indian Architecture', place: 'India' },
  { src: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=900', name: 'Heritage and Tradition', place: 'India' },
  { src: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=900', name: 'Sacred Spaces', place: 'India' }
]

// [name, short code, column, row] — a tile map laid out roughly like India
export const STATES = [
  ['Ladakh', 'LA', 4, 0],
  ['Jammu & Kashmir', 'JK', 3, 1], ['Himachal Pradesh', 'HP', 4, 1],
  ['Punjab', 'PB', 3, 2], ['Haryana', 'HR', 4, 2], ['Uttarakhand', 'UK', 5, 2],
  ['Sikkim', 'SK', 7, 2], ['Arunachal Pradesh', 'AR', 9, 2],
  ['Rajasthan', 'RJ', 3, 3], ['Delhi', 'DL', 4, 3], ['Uttar Pradesh', 'UP', 5, 3],
  ['Bihar', 'BR', 6, 3], ['West Bengal', 'WB', 7, 3], ['Assam', 'AS', 8, 3], ['Nagaland', 'NL', 9, 3],
  ['Gujarat', 'GJ', 2, 4], ['Madhya Pradesh', 'MP', 4, 4], ['Chhattisgarh', 'CG', 5, 4],
  ['Jharkhand', 'JH', 6, 4], ['Meghalaya', 'ML', 8, 4], ['Manipur', 'MN', 9, 4],
  ['Maharashtra', 'MH', 3, 5], ['Telangana', 'TS', 4, 5], ['Andhra Pradesh', 'AP', 5, 5],
  ['Odisha', 'OD', 6, 5], ['Tripura', 'TR', 8, 5], ['Mizoram', 'MZ', 9, 5],
  ['Goa', 'GA', 3, 6], ['Karnataka', 'KA', 4, 6],
  ['Kerala', 'KL', 4, 7], ['Tamil Nadu', 'TN', 5, 7],
  ['Andaman & Nicobar', 'AN', 8, 7]
]

// Sample records. Replace with data from your backend once the AI-sorted archive is available.
export const SITES = [
  {
    id: 'taj-mahal', name: 'Taj Mahal', state: 'Uttar Pradesh', city: 'Agra',
    type: 'Monument', purpose: 'Memorial', img: 0,
    blurb: 'An ivory-white marble mausoleum on the banks of the Yamuna, commissioned by Shah Jahan in memory of Mumtaz Mahal. Completed around 1653.',
    architecture: 'Mughal architecture at its most refined. A central double dome rises over a square body with chamfered corners, flanked by four minarets set slightly outward. Pietra dura inlay, calligraphy panels and a symmetrical charbagh garden complete the design.'
  },
  {
    id: 'dashashwamedh', name: 'Dashashwamedh Ghat', state: 'Uttar Pradesh', city: 'Varanasi',
    type: 'Sacred space', purpose: 'Ghat and riverfront', img: 4,
    blurb: 'One of the best known ghats on the Ganga in Varanasi, where the evening aarti draws crowds every day.',
    architecture: 'Broad stone steps descend into the river, backed by temples, shrines and towering buildings. The ghats are designed as living spaces for bathing, ritual, music and gathering.'
  },
  {
    id: 'red-fort', name: 'Red Fort', state: 'Delhi', city: 'Delhi',
    type: 'Monument', purpose: 'Fortress and palace', img: 2,
    blurb: 'The Mughal fort-palace of Shahjahanabad, built between 1639 and 1648 and named for its red sandstone walls.',
    architecture: 'Massive red sandstone ramparts enclose halls, pavilions and gardens. Audience halls, marble inlay work and the Lahori Gate show the Mughal blend of Persian, Timurid and Indian styles.'
  },
  {
    id: 'qutub-minar', name: 'Qutub Minar', state: 'Delhi', city: 'Delhi',
    type: 'Archaeological site', purpose: 'Victory tower', img: 3,
    blurb: 'A soaring minaret in Mehrauli begun in the late 12th century, among the earliest monuments of the Delhi Sultanate.',
    architecture: 'A tapering fluted tower of red sandstone and marble, with projecting balconies and bands of Quranic inscription. The surrounding complex includes the Iron Pillar and early mosque remains.'
  },
  {
    id: 'lodhi-garden', name: 'Lodhi Garden', state: 'Delhi', city: 'Delhi',
    type: 'Park', purpose: 'Tombs in a garden', img: 2,
    blurb: 'A public park in Delhi that shelters 15th and 16th century tombs of the Sayyid and Lodhi dynasties.',
    architecture: 'Domed octagonal and square tombs sit within landscaped lawns. The setting shows how Indo-Islamic funerary architecture and garden design grew together.'
  },
  {
    id: 'amer-fort', name: 'Amer Fort', state: 'Rajasthan', city: 'Jaipur',
    type: 'Monument', purpose: 'Fortress and palace', img: 1,
    blurb: 'A hilltop fort-palace above Maota Lake, built largely in red sandstone and marble by the Kachwaha Rajputs.',
    architecture: 'Courtyards, gateways and palace halls step up the hillside. Rajput and Mughal elements meet in mirror work, carved screens and painted gateways.'
  },
  {
    id: 'hampi', name: 'Hampi', state: 'Karnataka', city: 'Hampi',
    type: 'Archaeological site', purpose: 'Capital city ruins', img: 3,
    blurb: 'The ruins of Vijayanagara, a great 14th to 16th century capital scattered among boulders along the Tungabhadra.',
    architecture: 'Granite temples, stepped tanks, market streets and pavilions in the Dravidian style, with carved pillars and monolithic shrines such as the stone chariot.'
  },
  {
    id: 'brihadisvara', name: 'Brihadisvara Temple', state: 'Tamil Nadu', city: 'Thanjavur',
    type: 'Sacred space', purpose: 'Temple', img: 4,
    blurb: 'A Chola temple dedicated to Shiva, completed in the early 11th century under Rajaraja I.',
    architecture: 'A tall pyramidal vimana rises over the sanctum in diminishing tiers, crowned by a monolithic capstone. Large sculpted nandi, gopurams and wall paintings add to the complex.'
  },
  {
    id: 'konark', name: 'Konark Sun Temple', state: 'Odisha', city: 'Konark',
    type: 'Archaeological site', purpose: 'Temple', img: 3,
    blurb: 'A 13th century temple conceived as the chariot of the sun god, with carved stone wheels on its base.',
    architecture: 'Kalinga architecture. The temple is shaped like a giant chariot with twelve pairs of wheels, horses at the front and richly carved walls.'
  },
  {
    id: 'ajanta', name: 'Ajanta Caves', state: 'Maharashtra', city: 'Aurangabad',
    type: 'Archaeological site', purpose: 'Rock-cut caves', img: 2,
    blurb: 'Rock-cut Buddhist caves in a horseshoe gorge, holding some of the finest early Indian mural painting.',
    architecture: 'Monasteries and prayer halls carved straight out of basalt cliff, with pillared interiors, sculpture and painted ceilings and walls.'
  }
]

export const MANUSCRIPTS = [
  {
    id: 'brahmi', title: 'Brahmi inscriptions', era: 'From about the 3rd century BCE', script: 'Brahmi',
    origin: 'Best known from the edicts of Emperor Ashoka, carved on rocks and pillars across the subcontinent.',
    reading: 'Written left to right. Each consonant carries an inherent "a" sound and vowel marks change it. Many later Indian scripts descend from Brahmi.'
  },
  {
    id: 'sharada', title: 'Sharada manuscripts', era: 'From about the 8th to 10th century CE', script: 'Sharada',
    origin: 'Associated with Kashmir, where texts were copied on birch bark.',
    reading: 'A script of the Brahmi family used for Sanskrit and Kashmiri texts. Birch bark leaves were written with reed pens and carbon ink.'
  },
  {
    id: 'grantha', title: 'Palm-leaf manuscripts', era: 'Many centuries, common in the south', script: 'Grantha and regional scripts',
    origin: 'Texts on temples, medicine, astronomy and literature were copied on dried palm leaf.',
    reading: 'Letters were incised with a stylus, then rubbed with soot or oil to make them visible. Leaves were strung together and stored in bundles.'
  }
]

export const STORIES = [
  {
    id: 'chand-baori', title: 'The stepwell that holds back the heat', place: 'Abhaneri, Rajasthan',
    text: 'Chand Baori is a stepwell with thousands of narrow steps descending in symmetrical flights across thirteen levels. Villagers once climbed down to cooler air and water, and the geometry of the steps turned a practical well into a work of art.'
  },
  {
    id: 'lothal', title: 'A port city before the written word was read', place: 'Lothal, Gujarat',
    text: 'Lothal was a Harappan settlement of the third millennium BCE. A large brick basin there is often interpreted as a dockyard, hinting at sea trade with distant lands. Its script remains undeciphered.'
  },
  {
    id: 'yogini', title: 'A circle of sixty-four', place: 'Mitaoli, Madhya Pradesh',
    text: 'The Chausath Yogini temple is a circular stone temple with open-air cells arranged around a central shrine. Few visitors know it, yet its round plan is unlike most temples people expect to see.'
  }
]

// Browser text-to-speech, so every description can be played as audio with no audio files.
export function speak(text, onEnd) {
  if (!('speechSynthesis' in window)) { onEnd && onEnd(); return }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-IN'
  u.rate = 0.95
  u.onend = () => onEnd && onEnd()
  u.onerror = () => onEnd && onEnd()
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}
