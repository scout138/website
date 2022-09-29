import { Resource, component$ } from '@builder.io/qwik';
import { RequestHandler, StaticGenerateHandler, useEndpoint } from '@builder.io/qwik-city';
import { getContent, getData } from '~/libs/cms';
import NotFound from '../not-found/index';

export const onGet: RequestHandler<{ page: string; side?: string | null }> = async ({ url, response, abort }) => {
  if (url.pathname.match(/\.\w+$/)) {
    // probably a static file
    abort();
    return;
  }

  let [page, side] = await Promise.all([
    getContent('page', url),
    getContent('side-bar', url),
  ]);
  if (!page) {
    if (!url.searchParams.get('__builder_editing__')) {
      response.status = 404;
      return null;
    }

    page = '';
  }

  return { page, side };
};

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();
  return (
    <Resource
      value={resource}
      onResolved={(resolved) => (
        resolved ? (
          resolved.side ? (
            <div className="Page">
              {resolved.side && (
                <div
                  className="right-side"
                  dangerouslySetInnerHTML={resolved.side}
                />
              )}
              <div
                className={"left-side"}
                dangerouslySetInnerHTML={resolved.page}
              />
            </div>
          ) : (
            <div
              className={'Page single-column'}
              dangerouslySetInnerHTML={resolved.page}
            />
          )
        ) : (
          <NotFound />
        )
      )}
    />
  );
});

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const results = await getData<{ url: string }>('page');
  return {
    params: results!.flatMap(({ data: { url } }: any) => {
      const parts = url.slice(1).split('/');
      if (parts.length > 1) {
        return [];
      }

      return { pageId: parts[0] };
    }),
  };
};
