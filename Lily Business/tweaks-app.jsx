// Tweaks integration for the medical massage site.
// Mounts a global Tweaks panel (color theme + layout density + typography) and
// applies live changes via CSS variables on :root.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "blueSteel",
  "displayFont": "Cormorant Garamond",
  "bodyFont": "Inter Tight",
  "headingScale": 1,
  "density": "regular",
  "showMarquee": true,
  "imageStyle": "duotone",
  "ctaStyle": "solid"
}/*EDITMODE-END*/;

const PALETTES = {
  blueSteel: {
    name: "Blue Steel",
    "--steel-900": "#1B3A4B",
    "--steel-700": "#2E5566",
    "--steel-500": "#5B8BA0",
    "--steel-300": "#A8C5D1",
    "--steel-100": "#DCE7EC",
    "--steel-50":  "#EEF3F5",
    "--cream": "#E8DCC4",
    "--cream-soft": "#F2EBDB",
    "--paper": "#FAF7F2",
    "--paper-warm": "#F5F0E6",
    "--rule": "#D8CFB9",
    "--rule-soft": "#E5DECC"
  },
  midnight: {
    name: "Midnight Clinic",
    "--steel-900": "#0F2A3F",
    "--steel-700": "#264459",
    "--steel-500": "#4A7891",
    "--steel-300": "#9FBDCD",
    "--steel-100": "#D6E3EB",
    "--steel-50":  "#EAF1F5",
    "--cream": "#D9C9A6",
    "--cream-soft": "#EFE6CF",
    "--paper": "#F9F6EE",
    "--paper-warm": "#F1EAD8",
    "--rule": "#D2C5A8",
    "--rule-soft": "#E2DAC4"
  },
  oceanGlass: {
    name: "Ocean Glass",
    "--steel-900": "#234E5C",
    "--steel-700": "#3D6E80",
    "--steel-500": "#7FA3B3",
    "--steel-300": "#BDD3DC",
    "--steel-100": "#E1ECF0",
    "--steel-50":  "#F0F5F7",
    "--cream": "#EFE0BC",
    "--cream-soft": "#F6EED7",
    "--paper": "#FBF9F4",
    "--paper-warm": "#F4EFE3",
    "--rule": "#DBD0B5",
    "--rule-soft": "#EAE2CB"
  },
  graphite: {
    name: "Graphite",
    "--steel-900": "#212B30",
    "--steel-700": "#3A4A53",
    "--steel-500": "#697881",
    "--steel-300": "#A6B2B8",
    "--steel-100": "#D7DDE0",
    "--steel-50":  "#ECEEF0",
    "--cream": "#D6CCB6",
    "--cream-soft": "#EAE3D2",
    "--paper": "#F8F6F1",
    "--paper-warm": "#EFEADD",
    "--rule": "#CFC6B0",
    "--rule-soft": "#E1DAC4"
  }
};

const DENSITIES = {
  compact: { gutter: "clamp(16px, 3vw, 40px)", section: "clamp(56px, 7vw, 96px)" },
  regular: { gutter: "clamp(20px, 4vw, 56px)", section: "clamp(72px, 10vw, 140px)" },
  comfy:   { gutter: "clamp(28px, 5vw, 72px)", section: "clamp(96px, 12vw, 180px)" }
};

const DISPLAY_FONTS = ["Cormorant Garamond", "Fraunces", "DM Serif Display", "Playfair Display", "Libre Caslon Text"];
const BODY_FONTS = ["Inter Tight", "DM Sans", "Manrope", "IBM Plex Sans", "Work Sans"];

function applyTweaks(t) {
  const root = document.documentElement;
  const p = PALETTES[t.palette] || PALETTES.blueSteel;
  Object.entries(p).forEach(([k, v]) => { if (k.startsWith("--")) root.style.setProperty(k, v); });

  const d = DENSITIES[t.density] || DENSITIES.regular;
  root.style.setProperty("--gutter", d.gutter);

  // Apply heading scale via a multiplier on display font sizing
  document.querySelectorAll(".__hscale").forEach(n => n.remove());
  const style = document.createElement("style");
  style.className = "__hscale";
  style.textContent = `
    h1 { font-size: clamp(${44 * t.headingScale}px, ${6.4 * t.headingScale}vw, ${88 * t.headingScale}px) !important; }
    h2 { font-size: clamp(${32 * t.headingScale}px, ${4.2 * t.headingScale}vw, ${56 * t.headingScale}px) !important; }
    .section { padding: ${d.section} 0 !important; }
    :root { --font-display: "${t.displayFont}", Georgia, serif !important; --font-body: "${t.bodyFont}", system-ui, sans-serif !important; }
    ${t.imageStyle === "duotone" ? `img { filter: saturate(0.85) !important; }` : ""}
    ${t.imageStyle === "mono" ? `img { filter: grayscale(1) contrast(1.05) !important; }` : ""}
    ${t.imageStyle === "natural" ? `img { filter: none !important; }` : ""}
    ${t.ctaStyle === "outline" ? `.btn:not(.btn-ghost):not(.btn-cream) { background: transparent !important; color: var(--steel-900) !important; }` : ""}
    ${t.ctaStyle === "cream" ? `.btn:not(.btn-ghost) { background: var(--cream) !important; color: var(--steel-900) !important; border-color: var(--cream) !important; }` : ""}
  `;
  document.head.appendChild(style);

  // Marquee toggle
  document.querySelectorAll(".strip").forEach(s => { s.style.display = t.showMarquee ? "" : "none"; });

  // Inject Google Fonts dynamically
  const fontsToLoad = [t.displayFont, t.bodyFont].filter(Boolean);
  fontsToLoad.forEach(f => {
    const id = "gf-" + f.replace(/\s+/g, "-");
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, "+")}:ital,wght@0,400;0,500;0,600;1,400&display=swap`;
      document.head.appendChild(link);
    }
  });
}

// React Tweaks panel
function MassageTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette" />
      <TweakRadio
        label="Color theme"
        value={t.palette}
        options={[
          { value: "blueSteel", label: "Steel" },
          { value: "midnight",  label: "Midnight" },
          { value: "oceanGlass",label: "Ocean" },
          { value: "graphite",  label: "Graphite" }
        ]}
        onChange={(v) => setTweak('palette', v)}
      />

      <TweakSection label="Typography" />
      <TweakSelect
        label="Display font"
        value={t.displayFont}
        options={DISPLAY_FONTS}
        onChange={(v) => setTweak('displayFont', v)}
      />
      <TweakSelect
        label="Body font"
        value={t.bodyFont}
        options={BODY_FONTS}
        onChange={(v) => setTweak('bodyFont', v)}
      />
      <TweakSlider
        label="Heading scale"
        value={t.headingScale}
        min={0.8} max={1.3} step={0.05}
        onChange={(v) => setTweak('headingScale', v)}
      />

      <TweakSection label="Layout" />
      <TweakRadio
        label="Density"
        value={t.density}
        options={["compact", "regular", "comfy"]}
        onChange={(v) => setTweak('density', v)}
      />
      <TweakRadio
        label="CTA style"
        value={t.ctaStyle}
        options={[
          { value: "solid",   label: "Solid" },
          { value: "outline", label: "Outline" },
          { value: "cream",   label: "Cream" }
        ]}
        onChange={(v) => setTweak('ctaStyle', v)}
      />
      <TweakToggle
        label="Modality marquee"
        value={t.showMarquee}
        onChange={(v) => setTweak('showMarquee', v)}
      />

      <TweakSection label="Imagery" />
      <TweakRadio
        label="Image treatment"
        value={t.imageStyle}
        options={[
          { value: "natural", label: "Natural" },
          { value: "duotone", label: "Muted" },
          { value: "mono",    label: "Mono" }
        ]}
        onChange={(v) => setTweak('imageStyle', v)}
      />
    </TweaksPanel>
  );
}

const tweaksMount = document.createElement("div");
document.body.appendChild(tweaksMount);
ReactDOM.createRoot(tweaksMount).render(<MassageTweaks />);
