// Sample lecture + four sample turns (Hindi, Kannada, Hinglish).
// The real app would stream these over a WebSocket; here they are canned.
export const POOCHO_DATA = {
  video: { name: 'lecture-04-derivatives.mp4', duration: 1864, size: '129 MB', title: 'Calculus I · Lecture 04 — The Chain Rule' },
  turns: [
    { id: 1, lang: 'Hindi', q: 'Yeh derivative kaise nikala? Chain rule kahan lagaya?', a: 'Sir ne pehle outer function ko differentiate kiya, phir inner function se multiply kiya. Wahi chain rule hai — 2:14 par board par dono steps alag-alag likhe hain.', t: 134 },
    { id: 2, lang: 'Hindi', q: 'Toh inner function kaunsa hai is example mein?', a: 'Inner function hai (3x² + 1). Uska derivative 6x hai, aur wahi bahar wale term se multiply hota hai.', t: 198 },
    { id: 3, lang: 'Kannada', q: 'ಇದನ್ನು ಇನ್ನೊಮ್ಮೆ ನಿಧಾನವಾಗಿ ವಿವರಿಸಿ.', a: 'ಸರಿ. ಹೊರಗಿನ ಫಂಕ್ಷನ್ ಅನ್ನು ಮೊದಲು differentiate ಮಾಡಿ, ನಂತರ ಒಳಗಿನ ಫಂಕ್ಷನ್‌ನ derivative ನಿಂದ ಗುಣಿಸಿ. 6:42 ರಲ್ಲಿ ಇದೇ ಉದಾಹರಣೆ ಇದೆ.', t: 402 },
    { id: 4, lang: 'Hinglish', q: 'Exam mein iska shortcut kya hai?', a: 'Shortcut yeh hai: outer ka derivative × inner ka derivative. Sir ne 10:40 par exactly yeh line boli — "differentiate the outside, keep the inside, then multiply".', t: 640 },
  ],
};

export default POOCHO_DATA;
