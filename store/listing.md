# Chrome Web Store listing — RC Theme 0.2.0

Package: `dist/rc-theme-0.2.0.zip` (`./build.sh`)

## Package → Upload new package
`dist/rc-theme-0.2.0.zip`. Title and summary come from `manifest.json`:

- Title: RC Theme
- Summary: Unofficial. Clean, compact redesign for robocontest.uz: modern dark/light theme, compact tables, less clutter.

## Store listing

**Description** (Language: Uzbek)

```
RC Theme — robocontest.uz uchun norasmiy, toza va ixcham dizayn.

Nima o'zgaradi:
• Zamonaviy minimal ranglar: tungi va kunduzgi rejim, bitta ko'k accent
• Sidebar va kontent alohida bloklarda, katta ekranda markazda
• Ixcham jadvallar: masalalar ro'yxati bitta ekranga sig'adi
• Ortiqcha narsalar yashiriladi: reklama bannerlari, izoh matnlari, ma'lumot panellari
• Oddiy tizim kursori, click va hover animatsiyalari o'chiq
• Popup: dizaynni o'chirib-yoqish va tungi rejimni almashtirish

Maxfiylik: extension hech qanday ma'lumot yig'maydi va o'zi tarmoqqa so'rov yubormaydi. Faqat bitta sozlamani (yoqilgan/o'chirilgan) Chrome sync xotirasida saqlaydi. "Tungi rejim" tugmasi saytning o'z mavzu menyusini bosadi; tanlovni sayt o'zi saqlaydi.

Bu norasmiy extension va RoboContest bilan bog'liq emas.
```

- Category: Functionality & UI
- Screenshots (1280×800 JPEG, no alpha): `store/1-masalalar.jpg`, `store/2-musobaqalar.jpg`, `store/3-masala.jpg`
- Homepage URL: https://github.com/aveok/robocontest-customizer
- Support URL: https://github.com/aveok/robocontest-customizer/issues
- Mature content: off

## Privacy

**Single purpose**

```
Restyles robocontest.uz: its own color theme, layout and hiding of promotional and redundant page elements.
```

**Permission justification — storage**

```
Stores one on/off setting for the theme (chrome.storage.sync), so the popup switch is remembered across devices.
```

**Permission justification — host access (content script on robocontest.uz)**

```
The extension only works on robocontest.uz and its subdomains: it injects CSS and a small script there to restyle the pages. It does not run on any other site.
```

**Remote code:** No, I am not using remote code.

**Data usage:** the extension does not collect or transmit any user data — leave every data type unchecked. The three certifications at the bottom are yours to tick.
