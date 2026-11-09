# RC Theme

robocontest.uz uchun shaxsiy dizayn (Chrome extension, Manifest V3).

## Nima qiladi

- Sayt har doim **Classic** ko'rinishda ochiladi (dark rejimda Classic dark),
  saytdagi mavzu menyusida nima tanlanganidan qat'i nazar.
- Sichqoncha kursori oddiy tizim kursoriga qaytariladi.
- Til menyusidan "Özbekça (UZ)" olib tashlanadi, "O'zbekcha (UZL)" qoladi.
- Popup'dagi tugma bilan hammasini o'chirib/yoqish mumkin.

## O'rnatish

1. Chrome'da `chrome://extensions` ni oching.
2. O'ng yuqoridagi **Developer mode** ni yoqing.
3. **Load unpacked** → shu papkani (`robocontest-theme`) tanlang.
4. robocontest.uz ni oching (yoki yangilang).

Fayllarni o'zgartirgandan keyin: `chrome://extensions` da extension kartasidagi ↻ tugmasi, keyin saytni yangilang.

## Tuzilma

```
manifest.json      extension sozlamalari, qaysi saytda ishlashi
content.js         html.rc-theme klassini qo'shadi, DOM tweak'lar
styles/theme.css   ranglar (CSS o'zgaruvchilar), light + dark
styles/editor.css  CodeMirror 6 kod muharriri
popup/             yoqish/o'chirish tugmasi
```

## Qanday ishlaydi

- Sayt ranglarni `--background`, `--primary`, `--card`, `--border`, `--radius` kabi
  CSS o'zgaruvchilardan oladi. `theme.css` ularni almashtiradi.
- Hamma CSS `html.rc-theme` ichida. Popup'dagi tugma shu klassni olib tashlaydi,
  shuning uchun dizayn sahifani qayta yuklamasdan o'chadi.
- Sayt Inertia SPA: sahifalar reload'siz almashadi. CSS'ga ta'sir qilmaydi,
  `content.js` dagi `tweaks` esa har `inertia:navigate` da qayta ishlaydi.

## Maslahatlar

- Yangi o'zgaruvchi topish: DevTools → Elements → `<html>` → Styles.
- Selektor uchun `role`, `aria-*`, `data-*` atributlarni ishlating;
  Tailwind klasslari (`.grid-cols-3`) sayt yangilanganda o'zgarishi mumkin.
- Dark rejim `html.dark` klassi bilan: `html.rc-theme.dark { ... }`.
