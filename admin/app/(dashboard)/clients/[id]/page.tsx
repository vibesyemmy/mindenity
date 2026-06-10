import { notFound } from "next/navigation";

import { ClientDetail } from "@/components/clients/client-detail";
import { getClient, getClients } from "@/lib/dummy/clients";

export function generateStaticParams() {
  return getClients().map((c) => ({ id: c.id }));
}

type Params = Promise<{ id: string }>;

export default async function ClientDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) notFound();

  return <ClientDetail client={client} />;
}
