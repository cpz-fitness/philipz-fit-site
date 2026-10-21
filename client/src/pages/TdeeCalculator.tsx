/* ==========================================================================
   TDEE CALCULATOR — CPZ Fitness (/tdee)
   Client-facing lead magnet: TDEE breakdown (BMR + activity), goal calorie
   target with macro split, BMI as a side result, consultation CTA.
   Ported from the internal cpz-body-calc.html artifact.
   ========================================================================== */

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Sex = "male" | "female";
type Units = "imperial" | "metric";
type GoalKey = "lose" | "maintain" | "gain";
type MacroKey = "lowCarb" | "balanced" | "highProtein";

const LB_TO_KG = 0.453592;

const activityLevels = [
  { value: 1.2, label: "Sedentary — little/no exercise" },
  { value: 1.375, label: "Light — 1–3 days/week" },
  { value: 1.55, label: "Moderate — 3–5 days/week" },
  { value: 1.725, label: "Very active — 6–7 days/week" },
  { value: 1.9, label: "Extra active — physical job + training" },
];

// Calorie target = TDEE × multiplier
const goals: Record<GoalKey, { label: string; multiplier: number; note: string }> = {
  lose: { label: "Lose fat", multiplier: 0.8, note: "20% below your TDEE" },
  maintain: { label: "Maintain", multiplier: 1, note: "Eating at your TDEE" },
  gain: { label: "Build muscle", multiplier: 1.1, note: "10% above your TDEE" },
};

// Percent of calories from each macro (must sum to 100)
const macroStyles: Record<MacroKey, { label: string; protein: number; carbs: number; fat: number; note: string }> = {
  lowCarb: {
    label: "Low carb",
    protein: 35,
    carbs: 20,
    fat: 45,
    note: "Fewer carbs, more fat. Good if you feel better with steadier energy and fewer cravings.",
  },
  balanced: {
    label: "Balanced",
    protein: 30,
    carbs: 40,
    fat: 30,
    note: "An even split that's easy to stick to and fuels training well.",
  },
  highProtein: {
    label: "High protein",
    protein: 40,
    carbs: 35,
    fat: 25,
    note: "Best for building muscle, or keeping it while you lose fat.",
  },
};

const macroColors = { protein: "#ff8c00", carbs: "#ffc46b", fat: "#8a8d93" };

const bmiTags = {
  under: { text: "Underweight", color: "#78aaff", bg: "rgba(120,170,255,.15)" },
  normal: { text: "Normal range", color: "#5ac878", bg: "rgba(90,200,120,.15)" },
  over: { text: "Overweight", color: "#ffb43c", bg: "rgba(255,180,60,.15)" },
  obese: { text: "Obese", color: "#ff5a5a", bg: "rgba(255,90,90,.15)" },
};

function bmiTag(bmi: number) {
  if (bmi < 18.5) return bmiTags.under;
  if (bmi < 25) return bmiTags.normal;
  if (bmi < 30) return bmiTags.over;
  return bmiTags.obese;
}

// Scoped CSS for what inline styles can't reach (spin buttons, focus, select chevron)
const calcCss = `
  .tdee-input, .tdee-select {
    width: 100%; background: #121316; border: 1px solid rgba(255,140,0,0.2); border-radius: 10px;
    color: #eceef0; outline: none; transition: border-color .15s; margin-top: 6px;
  }
  .tdee-input {
    font-family: 'Schibsted Grotesk', sans-serif; font-size: 19px; font-weight: 700;
    padding: 11px 10px; -moz-appearance: textfield;
  }
  .tdee-input::-webkit-outer-spin-button, .tdee-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .tdee-select {
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; padding: 11px 34px 11px 10px;
    -webkit-appearance: none; appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23aeb2b8' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>");
    background-repeat: no-repeat; background-position: right 12px center; background-size: 16px;
  }
  .tdee-input:focus, .tdee-select:focus { border-color: #ff8c00; }
`;

const cardStyle: React.CSSProperties = {
  background: "#1a1b1f",
  border: "1px solid rgba(255,140,0,0.2)",
  borderRadius: "18px",
  padding: "20px 18px",
  marginBottom: "16px",
};

const cardHeadingStyle: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: "11px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#aeb2b8",
  margin: "0 0 14px",
  fontWeight: 600,
};

const rowStyle: React.CSSProperties = { display: "flex", gap: "10px", marginBottom: "12px" };

const fieldStyle: React.CSSProperties = { flex: 1, minWidth: 0 };

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11.5px",
  color: "#aeb2b8",
  fontWeight: 500,
};

const tileStyle: React.CSSProperties = {
  background: "#121316",
  border: "1px solid rgba(255,140,0,0.2)",
  borderRadius: "14px",
  padding: "14px 12px",
  minWidth: 0,
};

const tileLabelStyle: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: "10.5px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#aeb2b8",
  fontWeight: 600,
  marginBottom: "6px",
};

const tileValueStyle: React.CSSProperties = {
  fontFamily: "'League Spartan', sans-serif",
  fontSize: "26px",
  fontWeight: 800,
  color: "#eceef0",
  lineHeight: 1.1,
};

const unitStyle: React.CSSProperties = {
  fontFamily: "'Schibsted Grotesk', sans-serif",
  fontSize: "13px",
  color: "#aeb2b8",
  fontWeight: 700,
  marginLeft: "4px",
};

const heroValueStyle: React.CSSProperties = {
  fontFamily: "'League Spartan', sans-serif",
  fontSize: "52px",
  fontWeight: 900,
  color: "#ff8c00",
  lineHeight: 1,
};

const noteStyle: React.CSSProperties = { fontSize: "12px", color: "#aeb2b8", marginTop: "4px", lineHeight: 1.5 };

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        background: "#121316",
        border: "1px solid rgba(255,140,0,0.2)",
        borderRadius: "10px",
        overflow: "hidden",
        marginTop: "6px",
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            style={{
              flex: 1,
              background: active ? "#ff8c00" : "transparent",
              border: "none",
              color: active ? "#121316" : "#aeb2b8",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "12.5px",
              fontWeight: 600,
              padding: "11px 4px",
              cursor: "pointer",
              transition: "background .15s, color .15s",
              whiteSpace: "nowrap",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  inputMode = "numeric",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "numeric" | "decimal";
}) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>
        {label}
        <input
          className="tdee-input"
          type="number"
          inputMode={inputMode}
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}

// Labelled stacked bar; segment widths are proportional to `value`
function StackedBar({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  return (
    <div style={{ marginTop: "14px" }}>
      <div style={{ display: "flex", height: "10px", borderRadius: "100px", overflow: "hidden", gap: "2px" }}>
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: "8px" }}>
        {segments.map((s) => (
          <span key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#aeb2b8" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: s.color }} />
            {s.label} {Math.round((s.value / total) * 100)}%
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TdeeCalculator() {
  const [sex, setSex] = useState<Sex>("male");
  const [units, setUnits] = useState<Units>("imperial");
  const [age, setAge] = useState("35");
  const [weight, setWeight] = useState("180");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("10");
  const [heightCm, setHeightCm] = useState("178");
  const [activity, setActivity] = useState(1.55);
  const [goalKey, setGoalKey] = useState<GoalKey>("maintain");
  const [macroKey, setMacroKey] = useState<MacroKey>("balanced");

  useEffect(() => {
    document.title = "TDEE Calculator | CPZ Fitness";
  }, []);

  // Convert the entered weight/height so switching units keeps the same body
  const changeUnits = (next: Units) => {
    if (next === units) return;
    const w = parseFloat(weight);
    if (next === "metric") {
      if (w) setWeight(String(Math.round(w * LB_TO_KG * 10) / 10));
      const totalIn = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
      if (totalIn) setHeightCm(String(Math.round(totalIn * 2.54)));
    } else {
      if (w) setWeight(String(Math.round(w / LB_TO_KG)));
      const cm = parseFloat(heightCm);
      if (cm) {
        const totalIn = Math.round(cm / 2.54);
        setHeightFt(String(Math.floor(totalIn / 12)));
        setHeightIn(String(totalIn % 12));
      }
    }
    setUnits(next);
  };

  const isImperial = units === "imperial";
  const ageNum = parseFloat(age) || 0;
  const heightCmNum = isImperial
    ? ((parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)) * 2.54
    : parseFloat(heightCm) || 0;
  const weightKg = (parseFloat(weight) || 0) * (isImperial ? LB_TO_KG : 1);
  const valid = ageNum > 0 && heightCmNum > 0 && weightKg > 0;
  const show = (n: number) => (valid ? fmt(n) : "—");

  // Mifflin-St Jeor
  const bmr = 10 * weightKg + 6.25 * heightCmNum - 5 * ageNum + (sex === "male" ? 5 : -161);
  const tdee = bmr * activity;
  // From rounded values so BMR + Activity always adds up to the displayed TDEE
  const activityKcal = Math.round(tdee) - Math.round(bmr);

  const goal = goals[goalKey];
  const target = tdee * goal.multiplier;
  const macros = macroStyles[macroKey];
  const macroRows = [
    { key: "protein", label: "Protein", pct: macros.protein, kcalPerGram: 4 },
    { key: "carbs", label: "Carbs", pct: macros.carbs, kcalPerGram: 4 },
    { key: "fat", label: "Fat", pct: macros.fat, kcalPerGram: 9 },
  ] as const;

  const heightM = heightCmNum / 100;
  const bmi = weightKg / (heightM * heightM);
  const tag = bmiTag(bmi);
  // Healthy weight range (BMI 18.5–24.9) in display units
  const toDisplay = (kg: number) => Math.round(isImperial ? kg / LB_TO_KG : kg);
  const weightUnit = isImperial ? "lb" : "kg";

  return (
    <div style={{ backgroundColor: "#121316", minHeight: "100vh", color: "#eceef0", fontFamily: "'Inter', sans-serif" }}>
      <style>{calcCss}</style>
      <Navbar />

      <main style={{ maxWidth: "560px", margin: "0 auto", padding: "104px 16px 64px" }}>
        <header style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#ff8c00",
              fontWeight: 600,
            }}
          >
            Free Tool
          </div>
          <h1
            style={{
              fontFamily: "'League Spartan', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.2rem, 8vw, 3rem)",
              lineHeight: 1.05,
              margin: "8px 0 10px",
            }}
          >
            TDEE Calculator
          </h1>
          <p style={{ color: "#aeb2b8", fontSize: "15px", lineHeight: 1.55, margin: 0 }}>
            Find out how many calories your body burns in a day, and how to split them into protein, carbs and fat.
          </p>
        </header>

        {/* About you */}
        <section style={cardStyle}>
          <h2 style={cardHeadingStyle}>About You</h2>
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <span style={labelStyle}>Sex</span>
              <Segmented
                value={sex}
                onChange={setSex}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
              />
            </div>
            <NumberField label="Age" value={age} onChange={setAge} />
          </div>

          <div style={rowStyle}>
            <NumberField label={`Weight (${weightUnit})`} value={weight} onChange={setWeight} inputMode="decimal" />
            <div style={fieldStyle}>
              <span style={labelStyle}>Units</span>
              <Segmented
                value={units}
                onChange={changeUnits}
                options={[
                  { value: "imperial", label: "lb/ft" },
                  { value: "metric", label: "kg/cm" },
                ]}
              />
            </div>
          </div>

          <div style={rowStyle}>
            {isImperial ? (
              <>
                <NumberField label="Height (ft)" value={heightFt} onChange={setHeightFt} />
                <NumberField label="Height (in)" value={heightIn} onChange={setHeightIn} />
              </>
            ) : (
              <NumberField label="Height (cm)" value={heightCm} onChange={setHeightCm} />
            )}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Activity Level
              <select className="tdee-select" value={activity} onChange={(e) => setActivity(parseFloat(e.target.value))}>
                {activityLevels.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {/* TDEE breakdown */}
        <section style={cardStyle} aria-live="polite">
          <h2 style={cardHeadingStyle}>Your TDEE</h2>
          <div style={heroValueStyle}>
            {show(tdee)}
            <span style={{ ...unitStyle, fontSize: "16px" }}>kcal/day</span>
          </div>
          <p style={noteStyle}>Total calories you burn in a typical day.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "16px" }}>
            <div style={tileStyle}>
              <div style={tileLabelStyle}>BMR</div>
              <div style={tileValueStyle}>
                {show(bmr)}
                <span style={unitStyle}>kcal</span>
              </div>
              <div style={noteStyle}>Burned at rest, just keeping you alive</div>
            </div>
            <div style={tileStyle}>
              <div style={tileLabelStyle}>Activity</div>
              <div style={tileValueStyle}>
                {valid ? `+${fmt(activityKcal)}` : "—"}
                <span style={unitStyle}>kcal</span>
              </div>
              <div style={noteStyle}>Burned moving, working and training</div>
            </div>
          </div>

          {valid && (
            <StackedBar
              segments={[
                { label: "BMR", value: bmr, color: "#ff8c00" },
                { label: "Activity", value: activityKcal, color: "#ffc46b" },
              ]}
            />
          )}

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "18px",
              padding: "12px 14px",
              background: "rgba(255,140,0,0.06)",
              border: "1px solid rgba(255,140,0,0.15)",
              borderRadius: "12px",
            }}
          >
            <Info size={16} color="#ff8c00" style={{ flexShrink: 0, marginTop: "2px" }} aria-hidden />
            <p style={{ ...noteStyle, margin: 0 }}>
              Calculated with the Mifflin-St Jeor equation, the most accurate of the common BMR formulas for most
              adults, multiplied by an activity factor. It's an estimate: real needs can vary by ±10% or more depending
              on muscle mass, genetics, sleep, stress and how accurately activity is picked. Use it as a starting
              point, track your weight for 2–3 weeks, and adjust.
            </p>
          </div>
        </section>

        {/* Calorie target + macros */}
        <section style={cardStyle} aria-live="polite">
          <h2 style={cardHeadingStyle}>Your Daily Target &amp; Macros</h2>

          <span style={labelStyle}>Goal</span>
          <Segmented
            value={goalKey}
            onChange={setGoalKey}
            options={(Object.keys(goals) as GoalKey[]).map((k) => ({ value: k, label: goals[k].label }))}
          />

          <div style={{ ...heroValueStyle, fontSize: "40px", marginTop: "16px" }}>
            {show(target)}
            <span style={{ ...unitStyle, fontSize: "15px" }}>kcal/day</span>
          </div>
          <p style={noteStyle}>{goal.note}</p>

          <div style={{ marginTop: "18px" }}>
            <span style={labelStyle}>Macro Style</span>
            <Segmented
              value={macroKey}
              onChange={setMacroKey}
              options={(Object.keys(macroStyles) as MacroKey[]).map((k) => ({ value: k, label: macroStyles[k].label }))}
            />
            <p style={noteStyle}>{macros.note}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "14px" }}>
            {macroRows.map((m) => {
              const kcal = (target * m.pct) / 100;
              return (
                <div key={m.key} style={{ ...tileStyle, borderTop: `3px solid ${macroColors[m.key]}` }}>
                  <div style={tileLabelStyle}>{m.label}</div>
                  <div style={tileValueStyle}>
                    {valid ? Math.round(kcal / m.kcalPerGram) : "—"}
                    <span style={unitStyle}>g</span>
                  </div>
                  <div style={{ ...noteStyle, fontSize: "11px" }}>
                    {valid ? `${fmt(kcal)} kcal · ` : ""}
                    {m.pct}%
                  </div>
                </div>
              );
            })}
          </div>

          <StackedBar
            segments={macroRows.map((m) => ({ label: m.label, value: m.pct, color: macroColors[m.key] }))}
          />
        </section>

        {/* BMI side result */}
        <section
          style={{
            ...cardStyle,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "14px 16px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 12px" }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 600, color: "#eceef0" }}>
              BMI {valid ? bmi.toFixed(1) : "—"}
            </span>
            {valid && (
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "100px",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  background: tag.bg,
                  color: tag.color,
                }}
              >
                {tag.text}
              </span>
            )}
          </div>
          <p style={{ ...noteStyle, marginTop: "6px" }}>
            Healthy weight range for your height:{" "}
            <strong style={{ color: "#eceef0" }}>
              {valid
                ? `${toDisplay(18.5 * heightM * heightM)}–${toDisplay(24.9 * heightM * heightM)} ${weightUnit}`
                : "—"}
            </strong>
            . BMI doesn't account for muscle mass, so lifters often read high.
          </p>
        </section>

        {/* CTA */}
        <section style={{ ...cardStyle, textAlign: "center", padding: "28px 20px" }}>
          <h2
            style={{
              fontFamily: "'League Spartan', sans-serif",
              fontWeight: 800,
              fontSize: "1.5rem",
              lineHeight: 1.2,
              margin: "0 0 8px",
            }}
          >
            Numbers are the start.
          </h2>
          <p style={{ color: "#aeb2b8", fontSize: "14.5px", lineHeight: 1.55, margin: "0 0 18px" }}>
            Want a plan built around them?
          </p>
          <a
            href="/#book"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#ff8c00",
              color: "#121316",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "14px",
              textDecoration: "none",
            }}
          >
            Book a Free Consultation
          </a>
        </section>

        <p style={{ textAlign: "center", color: "#6a6d72", fontSize: "11px", lineHeight: 1.6, margin: "20px 0 0" }}>
          Estimates only, not medical advice. Check with your doctor before making big changes to your diet.
        </p>
      </main>

      <Footer />
    </div>
  );
}
