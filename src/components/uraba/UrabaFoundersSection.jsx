import { Link } from 'react-router-dom';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import {
  URABAPP_FOUNDERS,
  URABAPP_TEAM,
  URABAPP_TEAM_INTRO,
} from '@/data/urabapp-team';
import { cn } from '@/lib/utils';

function MemberAvatar({ initials, collective = false, large = false, photo, name }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name ? `Foto de ${name}` : ''}
        className={cn(
          'shrink-0 rounded-2xl object-cover shadow-md ring-2 ring-primary/20',
          large ? 'h-20 w-20' : 'h-14 w-14'
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-2xl font-black text-white shadow-md',
        large ? 'h-20 w-20 text-xl' : 'h-14 w-14 text-base',
        collective ? 'bg-secondary' : 'bg-primary'
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function FounderCard({ member }) {
  return (
    <SurfaceCard variant="highlight" className="relative overflow-hidden">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10" aria-hidden />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
        <MemberAvatar initials={member.initials} photo={member.photo} name={member.name} large />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Fundador</p>
          <p className="text-heading mt-1 text-xl sm:text-2xl">{member.name}</p>
          <p className="text-sm font-semibold text-primary">{member.role}</p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <AppIcon name="map" size="xs" />
            {member.municipio} · {member.region || 'Urabá'}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
          {member.quote && (
            <blockquote className="mt-4 border-l-2 border-primary/40 pl-4 text-sm italic leading-relaxed text-foreground">
              "{member.quote}"
            </blockquote>
          )}
        </div>
      </div>
    </SurfaceCard>
  );
}

function TeamCard({ member }) {
  return (
    <SurfaceCard className="flex gap-3">
      <MemberAvatar initials={member.initials} collective={member.collective} />
      <div className="min-w-0 flex-1">
        <p className="text-subheading text-sm">{member.name}</p>
        <p className="text-xs font-semibold text-primary">{member.role}</p>
        <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <AppIcon name="map" size="xs" />
          {member.municipio}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{member.bio}</p>
      </div>
    </SurfaceCard>
  );
}

export default function UrabaFoundersSection({ className }) {
  return (
    <section className={className}>
      <SectionTitle>Quién lo construye</SectionTitle>
      <p className="mb-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
        {URABAPP_TEAM_INTRO}
      </p>

      <div className="space-y-4">
        {URABAPP_FOUNDERS.map((member) => (
          <FounderCard key={member.id} member={member} />
        ))}

        {URABAPP_TEAM.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Red que crece con la región
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {URABAPP_TEAM.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}
      </div>

      <SurfaceCard variant="muted" className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">¿Quieres sumarte al equipo?</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Buscamos mensajeros, aliados comerciales y talento del Urabá.
          </p>
        </div>
        <Link
          to="/soporte"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:underline"
        >
          Escríbenos en soporte
          <AppIcon name="chat" size="xs" />
        </Link>
      </SurfaceCard>
    </section>
  );
}
