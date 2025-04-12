import MapDetailClient from './page-client';

export default async function MapDetail({ params }: { params: { id: string } }) {
  const id = await Promise.resolve(params.id);
  return <MapDetailClient id={id} />;
}
