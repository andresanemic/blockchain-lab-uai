const ITEMS = [
  'Blockchain', '·', 'Confianza Digital', '·', 'Smart Contracts', '·',
  'UAI Lab', '·', 'Trazabilidad', '·', 'Transparencia', '·',
  'Inmutabilidad', '·', 'Santiago · Chile', '·', 'Web3', '·',
  'Blockchain', '·', 'Confianza Digital', '·', 'Smart Contracts', '·',
  'UAI Lab', '·', 'Trazabilidad', '·', 'Transparencia', '·',
  'Inmutabilidad', '·', 'Santiago · Chile', '·', 'Web3', '·',
]

const LABEL = 'var(--font-oswald, var(--font-inter))'

export default function MarqueeV2({ dark = false }: { dark?: boolean }) {
  const bg     = dark ? '#080D2B' : '#F8F8F4'
  const border = dark ? 'rgba(248,248,244,0.07)' : 'rgba(8,13,43,0.08)'
  const color  = dark ? 'rgba(248,248,244,0.35)' : 'rgba(8,13,43,0.30)'
  const dot    = dark ? 'rgba(0,87,255,0.6)'  : '#0057FF'

  return (
    <div style={{
      background: bg,
      borderTop: `1px solid ${border}`,
      borderBottom: `1px solid ${border}`,
      padding: '13px 0',
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      <div
        className="marquee-track"
        style={{ display: 'flex', gap: '0', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {ITEMS.map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: '11px',
              fontFamily: LABEL,
              fontWeight: item === '·' ? 400 : 500,
              letterSpacing: item === '·' ? '0' : '0.16em',
              textTransform: 'uppercase',
              color: item === '·' ? dot : color,
              padding: '0 20px',
              display: 'inline-block',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
