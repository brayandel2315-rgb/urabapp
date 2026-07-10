import { useHomeGreetingVariant } from '@/hooks/useHomeGreetingVariant';

function formatFirstName(name) {
  if (!name) return '';
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export default function HomePersonalizedGreeting({ firstName, userId, className = '' }) {
  const displayName = formatFirstName(firstName);
  const variant = useHomeGreetingVariant(userId);

  if (!displayName) return null;

  const isWelcomeBack = variant === 'welcome-back';
  const leadText = isWelcomeBack ? 'Bienvenido nuevamente,' : 'Hola,';

  return (
    <div
      className={`home-personalized-greeting ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <p className="home-personalized-greeting__hello">
        <span className="home-personalized-greeting__hello-text">{leadText}</span>{' '}
        <span className="home-personalized-greeting__name">{displayName}</span>
        {!isWelcomeBack && (
          <span className="home-personalized-greeting__emoji" aria-hidden> 👋</span>
        )}
      </p>
    </div>
  );
}
