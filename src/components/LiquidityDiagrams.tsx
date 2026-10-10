import React from 'react';

/*
 * Illustrative liquidity diagrams, drawn as inline SVG so they follow the site theme (colours come
 * from CSS variables in custom.css) and stay sharp at any width. Shapes are schematic, not pool data.
 */

const W = 320;
const H = 150;
const AXIS_Y = 118;
const LEFT = 16;
const RIGHT = W - 16;

function Axis({ label = 'Price' }: { label?: string }) {
  return (
    <>
      <line className="d-axis" x1={LEFT} y1={AXIS_Y} x2={RIGHT} y2={AXIS_Y} />
      <text x={RIGHT} y={AXIS_Y + 18} textAnchor="end">{label} →</text>
    </>
  );
}

function PriceLine({ x, label = 'Current price' }: { x: number; label?: string }) {
  return (
    <>
      <line className="d-price" x1={x} y1={22} x2={x} y2={AXIS_Y} />
      <text className="d-strong" x={x} y={16} textAnchor="middle">{label}</text>
    </>
  );
}

function Panel({ title, text, children, label }: { title: string; text: string; label: string; children: React.ReactNode }) {
  return (
    <div className="diagram__panel">
      <h4>{title}</h4>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        <title>{label}</title>
        {children}
      </svg>
      <p>{text}</p>
    </div>
  );
}

/** V2 spreads a deposit across every price; V3 puts the same deposit inside a chosen range. */
export function V2V3Comparison() {
  const price = 160;
  return (
    <figure className="diagram">
      <div className="diagram__grid">
        <Panel
          title="V2: every price"
          label="V2: a low, flat band of liquidity across the whole price axis, with the current price in the middle."
          text="Your deposit is spread from zero to infinity. The position always earns its share of fees, but only a thin slice of it sits near the current price, where trades happen."
        >
          <rect className="d-liquidity" x={LEFT} y={92} width={RIGHT - LEFT} height={AXIS_Y - 92} />
          <PriceLine x={price} />
          <Axis />
        </Panel>
        <Panel
          title="V3: a range you choose"
          label="V3: a tall block of liquidity between a minimum and maximum price, around the current price; no liquidity outside it."
          text="The same deposit sits between your minimum and maximum price, so it provides much more liquidity there and earns more fees per dollar, but only while the price is inside the range."
        >
          <rect className="d-liquidity" x={110} y={40} width={100} height={AXIS_Y - 40} />
          <text x={110} y={AXIS_Y + 18} textAnchor="middle">min</text>
          <text x={210} y={AXIS_Y + 18} textAnchor="middle">max</text>
          <PriceLine x={price} />
          <Axis label="" />
        </Panel>
      </div>
      <figcaption className="diagram__caption">Illustrative shapes, not live pool data.</figcaption>
    </figure>
  );
}

/** What a V3 position holds, and whether it earns, as the price moves through and out of its range. */
export function RangeStates({ base = 'base token', quote = 'quote token' }: { base?: string; quote?: string }) {
  const block = (x: number) => <rect className="d-liquidity" x={x} y={52} width={96} height={AXIS_Y - 52} />;
  return (
    <figure className="diagram">
      <div className="diagram__grid">
        <Panel
          title="Price below the range"
          label={`Price below the range: the position holds only ${base} and earns no fees.`}
          text={`Holds only ${base}. Earns nothing until the price rises back into the range.`}
        >
          {block(170)}
          <PriceLine x={80} label="Price" />
          <Axis />
        </Panel>
        <Panel
          title="Price inside the range"
          label={`Price inside the range: the position holds both ${base} and ${quote} and earns fees.`}
          text={`Holds both tokens and earns fees. As the price rises it sells ${base} for ${quote}; as it falls, the reverse.`}
        >
          {block(112)}
          <PriceLine x={160} label="Price" />
          <Axis />
        </Panel>
        <Panel
          title="Price above the range"
          label={`Price above the range: the position holds only ${quote} and earns no fees.`}
          text={`Holds only ${quote}. Earns nothing until the price falls back into the range.`}
        >
          {block(54)}
          <PriceLine x={240} label="Price" />
          <Axis />
        </Panel>
        <Panel
          title="One-sided deposit"
          label={`A range entirely above the current price, funded with ${base} only.`}
          text={`A range entirely above the current price is funded with ${base} alone, like a sell order that fills as the price rises through it. Below the price, ${quote} alone.`}
        >
          {block(190)}
          <PriceLine x={110} />
          <Axis />
        </Panel>
      </div>
      <figcaption className="diagram__caption">Illustrative shapes, not live pool data.</figcaption>
    </figure>
  );
}
