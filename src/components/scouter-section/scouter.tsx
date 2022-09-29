import { component$, Resource, useResource$, useStore, useStyles$ } from '@builder.io/qwik';
import styles from './scouter.scss?inline';
import { getData, DataResult } from '../../libs/cms';

export type ScouterDefinition = DataResult<{
  headshot: string;
  title: string;
}>;

export interface ScouterProps {
  id: string;
  scouter?: ScouterDefinition | null;
}

export default component$((props: ScouterProps) => {
  useStyles$(styles);

  const scouter = useResource$<ScouterDefinition | undefined>(async (ctx) => {
    ctx.track(props, 'id');
    ctx.track(props, 'scouter');

    return props.scouter || (await getData<ScouterDefinition>('leaders', props.id))?.[0];
  });

  return (
    <Resource
      value={scouter}
      onResolved={(scouter) => scouter ? (
        <div className="Scouter">
          <div className="Scouter-name">{scouter.name}</div>
          <img
            src={scouter.data.headshot || '/generic.jpg'}
            className="Scouter-portrait"
            alt={scouter.name}
          />
          <div className="Scouter-title ng-binding">{scouter.data.title}</div>
        </div>
      ) : (
        <div></div>
      )}
    />
  );
});