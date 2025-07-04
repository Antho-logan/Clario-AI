export interface BehaviorLoop {
  id: string;
  icon: string;
  title: string;
  summary: string;
}

export const behaviorLoops: BehaviorLoop[] = [
  {
    id: 'procrastination',
    icon: '⏳',
    title: 'Procrastinating on goals',
    summary: 'I keep making plans, but I never follow through. I feel overwhelmed before I even start.',
  },
  {
    id: 'avoidance',
    icon: '🙈',
    title: 'Avoiding discomfort',
    summary: 'When something feels uncertain or hard, I avoid it and do something easier instead.',
  },
  {
    id: 'burnout',
    icon: '🔥',
    title: 'Burning out',
    summary: 'I push too hard without rest. Then I crash and feel guilty for not being productive.',
  },
];