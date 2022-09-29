const apiKey = '6b4a5dc477794ac592ad32dc257cef20';

export async function getContent(model: string, url: string | URL): Promise<string | null> {
  const parsedUrl = new URL(url);
  if (parsedUrl.searchParams.get('__builder_editing__') === 'true' && parsedUrl.searchParams.get('builder.preview') === model) {
    return `<builder-component model="${model}" api-key="${apiKey}"></builder-component><script async src="https://cdn.builder.io/js/webcomponents"></script>`
  }

  const res = await fetch('https://cdn.builder.io/api/v1/qwik/' + model + '?' + new URLSearchParams({
    apiKey: apiKey,
    url: parsedUrl.pathname,
  }));
  if (!res.ok) {
    return null;
  }

  const { html } = await res.json();
  if (!html) {
    return null;
  }

  return html;
}

export interface DataResult<T = unknown> {
  id: string;
  name: string;
  data: T;
}

export async function getData<T>(model: string, id?: string): Promise<Array<T extends DataResult<infer U> ? DataResult<U> : DataResult<T>> | null> {
  const res = await fetch('https://cdn.builder.io/api/v2/content/' + model + '?' + new URLSearchParams({
    apiKey: apiKey,
    ...(id ? { 'query.id': id } : {}),
  }));
  if (!res.ok) {
    return null;
  }

  return (await res.json()).results;
}
