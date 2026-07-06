import { PageState } from '@/design-system/patterns/PageState';

export default function EmptyState({ title, description, action, icon = 'empty' }) {
  return (
    <PageState
      type="empty"
      icon={icon}
      title={title}
      description={description}
      action={action}
    />
  );
}
