#!/usr/bin/env python3
"""Rebuild the local homepage from its archived original, preserving its UI."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
FONT = 'Golos Text'

def clean(text):
    return '\n'.join(line.rstrip() for line in text.splitlines()).strip() + '\n'

def unify_font(text):
    for family in ['Montserrat', 'Pixelify Sans', 'Exo 2', 'Jura', 'Courier New']:
        text = text.replace("'" + family + "'", "'" + FONT + "'")
    return text

source = (ROOT / 'reference/original.html').read_text()
# Comments include obsolete scripts and commented markup, not visible content.
source = re.sub(r'<!--.*?-->', '', source, flags=re.S)

asset_map = {
    'https://outdoor.printanit.ru/wp-content/themes/outdoor/images/logo.png': 'assets/logo.png',
    'https://outdoor.printanit.ru/wp-content/themes/outdoor/images/site-background.webp': 'assets/original-background.webp',
    'https://outdoor.printanit.ru/wp-content/themes/outdoor/images/hero-bg.jpg': 'assets/original-hero.jpg',
    'https://outdoor.printanit.ru/wp-content/themes/outdoor/images/about-image.jpg': 'assets/production.jpg',
    'https://outdoor.printanit.ru/wp-content/themes/outdoor/images/2gis-icon.svg': 'assets/2gis-icon.svg',
    'https://outdoor.printanit.ru/wp-content/uploads/2026/03/photo_8_2026-03-30_09-56-04-1024x768.jpg': 'assets/shawarma.jpg',
    'https://outdoor.printanit.ru/wp-content/uploads/2026/03/photo_6_2026-03-30_09-56-04-1024x576.jpg': 'assets/tracker.jpg',
    'https://outdoor.printanit.ru/wp-content/uploads/2026/03/photo_5_2026-03-30_09-56-04-1024x768.jpg': 'assets/kolokol.jpg',
    'https://outdoor.printanit.ru/wp-content/uploads/2026/03/photo_3_2026-03-30_09-56-04-1024x768.jpg': 'assets/scandy.jpg',
    'https://outdoor.printanit.ru/wp-content/uploads/2026/03/photo_1_2026-03-30_09-56-04-1024x781.jpg': 'assets/lamoda.jpg',
    'https://outdoor.printanit.ru/favicon.ico': 'assets/favicon.ico',
}
for url, local in asset_map.items():
    source = source.replace(url, local)

stylesheets = {
    '//outdoor.printanit.ru/wp-content/cache/wpfc-minified/kzvkhlg1/6lu2o.css': 'source/base.css',
    '//outdoor.printanit.ru/wp-content/cache/wpfc-minified/1gfby8jp/6lu2o.css': 'source/main.css',
    '//outdoor.printanit.ru/wp-content/cache/wpfc-minified/ee1zaq6q/6lu2o.css': 'source/extra.css',
}
for url, local in stylesheets.items():
    source = source.replace(url, local)
for original, name in [('styles-base.css', 'base.css'), ('styles-main.css', 'main.css'), ('styles-extra.css', 'extra.css')]:
    css = (ROOT / 'reference' / original).read_text()
    css = re.sub(r'(?:(?:https?:)?//outdoor\.printanit\.ru)/wp-content/themes/outdoor/(?:css/)?images/site-background.webp', '../assets/original-background.webp', css)
    css = unify_font(css)
    (ROOT / 'source' / name).write_text(clean(css))

source = re.sub(r'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6\.4\.0/css/all.min.css[^\"\']*', 'assets/vendor/fontawesome.css', source)
source = re.sub(r'https://fonts.googleapis.com/css2\?[^\"\']*', 'source/fonts.css', source)
source = source.replace('//outdoor.printanit.ru/wp-content/cache/wpfc-minified/70bk382x/6lu2o.js', 'assets/vendor/homepage-deps.js')
source = source.replace('https://outdoor.printanit.ru/wp-content/plugins/ewww-image-optimizer/includes/lazysizes.min.js?ver=870', 'assets/vendor/lazysizes.min.js')
source = source.replace('https://outdoor.printanit.ru/wp-content/themes/outdoor/js/custom.js?ver=1791271713', 'source/effects.js')
effects = (ROOT / 'reference/original-custom.js').read_text()
# Render the same matrix animation at native display density. Animation,
# positions, glow and timing stay unchanged; only canvas raster density changes.
effects = effects.replace(
    '  canvas.width = container.parentElement.clientWidth || 500;\n  canvas.height = 160;',
    "  const renderScale = Math.min(window.devicePixelRatio || 1, 2);\n  canvas.style.width = '100%';\n  canvas.style.height = '160px';\n  canvas.width = (container.parentElement.clientWidth || 500) * renderScale;\n  canvas.height = 160 * renderScale;",
    1,
)
effects = effects.replace('  const ctx = canvas.getContext("2d");', '  const ctx = canvas.getContext("2d");\n  ctx.scale(renderScale, renderScale);', 1)
effects = effects.replace('Math.floor(canvas.width / columnSpacing)', 'Math.floor(canvas.width / renderScale / columnSpacing)', 1)
effects = effects.replace('const textX = canvas.width / 2;', 'let textX = canvas.width / renderScale / 2;', 1)
effects = effects.replace('const textY = 100;', """let textY = 100;
  let sloganSize = 40;
  function alignSlogan() {
    const row = document.querySelector('.printanit-header-middle-row');
    if (!row || !row.offsetHeight) return;
    textY = row.offsetTop + row.offsetHeight / 2;
    const logo = row.querySelector('.printanit-header-logo').getBoundingClientRect();
    const search = row.querySelector('.printanit-header-search').getBoundingClientRect();
    const bounds = canvas.getBoundingClientRect();
    const left = logo.right + 24;
    const right = search.left - 24;
    textX = (left + right) / 2 - bounds.left;
    ctx.save();
    ctx.font = "800 40px 'Jura', sans-serif";
    sloganSize = Math.min(40, Math.max(28, Math.floor((right - left) / ctx.measureText(slogan).width * 40)));
    ctx.restore();
  }
  alignSlogan();
  document.fonts.ready.then(alignSlogan);""", 1)
draw_font = '        ctx.font = "800 40px \'Jura\', sans-serif";'
effects = effects.replace(draw_font, '        ctx.font = `800 ${sloganSize}px \'Jura\', sans-serif`;', 1)
effects = effects.replace('ctx.clearRect(0, 0, canvas.width, canvas.height);', 'ctx.clearRect(0, 0, canvas.width / renderScale, canvas.height / renderScale);', 1)
effects = effects.replace(
    '    canvas.width = container.parentElement.clientWidth || 500;\n    canvas.height = 160;',
    '    canvas.width = (container.parentElement.clientWidth || 500) * renderScale;\n    canvas.height = 160 * renderScale;\n    ctx.scale(renderScale, renderScale);\n    textX = canvas.width / renderScale / 2;\n    alignSlogan();',
    1,
)
(ROOT / 'source/effects.js').write_text(clean(unify_font(effects)))

# Local preview must not run production analytics, CAPTCHA or link prefetches.
def script_filter(match):
    tag, body = match[1], match[2]
    if any(marker in tag + body for marker in ['mc.yandex.ru', 'smartcaptcha.yandexcloud.net', 'speculationrules']):
        return ''
    if 'function submitForm(form, formData)' in body:
        body = body.replace(
            "return new Promise((resolve, reject) => {\n// Проверка капчи",
            "if (['127.0.0.1', 'localhost', ''].includes(location.hostname)) return Promise.reject('Локальный макет: отправка не подключена. Свяжитесь с нами по телефону или email.');\nreturn new Promise((resolve, reject) => {\n// Проверка капчи",
            1,
        )
        # Preserve the original modal, validation and phone mask. Show a clear
        # inline message only if somebody submits the local preview form.
        body = body.replace(
            "console.log('Form submission error:', err);",
            "let note = this.querySelector('.local-form-status');\nif (!note) { note = document.createElement('p'); note.className = 'local-form-status'; note.setAttribute('role', 'status'); this.appendChild(note); }\nnote.textContent = err;",
        )
    return '<script' + tag + '>' + body + '</script>'
source = re.sub(r'<script\b([^>]*)>(.*?)</script>', script_filter, source, flags=re.S)
source = re.sub(r'<noscript>\s*<div>\s*<img[^>]*mc\.yandex\.ru.*?</noscript>', '', source, flags=re.S)
# The promotion image referenced by the live homepage returns HTTP 500, both
# at its thumbnail URL and original URL. Keep the original dark fallback.
source = re.sub(r'\sdata-back="https://outdoor.printanit.ru/wp-content/uploads/2026/10/0647788380fd4045e00638fc61665885-576x1024.jpg"', '', source)
source = re.sub(r'<link[^>]+rel=[\"\']dns-prefetch[\"\'][^>]*>', '', source)
preloads = []
for face in re.findall(r'@font-face\s*\{([^}]+)\}', (ROOT / 'source/fonts.css').read_text()):
    weight = re.search(r'font-weight:\s*(\d+)', face)
    path = re.search(r'url\([\"\']?([^\"\')]+)', face)
    if weight and path and weight[1] in ['400', '700', '800']:
        preloads.append('<link rel="preload" as="font" type="font/ttf" crossorigin href="' + path[1].removeprefix('../') + '">')
source = source.replace('</head>', '\n'.join(preloads) + '\n<script src="app.js" defer></script>\n</head>')
source = source.replace('</body>', '<link rel="stylesheet" href="styles.css">\n</body>')
source = source.replace('<a href="https://outdoor.printanit.ru/"', '<a href="/"')
source = source.replace('href="/privacy-policy"', 'href="https://outdoor.printanit.ru/privacy-policy/"')
source = unify_font(source)
(ROOT / 'index.html').write_text(clean(source))
print('Restored homepage markup, source CSS and original effects.')
