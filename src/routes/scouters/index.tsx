import { Resource, component$, useStyles$ } from '@builder.io/qwik';
import { RequestHandler, useEndpoint } from '@builder.io/qwik-city';
import { ScouterDefinition } from '~/components/scouter-section/scouter';
import { getData } from '~/libs/cms';
import Section, { SectionDefinition } from '../../components/scouter-section/section';

export const onGet: RequestHandler<SectionDefinition[]> = async () => {
  return (await Promise.all(
    ((await getData<SectionDefinition>('section-leaders')) || []).map(async (section) => ({
      ...section,
      data: {
        leaders: await Promise.all(section.data.leaders.map(async ({ leader }) => ({
          leader: (await getData<ScouterDefinition>('leaders', leader.id))?.[0] || leader,
        }))),
      },
    })),
  )).sort(({ name: a }, { name: b }) => a.localeCompare(b));
};

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();

  return (
    <div className="Scouters single-column">
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onRejected={() => <div>Error</div>}
        onResolved={(sections) => (<>{Array.from(sections, (section) => <Section section={section} />)}</>)}
      />
    </div>
  );
});
