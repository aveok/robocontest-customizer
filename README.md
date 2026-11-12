# RC Theme

robocontest.uz uchun shaxsiy dizayn (Chrome extension, Manifest V3).
Uslub: **Modern minimal** — chuqur neytral ranglar, ingichka chiziqlar,
bitta accent (ko'k), tekis kontrollar.

## Nima qiladi

**Dizayn**
- O'z palitrasi (light + dark), saytdagi mavzu menyusida nima tanlanganidan
  qat'i nazar. Light/dark saytning o'z `html.dark` klassiga ergashadi.
- "Orolcha" layout: sidebar va kontent eng to'q fondagi ikkita alohida blok
  (12px oraliq, 12px radius, ingichka ramka), ajratuvchi chiziq yo'q. Katta
  ekranda 1440px kenglikda markazda. Kod yoziladigan sahifa (`/tasks/<id>`,
  judge) to'liq kenglikda; mobilda (<768px) oddiy ko'rinish.
- Ikkala blok ham kontentiga moslashadi (qisqa sahifa ostida bo'sh blok
  qolmaydi; uzun sahifa ekran balandligida to'xtab, ichida scroll bo'ladi).
  Sidebar'da "Hakam" ro'yxat ortidan; elementlar 32px; aktiv element neytral fonda, faqat ikonka ko'k.
- Tugma, input, switch'lar tekis: 3D chekka va hover/bosishda siljish yo'q.
- Bir qatordagi filtr tugmalari (aria-pressed) bitta segmentli guruh.
- Jadvallar fonsiz, faqat ingichka chiziqlar; ustun sarlavhalari katta harfli
  12px (kontrast ≥5.5:1), hover'da qator ajraladi; qatorlar ~31px. Jadvaldagi nom havolalari oddiy matn rangida, ID'lar
  ko'k; badge'lar (qiyinlik) fonsiz rangli matn.
- Burchaklar har doim 6px (saytdagi "Burchak yumaloqligi"dan qat'i nazar).
- Masalalar (`/tasks`): "Turkum", "Qabul qilingan", "Jami" ustunlari yo'q,
  filtrlar qidiruv qatorida; 20 masala ~1440×900 ekranga scroll'siz sig'adi.
- Kod muharriri: 14px, JetBrains Mono / Fira Code.

**Ortiqcha narsalar yashirilgan** (`declutter.css` + content.js tweak'lar)
- Sidebar: "Chegirma" va "Judge · N kun qoldi" reklamalari, footer (email,
  telefon, huquqiy havolalar), "Platforma" guruhi (Qanday ishlaydi, Bizning
  jamoa). Tepadagi chegirma banneri.
- Har sahifa sarlavhasi ostidagi izoh matni.
- Bosh sahifa: salomlashuv ostidagi matn, "Hamjamiyat statistikasi" va
  "Hududlar bo'yicha" (xarita) panellari.
- Urinishlar: "Jadval yangilangan vaqt". Kurslar: "Kursni ko'rish" (butun
  kartochka havola) va sarlavhani takrorlovchi tavsiflar.
- Takror badge'lar (masala sahifasida ikki marta "Oson"), "." kabi bo'sh bio.

**Xatti-harakat**
- Sichqoncha kursori oddiy tizim kursori.
- Click uchqunlari, hover yaltirashi, mavzu almashish animatsiyasi o'chiq.
- Til menyusidan "Özbekça (UZ)" olib tashlanadi, "O'zbekcha (UZL)" qoladi.
- Header'dagi qidiruv va "Maxsus imkoniyatlar" tugmalari yashirin
  (qidiruv Ctrl/⌘+K bilan ochiladi).
- Popup: hammasini o'chirib/yoqish va "Tungi rejim" (saytning o'z yashirin
  menyusini bosadi, tanlov cookie'ga va akkauntga saqlanadi).

## O'rnatish

1. Chrome'da `chrome://extensions` ni oching.
2. O'ng yuqoridagi **Developer mode** ni yoqing.
3. **Load unpacked** → shu papkani (`robocontest-theme`) tanlang.
4. robocontest.uz ni oching (yoki yangilang).

Fayllarni o'zgartirgandan keyin: `chrome://extensions` da ↻, keyin saytni
yangilang. Yoki sahifa konsolidan (faqat unpacked):

```js
document.dispatchEvent(new CustomEvent("rc-dev-reload"))
```

1–2 soniyadan keyin sahifani yangilang.

## Tuzilma

```
manifest.json            extension sozlamalari, CSS tartibi
background.js            dev qayta yuklash ilgagi (faqat unpacked)
content.js               html.rc-theme, data-rc-path, DOM tweak'lar, tungi rejim
styles/tokens.css        ranglar, radius, o'lchamlar (light + dark)
styles/base.css          xatti-harakat: kursor, animatsiyalar, yashirilganlar, havolalar
styles/layout.css        shell: markazdagi quti, sidebar, sarlavha
styles/components.css    tugma, input, filtr guruhi, badge, jadval
styles/pages/tasks.css   faqat /tasks
styles/declutter.css     ortiqcha bloklar va matnlarni yashirish
styles/editor.css        CodeMirror 6 muharriri
popup/                   yoqish/o'chirish va tungi rejim
```

## Qanday ishlaydi

- Sayt (Tailwind + shadcn) ranglarni `--background`, `--card`, `--primary`
  kabi CSS o'zgaruvchilardan oladi; `tokens.css` ularni almashtiradi.
- Komponentlar saytning `data-slot` atributlari va `.btn-arcade` /
  `.field-arcade` klasslari orqali tanlanadi, Tailwind utility klasslari
  orqali emas (ular sayt yangilanganda o'zgaradi).
- Hamma CSS `html.rc-theme` ichida. Popup tugmasi shu klassni olib tashlaydi.
- Sahifaga xos qoidalar `html[data-rc-path="/tasks"]` kabi; yo'lni
  `content.js` har sahifa almashganda qo'yadi (Inertia SPA).

## Maslahatlar

- Yangi o'zgaruvchi topish: DevTools → Elements → `<html>` → Styles.
- Selektor uchun `data-slot`, `role`, `aria-*` atributlarni ishlating.
- Rang kerak bo'lsa avval `tokens.css` ga token qo'shing, keyin ishlating.
