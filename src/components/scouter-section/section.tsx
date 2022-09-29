import { component$, useStyles$ } from '@builder.io/qwik';
import styles from './section.scss?inline';
import Scouter, { ScouterDefinition } from './scouter';
import { DataResult } from '~/libs/cms';

export type SectionDefinition = DataResult<{
  leaders: Array<{ leader: { id: string } | ScouterDefinition }>;
}>;

export interface MenuProps {
  section: SectionDefinition;
}

export default component$(({ section }: MenuProps) => {
  useStyles$(styles);

  return (
    <div className="Section block">
      <div className="title">{section.name}</div>
      <div className="Section-container">
        {section.data.leaders.map(({ leader }) => <Scouter id={leader.id} scouter={(leader as any).name && leader} />)}
      </div>
    </div>
  );
});
