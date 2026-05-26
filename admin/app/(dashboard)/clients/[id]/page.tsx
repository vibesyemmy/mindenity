import { notFound } from "next/navigation";

import { ClientDetail } from "@/components/clients/client-detail";
import { getClient } from "@/lib/dummy/clients";

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
