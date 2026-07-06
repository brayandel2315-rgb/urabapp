import AppIcon from '@/design-system/icons/AppIcon';

const PILLS = [
  { icon: 'map', label: 'Local' },
  { icon: 'lock', label: 'Confianza' },
  { icon: 'delivery', label: 'Rápido' },
  { icon: 'verified', label: 'Cerca' },
];

export default function TrustPills({ className }) {
  return (
    <ul className={className ?? 'flex flex-wrap gap-2'}>
      {PILLS.map((pill) => (
        <li
          key={pill.label}
          className="trust-pill inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold shadow-soft"
        >
          <AppIcon name={pill.icon} size={14} className="text-[#28B463]" />
          {pill.label}
        </li>
      ))}
    </ul>
  );
}
